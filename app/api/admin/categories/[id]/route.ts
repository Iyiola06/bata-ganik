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
    slug: z.string().min(1).optional(),
    description: z.string().nullable().optional(),
    imageUrl: z.string().nullable().optional(),
    isActive: z.boolean().optional(),
    parentId: z.string().nullable().optional()
}).strict()

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

        const category = await prisma.category.update({
            where: { id },
            data,
        })

        return NextResponse.json({ category })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return apiError(400, 'Invalid update payload', 'BAD_REQUEST', error.flatten())
        }
        return apiError(500, 'Failed to update category', 'INTERNAL_ERROR')
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireAdmin()
    if ('response' in auth) return auth.response

    try {
        const parsedParams = paramsSchema.parse(await params)
        const { id } = parsedParams
        await prisma.category.delete({ where: { id } })
        return NextResponse.json({ message: 'Category deleted' })
    } catch (error) {
        return apiError(500, 'Failed to delete category', 'INTERNAL_ERROR')
    }
}
