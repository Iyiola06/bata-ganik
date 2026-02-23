import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/customers — paginated customer list
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page') ?? 1)
    const limit = Number(searchParams.get('limit') ?? 20)
    const search = searchParams.get('search') ?? ''

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
