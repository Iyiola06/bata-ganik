import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { requireAdmin } from '@/lib/admin-auth'
import { apiError } from '@/lib/http'

const putSchema = z.object({
    type: z.enum(['collection', 'category']),
    groupId: z.string(),
    items: z.array(z.object({
        id: z.string(),
        sortOrder: z.number().int(),
    })).min(1),
})

export async function PUT(request: NextRequest) {
    const auth = await requireAdmin()
    if ('response' in auth) return auth.response

    try {
        const body = await request.json()
        const data = putSchema.parse(body)

        await prisma.$transaction(
            data.items.map(item => {
                if (data.type === 'collection') {
                    return prisma.product.update({
                        where: { id: item.id },
                        data: { collectionSortOrder: item.sortOrder }
                    })
                } else {
                    return prisma.product.update({
                        where: { id: item.id },
                        data: { categorySortOrder: item.sortOrder }
                    })
                }
            })
        )

        return NextResponse.json({ message: 'Sort order updated successfully' })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return apiError(400, 'Invalid sort payload', 'BAD_REQUEST', error.flatten())
        }
        console.error('[PUT /api/admin/merchandising]', error)
        return apiError(500, 'Failed to update sort order', 'INTERNAL_ERROR')
    }
}
