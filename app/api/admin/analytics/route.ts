import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { requireAdmin } from '@/lib/admin-auth'
import { apiError } from '@/lib/http'

export const dynamic = 'force-dynamic';

const SQL_CONVERT_ORDER_TOTAL_TO_NGN = `
    CASE 
        WHEN currency = 'USD' THEN total * 1100
        WHEN currency = 'GBP' THEN total * 1400
        WHEN currency = 'EUR' THEN total * 1200
        ELSE total 
    END
`
const SQL_CONVERT_ORDER_ITEM_TOTAL_TO_NGN = `
    CASE 
        WHEN o.currency = 'USD' THEN oi."lineTotal" * 1100
        WHEN o.currency = 'GBP' THEN oi."lineTotal" * 1400
        WHEN o.currency = 'EUR' THEN oi."lineTotal" * 1200
        ELSE oi."lineTotal" 
    END
`

// GET /api/admin/analytics — full analytics data for the analytics page
export async function GET() {
    const auth = await requireAdmin()
    if ('response' in auth) return auth.response

    try {
        const [
            totalRevenueResult,
            totalOrderValueResult,
            totalOrders,
            totalCustomers,
            ordersByStatus,
            revenueByMonth,
            topProducts,
        ] = await Promise.all([
            // Total revenue (paid) converted to NGN
            prisma.$queryRaw<{ total: number }[]>`
                SELECT COALESCE(SUM(${Prisma.raw(SQL_CONVERT_ORDER_TOTAL_TO_NGN)}), 0)::float as total
                FROM orders WHERE "paymentStatus" = 'PAID'
            `,
            // Total Order Value (all orders) converted to NGN
            prisma.$queryRaw<{ total: number }[]>`
                SELECT COALESCE(SUM(${Prisma.raw(SQL_CONVERT_ORDER_TOTAL_TO_NGN)}), 0)::float as total
                FROM orders
            `,
            // Total orders count
            prisma.order.count(),
            // Total customers count
            prisma.customer.count(),
            // Orders grouped by status
            prisma.order.groupBy({
                by: ['status'],
                _count: { id: true },
            }),
            // Revenue by month (last 6 months)
            prisma.$queryRaw<{ month: string; value: number }[]>`
                SELECT
                    TO_CHAR("createdAt", 'Mon YY') as month,
                    COALESCE(SUM(${Prisma.raw(SQL_CONVERT_ORDER_TOTAL_TO_NGN)}), 0)::float as value
                FROM orders
                WHERE "paymentStatus" = 'PAID'
                  AND "createdAt" >= NOW() - INTERVAL '6 months'
                GROUP BY TO_CHAR("createdAt", 'Mon YY'), DATE_TRUNC('month', "createdAt")
                ORDER BY DATE_TRUNC('month', "createdAt") ASC
            `,
            // Top products
            prisma.$queryRaw<{ name: string; revenue: number; units: number }[]>`
                SELECT
                  p.name,
                  COALESCE(SUM(${Prisma.raw(SQL_CONVERT_ORDER_ITEM_TOTAL_TO_NGN)}), 0)::float as revenue,
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

        const totalPaidRevenue = Number(totalRevenueResult[0]?.total || 0)
        const totalOrderValue = Number(totalOrderValueResult[0]?.total || 0)
        const avgOrderValue = totalOrders > 0 ? totalOrderValue / totalOrders : 0

        return NextResponse.json({
            kpis: {
                revenue: totalPaidRevenue,
                totalOrderValue: totalOrderValue,
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
            ordersByStatus: (ordersByStatus as any[]).map((s) => ({
                status: s.status,
                count: s._count.id,
            })),
        })
    } catch (error) {
        console.error('[GET /api/admin/analytics]', error)
        return apiError(500, 'Failed to fetch analytics', 'INTERNAL_ERROR')
    }
}
