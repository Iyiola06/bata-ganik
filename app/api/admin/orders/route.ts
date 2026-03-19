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
                    const { sendOrderStatusUpdateEmail } = await import('@/lib/email')
                    const firstName = order.guestFirstName || order.customer?.firstName || 'Customer'
                    
                    await sendOrderStatusUpdateEmail(
                        recipientEmail,
                        firstName,
                        order.orderNumber,
                        newStatus
                    )
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
