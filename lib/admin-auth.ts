import { User } from '@supabase/supabase-js'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { apiError } from '@/lib/http'
import { headers } from 'next/headers'

export type AdminRole = 'admin' | 'super_admin'

type AuthFailure = {
    response: ReturnType<typeof apiError>
}

export type AdminAuthResult =
    | {
        user: User
        role: AdminRole
    }
    | AuthFailure

function getRole(user: User): AdminRole | null {
    const role = user.app_metadata?.role
    if (role === 'admin' || role === 'super_admin') {
        return role
    }
    return null
}

export async function requireAdmin(): Promise<AdminAuthResult> {
    const supabase = await createSupabaseServerClient()

    const headersList = await headers()
    const authHeader = headersList.get('authorization')
    let user = null

    if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7)
        const { data, error } = await supabase.auth.getUser(token)
        if (!error && data.user) user = data.user
    }

    if (!user) {
        const { data, error } = await supabase.auth.getUser()
        if (!error && data.user) user = data.user
    }

    if (!user) {
        return {
            response: apiError(401, 'Authentication required', 'UNAUTHENTICATED'),
        }
    }

    const role = getRole(user)
    if (!role) {
        return {
            response: apiError(403, 'Admin access required', 'FORBIDDEN'),
        }
    }

    return { user, role }
}

export async function requireSuperAdmin(): Promise<AdminAuthResult> {
    const auth = await requireAdmin()
    if ('response' in auth) return auth

    if (auth.role !== 'super_admin') {
        return {
            response: apiError(403, 'Super admin access required', 'FORBIDDEN'),
        }
    }

    return auth
}
