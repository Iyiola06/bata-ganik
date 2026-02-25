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
// Creates a Stripe PaymentIntent and returns the clientSecret for the frontend
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { orderId, amount, currency } = schema.parse(body)

        // Amount in smallest unit (cents/pence)
        const amountInSmallestUnit = Math.round(amount * 100)

        const paymentIntent = await getStripe().paymentIntents.create({
            amount: amountInSmallestUnit,
            currency,
            automatic_payment_methods: { enabled: true },
            metadata: { orderId },
            description: `Bata Ganik Order`,
        })

        // Store the payment reference
        await prisma.order.update({
            where: { id: orderId },
            data: { paymentRef: paymentIntent.id },
        })

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        })
    } catch (error) {
        console.error('[POST /api/payments/stripe/initialize]', error)
        return NextResponse.json({ error: 'Failed to initialize payment' }, { status: 500 })
    }
}
