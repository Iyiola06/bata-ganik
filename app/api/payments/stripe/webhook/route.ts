import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
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
        event = getStripe().webhooks.constructEvent(
            rawBody,
            signature!,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err: any) {
        console.error('[Stripe webhook] Signature verification failed:', err.message)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    try {
        const type = event.type
        console.log(`[Stripe Webhook] Received event: ${type}`)

        if (type === 'payment_intent.succeeded' || type === 'checkout.session.completed') {
            const dataObject = event.data.object as any
            const orderId = dataObject.metadata?.orderId || dataObject.client_reference_id

            if (!orderId) {
                console.warn('[Stripe Webhook] No orderId found in metadata/client_reference_id')
                return NextResponse.json({ received: true })
            }

            const order = await prisma.order.findUnique({
                where: { id: orderId },
                include: { items: true },
            })

            if (!order) {
                console.error('[Stripe Webhook] Order not found:', orderId)
                return NextResponse.json({ received: true })
            }

            if (order.paymentStatus === 'PAID') {
                console.log('[Stripe Webhook] Order already marked as PAID:', orderId)
                return NextResponse.json({ received: true })
            }

            // Mark as paid
            await prisma.$transaction([
                prisma.transaction.create({
                    data: {
                        orderId,
                        gateway: 'stripe',
                        reference: dataObject.id,
                        amount: (dataObject.amount_total || dataObject.amount || 0) / 100,
                        currency: (dataObject.currency || 'USD').toUpperCase(),
                        status: 'success',
                        metadata: dataObject,
                    },
                }),
                prisma.order.update({
                    where: { id: orderId },
                    data: {
                        paymentStatus: 'PAID',
                        status: 'PROCESSING',
                        paymentRef: dataObject.id,
                    },
                }),
            ])

            console.log('[Stripe Webhook] Order updated to PAID successfully:', orderId)

            const email = order.guestEmail || order.customer?.email
            if (email) {
                try {
                    const { sendOrderConfirmationEmail } = await import('@/lib/email')
                    await sendOrderConfirmationEmail(email, order as any)
                } catch (emailErr) {
                    console.error('[Stripe Webhook] Email send failed:', emailErr)
                }
            }
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error('[Stripe webhook] Processing error:', error)
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
    }
}
