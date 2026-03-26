import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { requireAdmin } from '@/lib/admin-auth'
import { apiError } from '@/lib/http'

const paramsSchema = z.object({
    id: z.string().min(1),
})

const patchSchema = z.object({
    name: z.string().min(1).optional(),
    sku: z.string().min(1).optional(),
    description: z.string().nullable().optional(),
    heritageStory: z.string().nullable().optional(),
    price: z.number().positive().optional(),
    compareAtPrice: z.number().positive().nullable().optional(),
    collectionId: z.string().nullable().optional(),
    categoryId: z.string().nullable().optional(),
    tags: z.array(z.string()).optional(),
    isPublished: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    trackInventory: z.boolean().optional(),
    continueOnOOS: z.boolean().optional(),
}).strict()

// GET /api/admin/products/[id] — get a product
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireAdmin()
    if ('response' in auth) return auth.response

    try {
        const parsedParams = paramsSchema.parse(await params)
        const { id } = parsedParams
        const product = await prisma.product.findUnique({
            where: { id },
            include: { images: true, variants: true },
        })
        if (!product) return apiError(404, 'Product not found', 'NOT_FOUND')
        return NextResponse.json({ product })
    } catch (error) {
        return apiError(500, 'Failed to fetch product', 'INTERNAL_ERROR')
    }
}

// PATCH /api/admin/products/[id] — update a product
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireAdmin()
    if ('response' in auth) return auth.response

    try {
        const parsedParams = paramsSchema.parse(await params)
        const { id } = parsedParams
        const body = await request.json()
        const data = patchSchema.parse(body)

        const product = await prisma.product.update({
            where: { id },
            data,
            include: { images: true, variants: true },
        })

        return NextResponse.json({ product })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return apiError(400, 'Invalid product update payload', 'BAD_REQUEST', error.flatten())
        }
        console.error('[PATCH /api/admin/products/[id]]', error)
        return apiError(500, 'Failed to update product', 'INTERNAL_ERROR')
    }
}

// DELETE /api/admin/products/[id] — delete a product
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireAdmin()
    if ('response' in auth) return auth.response

    try {
        const parsedParams = paramsSchema.parse(await params)
        const { id } = parsedParams
        await prisma.product.delete({ where: { id } })
        return NextResponse.json({ message: 'Product deleted' })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return apiError(400, 'Invalid product id', 'BAD_REQUEST', error.flatten())
        }
        console.error('[DELETE /api/admin/products/[id]]', error)
        return apiError(500, 'Failed to delete product', 'INTERNAL_ERROR')
    }
}
