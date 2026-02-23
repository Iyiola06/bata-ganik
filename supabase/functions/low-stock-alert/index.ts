import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Supabase Edge Function: low-stock-alert
// Trigger: Database webhook on product_variants table when stock_qty changes
// Deploy: supabase functions deploy low-stock-alert

serve(async (req) => {
    const payload = await req.json()

    // Only trigger when stock_qty drops to 5 or below
    const { record, old_record } = payload
    if (!record || record.stock_qty > 5 || old_record?.stock_qty <= 5) {
        return new Response('No alert needed', { status: 200 })
    }

    const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get product name for the alert
    const { data: product } = await supabase
        .from('products')
        .select('name, sku')
        .eq('id', record.product_id)
        .single()

    const productName = product?.name ?? 'Unknown Product'
    const sku = product?.sku ?? record.product_id

    // Send alert email via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: `Bata Ganik Alerts <alerts@bataganik.com>`,
            to: 'admin@bataganik.com',
            subject: `⚠️ Low Stock Alert: ${productName}`,
            html: `
        <h2>Low Stock Alert</h2>
        <p><strong>Product:</strong> ${productName} (${sku})</p>
        <p><strong>Size:</strong> EU ${record.size_eu}</p>
        <p><strong>Colour:</strong> ${record.color ?? 'N/A'}</p>
        <p><strong>Remaining Stock:</strong> <span style="color: red; font-weight: bold;">${record.stock_qty} units</span></p>
        <p>Please restock soon to avoid stockouts.</p>
        <a href="https://bata-ganik.vercel.app/admin/products">View in Admin →</a>
      `,
        }),
    })

    if (!resendResponse.ok) {
        console.error('Failed to send low-stock email:', await resendResponse.text())
    }

    return new Response(JSON.stringify({ alerted: true, product: productName }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
    })
})
