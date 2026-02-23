import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createHmac } from 'crypto'
import { sendOrderConfirmationEmail } from '@/lib/email'

export const maxDuration = 30

// POST /api/payments/paystack/webhook
// Receives and verifies Paystack webhook events
export async function POST(request: NextRequest) {
    try {
        const rawBody = await request.text()
        const signature = request.headers.get('x-paystack-signature')

        // Verify HMAC signature to ensure it's genuinely from Paystack
        const hash = createHmac('sha512', process.env.PAYSTACK_WEBHOOK_SECRET!)
            .update(rawBody)
            .digest('hex')

        if (hash !== signature) {
            console.warn('[Paystack webhook] Invalid signature')
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
        }

        const event = JSON.parse(rawBody)

        if (event.event === 'charge.success') {
            const { reference, amount, currency, metadata } = event.data
            const orderId = metadata?.orderId

            if (!orderId) {
                return NextResponse.json({ received: true })
            }

            // Find the order
            const order = await prisma.order.findUnique({
                where: { id: orderId },
                include: { items: true },
            })

            if (!order) {
                console.error('[Paystack webhook] Order not found:', orderId)
                return NextResponse.json({ received: true })
            }

            // Idempotency check — skip if already paid
            if (order.paymentStatus === 'PAID') {
                return NextResponse.json({ received: true })
            }

            // Record the transaction + update order
            await prisma.$transaction([
                prisma.transaction.create({
                    data: {
                        orderId,
                        gateway: 'paystack',
                        reference,
                        amount: amount / 100, // convert kobo back to NGN
                        currency,
                        status: 'success',
                        metadata: event.data,
                    },
                }),
                prisma.order.update({
                    where: { id: orderId },
                    data: {
                        paymentStatus: 'PAID',
                        status: 'PROCESSING',
                        paymentRef: reference,
                    },
                }),
            ])

            // Send order confirmation email
            const email = order.guestEmail ?? ''
            if (email) {
                try {
                    await sendOrderConfirmationEmail(email, order as any)
                } catch (emailErr) {
                    console.error('[Paystack webhook] Email send failed:', emailErr)
                }
            }
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error('[POST /api/payments/paystack/webhook]', error)
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
    }
}
