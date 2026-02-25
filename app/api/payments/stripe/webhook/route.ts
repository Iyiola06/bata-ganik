import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmationEmail } from '@/lib/email'

export const maxDuration = 30

// POST /api/payments/stripe/webhook
// Verifies and handles Stripe webhook events
export async function POST(request: NextRequest) {
    const rawBody = await request.text()
    const signature = request.headers.get('stripe-signature')

    let event

    try {
        event = stripe.webhooks.constructEvent(
            rawBody,
            signature!,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err: any) {
        console.error('[Stripe webhook] Signature verification failed:', err.message)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    try {
        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object
            const orderId = paymentIntent.metadata?.orderId

            if (!orderId) return NextResponse.json({ received: true })

            const order = await prisma.order.findUnique({
                where: { id: orderId },
                include: { items: true },
            })

            if (!order || order.paymentStatus === 'PAID') {
                return NextResponse.json({ received: true })
            }

            await prisma.$transaction([
                prisma.transaction.create({
                    data: {
                        orderId,
                        gateway: 'stripe',
                        reference: paymentIntent.id,
                        amount: paymentIntent.amount / 100,
                        currency: paymentIntent.currency.toUpperCase(),
                        status: 'success',
                        metadata: {
                            payment_method: paymentIntent.payment_method,
                            amount_received: paymentIntent.amount_received,
                        } as any,
                    },
                }),
                prisma.order.update({
                    where: { id: orderId },
                    data: {
                        paymentStatus: 'PAID',
                        status: 'PROCESSING',
                        paymentRef: paymentIntent.id,
                    },
                }),
            ])

            const email = order.guestEmail ?? ''
            if (email) {
                try {
                    await sendOrderConfirmationEmail(email, order as any)
                } catch (emailErr) {
                    console.error('[Stripe webhook] Email send failed:', emailErr)
                }
            }
        }

        if (event.type === 'payment_intent.payment_failed') {
            const paymentIntent = event.data.object
            const orderId = paymentIntent.metadata?.orderId
            if (orderId) {
                await prisma.transaction.create({
                    data: {
                        orderId,
                        gateway: 'stripe',
                        reference: paymentIntent.id,
                        amount: paymentIntent.amount / 100,
                        currency: paymentIntent.currency.toUpperCase(),
                        status: 'failed',
                        metadata: { error: paymentIntent.last_payment_error } as any,
                    },
                })
            }
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error('[Stripe webhook] Processing error:', error)
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
    }
}
