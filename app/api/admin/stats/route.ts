import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
            // Total revenue (paid orders) converted to NGN
            prisma.$queryRaw<{ total: number }[]>`
                SELECT COALESCE(SUM(${prisma.raw(SQL_CONVERT_TO_NGN)}), 0)::float as total
                FROM orders WHERE "paymentStatus" = 'PAID'
            `,
            // This month revenue
            prisma.$queryRaw<{ total: number }[]>`
                SELECT COALESCE(SUM(${prisma.raw(SQL_CONVERT_TO_NGN)}), 0)::float as total
                FROM orders WHERE "paymentStatus" = 'PAID' AND "createdAt" >= ${startOfMonth}
            `,
            // Last month revenue
            prisma.$queryRaw<{ total: number }[]>`
                SELECT COALESCE(SUM(${prisma.raw(SQL_CONVERT_TO_NGN)}), 0)::float as total
                FROM orders 
                WHERE "paymentStatus" = 'PAID' 
                  AND "createdAt" >= ${startOfLastMonth} AND "createdAt" < ${startOfMonth}
            `,
            
            // Orders count
            prisma.order.count(),
            prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
            prisma.order.count({
                where: { createdAt: { gte: startOfLastMonth, lt: startOfMonth } },
            }),
            prisma.order.count({ where: { status: 'PENDING' } }),
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
                    TO_CHAR("createdAt", 'Mon') as name,
                    DATE_TRUNC('month', "createdAt") as month_date,
                    COALESCE(SUM(${prisma.raw(SQL_CONVERT_TO_NGN)}), 0)::float as value
                FROM orders
                WHERE "paymentStatus" = 'PAID'
                  AND "createdAt" >= NOW() - INTERVAL '6 months'
                GROUP BY TO_CHAR("createdAt", 'Mon'), DATE_TRUNC('month', "createdAt")
                ORDER BY DATE_TRUNC('month', "createdAt") ASC
            `,
        ])

        const totalRevenue = Number(totalRevResult[0]?.total || 0)
        const currRevenue = Number(thisMonthRevResult[0]?.total || 0)
        const prevRevenue = Number(lastMonthRevResult[0]?.total || 0)

        const revenueChange = prevRevenue > 0
            ? Math.round(((currRevenue - prevRevenue) / prevRevenue) * 100)
            : 0

        const ordersChange = ordersLastMonth > 0
            ? Math.round(((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100)
            : 0

        return NextResponse.json({
            revenue: {
                total: totalRevenue,
                thisMonth: currRevenue,
                change: revenueChange,
            },
            orders: {
                total: totalOrders,
                thisMonth: ordersThisMonth,
                change: ordersChange,
                pending: pendingOrders,
            },
            products: {
                total: activeProducts,
                lowStock: lowStockVariants,
            },
            recentOrders,
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
