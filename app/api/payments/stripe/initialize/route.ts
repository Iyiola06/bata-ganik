import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
    orderId: z.string(),
    amount: z.number(),
    currency: z.enum(['usd', 'gbp', 'eur']).default('usd'),
})

// POST /api/payments/stripe/initialize
// Creates a Stripe Checkout Session and returns the url for redirection
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { orderId, amount, currency } = schema.parse(body)

        const appUrl = process.env.NEXT_PUBLIC_APP_URL

        const session = await getStripe().checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: currency.toLowerCase(),
                        product_data: {
                            name: `Order #${orderId}`,
                            description: 'Bata Ganik Luxury Footwear',
                        },
                        unit_amount: Math.round(amount * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            client_reference_id: orderId,
            metadata: { orderId },
            payment_intent_data: {
                metadata: { orderId },
            },
            success_url: `${appUrl}/order-confirmation?orderId=${orderId}`,
            cancel_url: `${appUrl}/checkout`,
        })

        // Store the initial payment reference (Session ID)
        await prisma.order.update({
            where: { id: orderId },
            data: { paymentRef: session.id },
        })

        return NextResponse.json({
            url: session.url,
            sessionId: session.id,
        })
    } catch (error: any) {
        console.error('[POST /api/payments/stripe/initialize]', error)
        return NextResponse.json({ error: error?.message || 'Failed to initialize payment' }, { status: 500 })
    }
}
