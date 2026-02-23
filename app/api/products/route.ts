import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const querySchema = z.object({
    featured: z.string().optional(),
    collection: z.string().optional(),
    sort: z.enum(['price_asc', 'price_desc', 'newest', 'name']).optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(12),
})

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const query = querySchema.parse(Object.fromEntries(searchParams))

        const where: any = { isPublished: true }
        if (query.featured === 'true') where.isFeatured = true
        if (query.collection) {
            where.collection = { slug: query.collection }
        }

        const orderBy: any =
            query.sort === 'price_asc'
                ? { price: 'asc' }
                : query.sort === 'price_desc'
                    ? { price: 'desc' }
                    : query.sort === 'name'
                        ? { name: 'asc' }
                        : { createdAt: 'desc' }

        const skip = (query.page - 1) * query.limit

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                orderBy,
                skip,
                take: query.limit,
                include: {
                    images: { orderBy: { order: 'asc' } },
                    collection: { select: { name: true, slug: true } },
                    variants: {
                        select: {
                            id: true,
                            sizeEU: true,
                            color: true,
                            colorHex: true,
                            stockQty: true,
                            priceModifier: true,
                        },
                    },
                },
            }),
            prisma.product.count({ where }),
        ])

        return NextResponse.json({
            products,
            pagination: {
                total,
                page: query.page,
                limit: query.limit,
                pages: Math.ceil(total / query.limit),
            },
        })
    } catch (error) {
        console.error('[GET /api/products]', error)
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }
}
