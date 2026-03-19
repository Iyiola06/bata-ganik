import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { Resend } from 'resend'

function getResend() {
    return new Resend(process.env.RESEND_API_KEY)
}

// GET /api/admin/orders — paginated orders with filters
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page') ?? 1)
    const limit = Number(searchParams.get('limit') ?? 20)
    const status = searchParams.get('status')
    const search = searchParams.get('search') ?? ''

    const where: any = {}
    if (status && status !== 'ALL') where.status = status
    if (search) {
        where.OR = [
            { orderNumber: { contains: search, mode: 'insensitive' } },
            { guestEmail: { contains: search, mode: 'insensitive' } },
            { guestFirstName: { contains: search, mode: 'insensitive' } },
            { guestLastName: { contains: search, mode: 'insensitive' } },
        ]
    }

    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    include: {
                        product: { include: { images: { where: { isMain: true }, take: 1 } } },
                    },
                },
                customer: true
            },
        }),
        prisma.order.count({ where }),
    ])

    return NextResponse.json({
        orders: orders.map((o) => ({
            ...o,
            itemCount: o.items.reduce((sum, item) => sum + item.quantity, 0)
        })),
        pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    })
}

const updateOrderSchema = z.object({
    status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']).optional(),
    paymentStatus: z.enum(['UNPAID', 'PAID', 'REFUNDED', 'PARTIALLY_REFUNDED']).optional(),
    notes: z.string().optional(),
})

// PATCH /api/admin/orders — update order status
export async function PATCH(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        if (!id) return NextResponse.json({ error: 'Order ID required' }, { status: 400 })

        const body = await request.json()
        const data = updateOrderSchema.parse(body)

        // Get current order before update
        const currentOrder = await prisma.order.findUnique({
            where: { id },
            include: { customer: true }
        })

        if (!currentOrder) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        const oldStatus = currentOrder.status
        const newStatus = data.status

        const order = await prisma.order.update({ 
            where: { id }, 
            data,
            include: { customer: true }
        })

        // Send email if status changed
        if (newStatus && newStatus !== oldStatus) {
            const recipientEmail = order.guestEmail || order.customer?.email
            if (recipientEmail) {
                try {
                    const firstName = order.guestFirstName || order.customer?.firstName || 'Customer'
                    
                    let statusLabel = newStatus.charAt(0) + newStatus.slice(1).toLowerCase()
                    let message = ''
                    
                    switch (newStatus) {
                        case 'PROCESSING':
                            statusLabel = 'Confirmed'
                            message = 'Good news! Your order has been confirmed and is now being prepared for you.'
                            break
                        case 'SHIPPED':
                            message = 'Exciting news! Your order has been dispatched and is on its way to you.'
                            break
                        case 'DELIVERED':
                            message = 'Your order has been delivered. We hope you love your new Bata Ganik pieces!'
                            break
                        case 'CANCELLED':
                            message = 'Your order has been cancelled. If you have any questions, please contact our concierge service.'
                            break
                    }

                    await getResend().emails.send({
                        from: process.env.EMAIL_FROM || 'Bata Ganik <orders@bataganik.com>',
                        to: recipientEmail,
                        subject: `Order Update: #${order.orderNumber} is now ${statusLabel}`,
                        html: `
                            <div style="font-family: serif; color: #1a2744; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 8px;">
                                <div style="text-align: center; margin-bottom: 40px;">
                                    <h1 style="text-transform: uppercase; letter-spacing: 2px; margin: 0;">Bata Ganik</h1>
                                    <p style="text-transform: uppercase; font-size: 10px; color: #c9a96e; letter-spacing: 1px;">House of Footwear</p>
                                </div>
                                <h2 style="font-size: 24px; margin-bottom: 20px;">Hello ${firstName},</h2>
                                <p style="font-size: 16px; line-height: 1.6; color: #4a5568;">
                                    ${message}
                                </p>
                                <div style="background-color: #f7fafc; padding: 25px; border-radius: 4px; margin: 30px 0;">
                                    <p style="margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #718096;">Order Status</p>
                                    <p style="margin: 5px 0 0; font-size: 20px; font-weight: bold; color: #2d3748;">${statusLabel}</p>
                                    <p style="margin: 15px 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #718096;">Order ID</p>
                                    <p style="margin: 5px 0 0; font-size: 16px; color: #2d3748;">#${order.orderNumber}</p>
                                </div>
                                <div style="text-align: center; margin: 40px 0;">
                                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/track-order" style="background-color: #1a2744; color: white; padding: 16px 32px; text-decoration: none; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; display: inline-block;">Track Your Order</a>
                                </div>
                                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 40px 0;" />
                                <div style="text-align: center; font-size: 12px; color: #a0aec0;">
                                    <p>© ${new Date().getFullYear()} Bata Ganik. All rights reserved.</p>
                                    <p>Victoria Island, Lagos, Nigeria</p>
                                </div>
                            </div>
                        `
                    })
                } catch (emailError) {
                    console.error('[Email Notification Error]', emailError)
                }
            }
        }

        return NextResponse.json({ order })
    } catch (error) {
        console.error('[PATCH /api/admin/orders]', error)
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
    }
}
