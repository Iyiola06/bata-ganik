import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

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

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, password, firstName, lastName, token } = signupSchema.parse(body)

        // Verify invite token
        const validToken = process.env.NEXT_PUBLIC_ADMIN_INVITE_TOKEN
        if (!validToken || token !== validToken) {
            return NextResponse.json({ error: 'Invalid invitation token' }, { status: 403 })
        }

        const supabase = getAdminClient()

        // Check if any admin already exists
        const { data: allUsers } = await supabase.auth.admin.listUsers({ perPage: 1000 })
        const existingAdmins = (allUsers?.users ?? []).filter(
            (u) => u.app_metadata?.role === 'admin' || u.app_metadata?.role === 'super_admin'
        )

        // First admin gets auto-promoted, subsequent need manual approval
        const isFirstAdmin = existingAdmins.length === 0
        const role = isFirstAdmin ? 'super_admin' : undefined

        // Create user with email_confirm: true (no confirmation email needed)
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { first_name: firstName, last_name: lastName },
            ...(role ? { app_metadata: { role } } : {}),
        })

        if (createError) {
            console.error('[Admin Invite Signup]', createError)
            return NextResponse.json({ error: createError.message }, { status: 400 })
        }

        return NextResponse.json({
            user: {
                id: newUser.user.id,
                email: newUser.user.email,
                role: newUser.user.app_metadata?.role ?? null,
            },
            isFirstAdmin,
            message: isFirstAdmin
                ? 'Account created with super_admin privileges. You can now log in.'
                : 'Account created. An existing admin must grant you access.',
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.flatten().fieldErrors }, { status: 400 })
        }
        console.error('[POST /api/admin/invite/signup]', error)
        return NextResponse.json({ error: 'Signup failed' }, { status: 500 })
    }
}
