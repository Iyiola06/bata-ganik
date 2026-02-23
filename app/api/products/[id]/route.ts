import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const product = await prisma.product.findFirst({
            where: {
                OR: [{ id }, { slug: id }],
                isPublished: true,
            },
            include: {
                images: { orderBy: { order: 'asc' } },
                collection: true,
                variants: { orderBy: { sizeEU: 'asc' } },
            },
        })

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }

        // Related products from the same collection
        const related = product.collectionId
            ? await prisma.product.findMany({
                where: {
                    collectionId: product.collectionId,
                    isPublished: true,
                    id: { not: product.id },
                },
                take: 4,
                include: { images: { where: { isMain: true }, take: 1 } },
            })
            : []

        return NextResponse.json({ product, related })
    } catch (error) {
        console.error('[GET /api/products/[id]]', error)
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
    }
}
