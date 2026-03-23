import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { randomBytes, createHash } from 'crypto'
import { prisma } from '@/lib/prisma'
import { requireSuperAdmin } from '@/lib/admin-auth'
import { apiError } from '@/lib/http'

const createInviteSchema = z.object({
    email: z.string().email(),
    role: z.enum(['admin', 'super_admin']).default('admin'),
    expiresInHours: z.coerce.number().int().min(1).max(24 * 30).default(72),
})

export async function GET() {
    const auth = await requireSuperAdmin()
    if ('response' in auth) return auth.response

    try {
        const invites = await prisma.adminInvite.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100,
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
        return NextResponse.json({ invites })
    } catch (error) {
        console.error('[GET /api/admin/invites]', error)
        return apiError(500, 'Failed to fetch admin invites', 'INTERNAL_ERROR')
    }
}

export async function POST(request: NextRequest) {
    const auth = await requireSuperAdmin()
    if ('response' in auth) return auth.response

    try {
        const payload = createInviteSchema.parse(await request.json())
        const token = randomBytes(24).toString('hex')
        const tokenHash = createHash('sha256').update(token).digest('hex')
        const expiresAt = new Date(Date.now() + payload.expiresInHours * 60 * 60 * 1000)
        const email = payload.email.trim().toLowerCase()

        const activeInvite = await prisma.adminInvite.findFirst({
            where: {
                email,
                usedAt: null,
                revokedAt: null,
                expiresAt: { gt: new Date() },
            },
            select: { id: true },
        })
        if (activeInvite) {
            return apiError(409, 'An active invite already exists for this email', 'INVITE_ALREADY_ACTIVE')
        }

        const invite = await prisma.adminInvite.create({
            data: {
                email,
                role: payload.role,
                tokenHash,
                expiresAt,
                createdBy: auth.user.id,
            },
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

        const origin = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || request.nextUrl.origin
        const inviteUrl = `${origin}/admin/invite/${token}`

        return NextResponse.json({ invite, inviteUrl }, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return apiError(400, 'Invalid invite payload', 'BAD_REQUEST', error.flatten())
        }
        console.error('[POST /api/admin/invites]', error)
        return apiError(500, 'Failed to create admin invite', 'INTERNAL_ERROR')
    }
}
