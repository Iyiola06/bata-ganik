import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { requireAdmin } from '@/lib/admin-auth'
import { apiError } from '@/lib/http'

const querySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    status: z.enum(['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']).optional(),
    search: z.string().default(''),
})

const patchQuerySchema = z.object({
    id: z.string().min(1),
})

// GET /api/admin/orders — paginated orders with filters
export async function GET(request: NextRequest) {
    const auth = await requireAdmin()
    if ('response' in auth) return auth.response

    const { searchParams } = new URL(request.url)
    const parsed = querySchema.safeParse(Object.fromEntries(searchParams))
    if (!parsed.success) {
        return apiError(400, 'Invalid query parameters', 'BAD_REQUEST', parsed.error.flatten())
    }
    const { page, limit, status, search } = parsed.data

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
    const auth = await requireAdmin()
    if ('response' in auth) return auth.response

    try {
        const { searchParams } = new URL(request.url)
        const parsedQuery = patchQuerySchema.parse(Object.fromEntries(searchParams))
        const { id } = parsedQuery

        const body = await request.json()
        const data = updateOrderSchema.parse(body)

        // Get current order before update
        const currentOrder = await prisma.order.findUnique({
            where: { id },
            include: { customer: true }
        })

        if (!currentOrder) {
            return apiError(404, 'Order not found', 'NOT_FOUND')
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
        if (error instanceof z.ZodError) {
            return apiError(400, 'Invalid order update payload', 'BAD_REQUEST', error.flatten())
        }
        console.error('[PATCH /api/admin/orders]', error)
        return apiError(500, 'Failed to update order', 'INTERNAL_ERROR')
    }
}
