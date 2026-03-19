import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic';

// GET /api/admin/analytics — full analytics data for the analytics page
export async function GET() {
    try {
        const [
            totalRevenueResult,
            totalOrders,
            totalCustomers,
            ordersByStatus,
            revenueByMonth,
            topProducts,
        ] = await Promise.all([
            // Total revenue (paid) converted to NGN
            prisma.$queryRaw<{ total: number }[]>`
                SELECT COALESCE(SUM(
                    CASE 
                        WHEN currency = 'USD' THEN total * 1100
                        WHEN currency = 'GBP' THEN total * 1400
                        WHEN currency = 'EUR' THEN total * 1200
                        ELSE total 
                    END
                ), 0)::float as total
                FROM orders
                WHERE "paymentStatus" = 'PAID'
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
            // Revenue by month (last 12 months) converted to NGN
            prisma.$queryRaw<{ month: string; month_num: number; value: number }[]>`
                SELECT
                  TO_CHAR("createdAt", 'Mon YY') as month,
                  EXTRACT(EPOCH FROM DATE_TRUNC('month', "createdAt")) as month_num,
                  COALESCE(SUM(
                    CASE 
                        WHEN currency = 'USD' THEN total * 1100
                        WHEN currency = 'GBP' THEN total * 1400
                        WHEN currency = 'EUR' THEN total * 1200
                        ELSE total 
                    END
                  ), 0)::float as value
                FROM orders
                WHERE "paymentStatus" = 'PAID'
                  AND "createdAt" >= NOW() - INTERVAL '12 months'
                GROUP BY TO_CHAR("createdAt", 'Mon YY'), DATE_TRUNC('month', "createdAt")
                ORDER BY DATE_TRUNC('month', "createdAt") ASC
            `,
            // Top products by revenue converted to NGN
            prisma.$queryRaw<{ name: string; revenue: number; units: number }[]>`
                SELECT
                  p.name,
                  COALESCE(SUM(
                    CASE 
                        WHEN o.currency = 'USD' THEN oi."lineTotal" * 1100
                        WHEN o.currency = 'GBP' THEN oi."lineTotal" * 1400
                        WHEN o.currency = 'EUR' THEN oi."lineTotal" * 1200
                        ELSE oi."lineTotal" 
                    END
                  ), 0)::float as revenue,
                  COALESCE(SUM(oi.quantity), 0)::integer as units
                FROM products p
                JOIN order_items oi ON oi."productId" = p.id
                JOIN orders o ON o.id = oi."orderId"
                WHERE o."paymentStatus" = 'PAID'
                GROUP BY p.id, p.name
                ORDER BY revenue DESC
                LIMIT 5
            `,
        ])

        const totalRev = Number(totalRevenueResult[0]?.total || 0)
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
