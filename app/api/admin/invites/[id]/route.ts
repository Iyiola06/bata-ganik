import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireSuperAdmin } from '@/lib/admin-auth'
import { apiError } from '@/lib/http'

const paramsSchema = z.object({
    id: z.string().min(1),
})

const patchSchema = z.object({
    action: z.enum(['revoke']),
})

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireSuperAdmin()
    if ('response' in auth) return auth.response

    try {
        const parsedParams = paramsSchema.parse(await params)
        const { action } = patchSchema.parse(await request.json())

        if (action !== 'revoke') {
            return apiError(400, 'Unsupported action', 'BAD_REQUEST')
        }

        const invite = await prisma.adminInvite.update({
            where: { id: parsedParams.id },
            data: { revokedAt: new Date() },
            select: {
                id: true,
                email: true,
                role: true,
                expiresAt: true,
                usedAt: true,
                revokedAt: true,
                createdBy: true,
                createdAt: true,
                updatedAt: true,
            },
        })

        return NextResponse.json({ invite })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return apiError(400, 'Invalid invite update payload', 'BAD_REQUEST', error.flatten())
        }
        console.error('[PATCH /api/admin/invites/[id]]', error)
        return apiError(500, 'Failed to update admin invite', 'INTERNAL_ERROR')
    }
}
