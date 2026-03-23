import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { createHash } from 'crypto'
import { prisma } from '@/lib/prisma'
import { apiError } from '@/lib/http'

// Admin client using the service role key — can create users + set app_metadata
function getAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    )
}

const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    token: z.string().min(1),
})

function hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex')
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, password, firstName, lastName, token } = signupSchema.parse(body)

        const normalizedEmail = email.trim().toLowerCase()
        const invite = await prisma.adminInvite.findUnique({
            where: { tokenHash: hashToken(token) },
        })
        if (!invite) {
            return apiError(403, 'Invalid invitation token', 'INVITE_INVALID')
        }
        if (invite.usedAt) {
            return apiError(409, 'Invitation link has already been used', 'INVITE_USED')
        }
        if (invite.revokedAt) {
            return apiError(403, 'Invitation link has been revoked', 'INVITE_REVOKED')
        }
        if (invite.expiresAt.getTime() <= Date.now()) {
            return apiError(410, 'Invitation link has expired', 'INVITE_EXPIRED')
        }
        if (invite.email.trim().toLowerCase() !== normalizedEmail) {
            return apiError(403, 'Invitation email does not match', 'INVITE_EMAIL_MISMATCH')
        }
        if (invite.role !== 'admin' && invite.role !== 'super_admin') {
            return apiError(500, 'Invalid invite role configuration', 'INVITE_ROLE_INVALID')
        }

        const reserved = await prisma.adminInvite.updateMany({
            where: {
                id: invite.id,
                usedAt: null,
                revokedAt: null,
                expiresAt: { gt: new Date() },
            },
            data: { usedAt: new Date() },
        })
        if (reserved.count === 0) {
            return apiError(409, 'Invitation link is no longer valid', 'INVITE_ALREADY_CONSUMED')
        }

        const supabase = getAdminClient()

        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email: normalizedEmail,
            password,
            email_confirm: true,
            user_metadata: { first_name: firstName, last_name: lastName },
            app_metadata: { role: invite.role },
        })

        if (createError) {
            await prisma.adminInvite.update({
                where: { id: invite.id },
                data: { usedAt: null },
            })
            console.error('[Admin Invite Signup]', createError)
            return apiError(400, createError.message, 'INVITE_SIGNUP_FAILED')
        }

        return NextResponse.json({
            user: {
                id: newUser.user.id,
                email: newUser.user.email,
                role: newUser.user.app_metadata?.role ?? null,
            },
            message: 'Admin account created. You can now log in.',
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return apiError(400, 'Invalid signup payload', 'BAD_REQUEST', error.flatten().fieldErrors)
        }
        console.error('[POST /api/admin/invite/signup]', error)
        return apiError(500, 'Signup failed', 'INTERNAL_ERROR')
    }
}
