import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/stats — dashboard overview numbers
export async function GET() {
    try {
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

        const [
            totalRevenue,
            revenueThisMonth,
            revenueLastMonth,
            totalOrders,
            ordersThisMonth,
            ordersLastMonth,
            activeProducts,
            lowStockVariants,
            recentOrders,
            revenueByMonth,
        ] = await Promise.all([
            // Total revenue (paid orders)
            prisma.order.aggregate({
                where: { paymentStatus: 'PAID' },
                _sum: { total: true },
            }),
            prisma.order.aggregate({
                where: { paymentStatus: 'PAID', createdAt: { gte: startOfMonth } },
                _sum: { total: true },
            }),
            prisma.order.aggregate({
                where: {
                    paymentStatus: 'PAID',
                    createdAt: { gte: startOfLastMonth, lt: startOfMonth },
                },
                _sum: { total: true },
            }),
            // Orders count
            prisma.order.count(),
            prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
            prisma.order.count({
                where: { createdAt: { gte: startOfLastMonth, lt: startOfMonth } },
            }),
            // Products
            prisma.product.count({ where: { isPublished: true } }),
            prisma.productVariant.count({ where: { stockQty: { lte: 5 } } }),
            // Recent orders
            prisma.order.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: {
                    items: { take: 1, include: { product: true } },
                },
            }),
            // Revenue by month (last 6 months) — raw query for chart
            prisma.$queryRaw`
        SELECT
          TO_CHAR(created_at, 'Mon') as month,
          EXTRACT(MONTH FROM created_at) as month_num,
          COALESCE(SUM(total), 0) as value
        FROM orders
        WHERE payment_status = 'PAID'
          AND created_at >= NOW() - INTERVAL '6 months'
        GROUP BY TO_CHAR(created_at, 'Mon'), EXTRACT(MONTH FROM created_at)
        ORDER BY month_num ASC
      `,
        ])

        const prevRevenue = revenueLastMonth._sum.total ?? 0
        const currRevenue = revenueThisMonth._sum.total ?? 0
        const revenueChange = prevRevenue > 0
            ? Math.round(((currRevenue - prevRevenue) / prevRevenue) * 100)
            : 0

        const ordersChange = ordersLastMonth > 0
            ? Math.round(((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100)
            : 0

        return NextResponse.json({
            revenue: {
                total: totalRevenue._sum.total ?? 0,
                thisMonth: currRevenue,
                change: revenueChange,
            },
            orders: {
                total: totalOrders,
                thisMonth: ordersThisMonth,
                change: ordersChange,
            },
            products: {
                active: activeProducts,
                lowStock: lowStockVariants,
            },
            recentOrders,
            revenueByMonth,
        })
    } catch (error) {
        console.error('[GET /api/admin/stats]', error)
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
    }
}
