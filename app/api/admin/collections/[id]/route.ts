import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { requireAdmin } from '@/lib/admin-auth'
import { apiError } from '@/lib/http'

const updateSchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional().nullable(),
    imageUrl: z.string().url().optional().nullable().or(z.literal('')),
    isActive: z.boolean().optional(),
})

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    const auth = await requireAdmin()
    if ('response' in auth) return auth.response

    try {
        const body = await request.json()
        const data = updateSchema.parse(body)

        const collection = await prisma.collection.update({
            where: { id: params.id },
            data: {
                name: data.name,
                description: data.description === '' ? null : data.description,
                imageUrl: data.imageUrl === '' ? null : data.imageUrl,
                isActive: data.isActive,
            }
        })
        return NextResponse.json({ collection })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return apiError(400, 'Invalid payload', 'BAD_REQUEST', error.flatten())
        }
        console.error('[PATCH /api/admin/collections/[id]]', error)
        return apiError(500, 'Failed to update collection', 'INTERNAL_ERROR')
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const auth = await requireAdmin()
    if ('response' in auth) return auth.response

    try {
        await prisma.collection.delete({
            where: { id: params.id }
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('[DELETE /api/admin/collections/[id]]', error)
        return apiError(500, 'Failed to delete collection', 'INTERNAL_ERROR')
    }
}
