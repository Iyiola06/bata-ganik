import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { requireAdmin } from '@/lib/admin-auth'
import { apiError } from '@/lib/http'

const paramsSchema = z.object({
    id: z.string().min(1),
})

const patchSchema = z.object({
    isActive: z.boolean(),
})

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireAdmin()
    if ('response' in auth) return auth.response

    try {
        const parsedParams = paramsSchema.parse(await params)
        const { isActive } = patchSchema.parse(await request.json())
        const subscriber = await prisma.newsletterSubscriber.update({
            where: { id: parsedParams.id },
            data: { isActive },
        })
        return NextResponse.json({ subscriber })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return apiError(400, 'Invalid newsletter update payload', 'BAD_REQUEST', error.flatten())
        }
        console.error('[PATCH /api/admin/newsletter/[id]]', error)
        return apiError(500, 'Failed to update subscriber', 'INTERNAL_ERROR')
    }
}
