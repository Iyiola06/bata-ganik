import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/analytics — full analytics data for the analytics page
export async function GET() {
    try {
        const [
            totalRevenue,
            totalOrders,
            totalCustomers,
            ordersByStatus,
            revenueByMonth,
            topProducts,
        ] = await Promise.all([
            // Total revenue (paid)
            prisma.order.aggregate({
                where: { paymentStatus: 'PAID' },
                _sum: { total: true },
            }),
            // Total orders
            prisma.order.count(),
            // Total registered customers
            prisma.customer.count(),
            // Orders grouped by status
            prisma.order.groupBy({
                by: ['status'],
                _count: { id: true },
            }),
            // Revenue by month (last 12 months)
            prisma.$queryRaw<{ month: string; month_num: number; value: number }[]>`
                SELECT
                  TO_CHAR(created_at, 'Mon YY') as month,
                  EXTRACT(EPOCH FROM DATE_TRUNC('month', created_at)) as month_num,
                  COALESCE(SUM(total), 0)::float as value
                FROM orders
                WHERE payment_status = 'PAID'
                  AND created_at >= NOW() - INTERVAL '12 months'
                GROUP BY TO_CHAR(created_at, 'Mon YY'), DATE_TRUNC('month', created_at)
                ORDER BY DATE_TRUNC('month', created_at) ASC
            `,
            // Top products by revenue
            prisma.$queryRaw<{ name: string; revenue: number; units: number }[]>`
                SELECT
                  p.name,
                  COALESCE(SUM(oi.line_total), 0)::float as revenue,
                  COALESCE(SUM(oi.quantity), 0)::integer as units
                FROM products p
                JOIN order_items oi ON oi.product_id = p.id
                JOIN orders o ON o.id = oi.order_id
                WHERE o.payment_status = 'PAID'
                GROUP BY p.id, p.name
                ORDER BY revenue DESC
                LIMIT 5
            `,
        ])

        const totalRev = totalRevenue._sum.total ?? 0
        const avgOrderValue = totalOrders > 0 ? totalRev / totalOrders : 0

        return NextResponse.json({
            kpis: {
                revenue: totalRev,
                orders: totalOrders,
                avgOrderValue,
                customers: totalCustomers,
            },
            revenueByMonth: (revenueByMonth as any[]).map((r) => ({
                name: r.month,
                value: Number(r.value),
            })),
            topProducts: (topProducts as any[]).map((p) => ({
                name: p.name,
                revenue: Number(p.revenue),
                units: Number(p.units),
            })),
            ordersByStatus: ordersByStatus.map((s) => ({
                status: s.status,
                count: s._count.id,
            })),
        })
    } catch (error) {
        console.error('[GET /api/admin/analytics]', error)
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
    }
}
