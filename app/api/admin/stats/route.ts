import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { requireAdmin } from '@/lib/admin-auth'
import { apiError } from '@/lib/http'

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
    const auth = await requireAdmin()
    if ('response' in auth) return auth.response

    try {
        const [
            totalRevResult,
            totalValueResult,
            totalOrders,
            revenueByMonth,
            pendingCount,
            activeProds,
            lowStock,
            recent,
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
            prisma.order.count({ where: { status: 'PENDING' } }),
            prisma.product.count({ where: { isPublished: true } }),
            prisma.productVariant.count({ where: { stockQty: { lte: 5 } } }),
            prisma.order.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: { items: { take: 1, include: { product: true } } }
            }),
        ])

        const totalRevenue = Number(totalRevResult[0]?.total || 0)
        const totalValue = Number(totalValueResult[0]?.total || 0)

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
        return apiError(500, error?.message || 'Failed to fetch stats', 'INTERNAL_ERROR')
    }
}
