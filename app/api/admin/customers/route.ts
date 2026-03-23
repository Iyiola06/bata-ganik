import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { requireAdmin } from '@/lib/admin-auth'
import { apiError } from '@/lib/http'

const querySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().default(''),
})

// GET /api/admin/customers — paginated customer list
export async function GET(request: NextRequest) {
    const auth = await requireAdmin()
    if ('response' in auth) return auth.response

    const { searchParams } = new URL(request.url)
    const parsed = querySchema.safeParse(Object.fromEntries(searchParams))
    if (!parsed.success) {
        return apiError(400, 'Invalid query parameters', 'BAD_REQUEST', parsed.error.flatten())
    }
    const { page, limit, search } = parsed.data

    const where: any = {}
    if (search) {
        where.OR = [
            { email: { contains: search, mode: 'insensitive' } },
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
        ]
    }

    const [customers, total] = await Promise.all([
        prisma.customer.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                _count: { select: { orders: true } },
                orders: {
                    select: { total: true, paymentStatus: true },
                    where: { paymentStatus: 'PAID' },
                },
            },
        }),
        prisma.customer.count({ where }),
    ])

    return NextResponse.json({
        customers: customers.map((c) => ({
            ...c,
            totalSpend: c.orders.reduce((s, o) => s + o.total, 0),
            ordersCount: c._count.orders,
        })),
        pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    })
}
