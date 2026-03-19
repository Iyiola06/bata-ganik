import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic';

// Helper for SQL currency conversion to NGN
const SQL_CONVERT_TO_NGN = `
    CASE 
        WHEN currency = 'USD' THEN total * 1100
        WHEN currency = 'GBP' THEN total * 1400
        WHEN currency = 'EUR' THEN total * 1200
        ELSE total 
    END
`

// GET /api/admin/stats — dashboard overview numbers
export async function GET() {
    try {
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

        const [
            totalRevResult,
            thisMonthRevResult,
            lastMonthRevResult,
            totalOrders,
            ordersThisMonth,
            ordersLastMonth,
            pendingOrders,
            activeProducts,
            lowStockVariants,
            recentOrders,
            revenueByMonth,
        ] = await Promise.all([
            // Total revenue (paidorders) converted to NGN
            prisma.$queryRaw<{ total: number }[]>`
                SELECT COALESCE(SUM(${Prisma.raw(SQL_CONVERT_TO_NGN)}), 0)::float as total
                FROM orders WHERE "paymentStatus" = 'PAID'
            `,
            // Total Order Value (all orders) converted to NGN
            prisma.$queryRaw<{ total: number }[]>`
                SELECT COALESCE(SUM(${Prisma.raw(SQL_CONVERT_TO_NGN)}), 0)::float as total
                FROM orders
            `,
            // Total orders
            prisma.order.count(),
            // Total registered customers
            prisma.customer.count(),
            // Orders grouped by status
            prisma.order.groupBy({
                by: ['status'],
                _count: { id: true },
            }),
            // Revenue by month (last 6 months) — raw query for chart
            prisma.$queryRaw`
                SELECT
                    TO_CHAR("createdAt", 'Mon') as name,
                    DATE_TRUNC('month', "createdAt") as month_date,
                    COALESCE(SUM(${Prisma.raw(SQL_CONVERT_TO_NGN)}), 0)::float as value
                FROM orders
                WHERE "paymentStatus" = 'PAID'
                  AND "createdAt" >= NOW() - INTERVAL '6 months'
                GROUP BY TO_CHAR("createdAt", 'Mon'), DATE_TRUNC('month', "createdAt")
                ORDER BY DATE_TRUNC('month', "createdAt") ASC
            `,
        ])

        const totalRevenue = Number(totalRevResult[0]?.total || 0)
        const totalValue = Number(thisMonthRevResult[0]?.total || 0)

        const pendingCount = await prisma.order.count({ where: { status: 'PENDING' } })
        const activeProds = await prisma.product.count({ where: { isPublished: true } })
        const lowStock = await prisma.productVariant.count({ where: { stockQty: { lte: 5 } } })
        const recent = await prisma.order.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: { items: { take: 1, include: { product: true } } }
        })

        return NextResponse.json({
            revenue: {
                total: totalRevenue,
                totalValue: totalValue,
                change: 0, // Placeholder
            },
            orders: {
                total: totalOrders,
                pending: pendingCount,
                change: 0,
            },
            products: {
                total: activeProds,
                lowStock: lowStock,
            },
            recentOrders: recent,
            revenueByMonth: (revenueByMonth as any[]).map(r => ({
                name: r.name,
                value: Number(r.value)
            })),
        })
    } catch (error: any) {
        console.error('[GET /api/admin/stats]', error)
        return NextResponse.json({ error: error?.message || 'Failed to fetch stats' }, { status: 500 })
    }
}
