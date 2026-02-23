import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
    orderId: z.string(),
    email: z.string().email(),
    amount: z.number(), // in NGN (e.g. 125000)
    currency: z.string().default('NGN'),
    callbackUrl: z.string().url().optional(),
})

// POST /api/payments/paystack/initialize
// Initializes a Paystack transaction and returns the authorization_url
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { orderId, email, amount, currency, callbackUrl } = schema.parse(body)

        const appUrl = process.env.NEXT_PUBLIC_APP_URL

        const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                amount: Math.round(amount * 100), // Paystack uses kobo (1 NGN = 100 kobo)
                currency,
                reference: `BG-${orderId}-${Date.now()}`,
                callback_url: callbackUrl ?? `${appUrl}/order-confirmation?orderId=${orderId}`,
                metadata: {
                    orderId,
                    cancel_action: `${appUrl}/checkout`,
                },
                channels: ['card', 'bank', 'ussd', 'bank_transfer', 'mobile_money', 'qr'],
            }),
        })

        const paystackData = await paystackResponse.json()

        if (!paystackData.status) {
            console.error('[Paystack init error]', paystackData)
            return NextResponse.json(
                { error: paystackData.message ?? 'Payment initialization failed' },
                { status: 400 }
            )
        }

        // Store the payment reference on the order
        await prisma.order.update({
            where: { id: orderId },
            data: { paymentRef: paystackData.data.reference },
        })

        return NextResponse.json({
            authorizationUrl: paystackData.data.authorization_url,
            reference: paystackData.data.reference,
            accessCode: paystackData.data.access_code,
        })
    } catch (error) {
        console.error('[POST /api/payments/paystack/initialize]', error)
        return NextResponse.json({ error: 'Failed to initialize payment' }, { status: 500 })
    }
}
