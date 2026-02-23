import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// GET /api/admin/products — paginated product list with all data
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page') ?? 1)
    const limit = Number(searchParams.get('limit') ?? 20)
    const search = searchParams.get('search') ?? ''
    const collection = searchParams.get('collection')
    const stockStatus = searchParams.get('stock') // "low" | "out" | "all"

    const where: any = {}
    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { sku: { contains: search, mode: 'insensitive' } },
        ]
    }
    if (collection) where.collection = { slug: collection }
    if (stockStatus === 'low') {
        where.variants = { some: { stockQty: { gt: 0, lte: 10 } } }
    } else if (stockStatus === 'out') {
        where.variants = { some: { stockQty: 0 } }
    }

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                images: { where: { isMain: true }, take: 1 },
                collection: true,
                _count: { select: { variants: true } },
                variants: { select: { stockQty: true } },
            },
        }),
        prisma.product.count({ where }),
    ])

    return NextResponse.json({
        products: products.map((p) => ({
            ...p,
            totalStock: p.variants.reduce((s, v) => s + v.stockQty, 0),
        })),
        pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    })
}

const createProductSchema = z.object({
    name: z.string().min(1),
    sku: z.string().min(1),
    description: z.string().optional(),
    heritageStory: z.string().optional(),
    price: z.number().positive(),
    compareAtPrice: z.number().positive().optional(),
    collectionId: z.string().optional(),
    tags: z.array(z.string()).default([]),
    isPublished: z.boolean().default(false),
    isFeatured: z.boolean().default(false),
    trackInventory: z.boolean().default(true),
    continueOnOOS: z.boolean().default(false),
    images: z.array(z.object({
        url: z.string().url(),
        altText: z.string().optional(),
        isMain: z.boolean().default(false),
        order: z.number().default(0),
    })).default([]),
    variants: z.array(z.object({
        sizeEU: z.string(),
        color: z.string().optional(),
        colorHex: z.string().optional(),
        stockQty: z.number().default(0),
        priceModifier: z.number().default(0),
    })).default([]),
})

// POST /api/admin/products — create a new product
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const data = createProductSchema.parse(body)

        const slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .concat(`-${Date.now()}`)

        const product = await prisma.product.create({
            data: {
                ...data,
                slug,
                images: { create: data.images },
                variants: { create: data.variants },
            },
            include: { images: true, variants: true },
        })

        return NextResponse.json({ product }, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.flatten() }, { status: 400 })
        }
        console.error('[POST /api/admin/products]', error)
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
    }
}
