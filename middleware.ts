import { NextMiddleware, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export const middleware: NextMiddleware = async (request) => {
    const { pathname } = request.nextUrl

    const isAdminPage =
        pathname.startsWith('/admin') &&
        pathname !== '/admin/login' &&
        !pathname.startsWith('/admin/invite')
    const isAdminApi = pathname.startsWith('/api/admin')
    const isPublicInviteSignup = pathname === '/api/admin/invite/signup'

    if (!isAdminPage && (!isAdminApi || isPublicInviteSignup)) {
        return NextResponse.next()
    }

    let response = NextResponse.next({ request })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet: any[]) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    response = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        if (isAdminApi) {
            return NextResponse.json(
                { error: 'Authentication required', code: 'UNAUTHENTICATED' },
                { status: 401 }
            )
        }
        return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    const role = user.app_metadata?.role
    if (role !== 'admin' && role !== 'super_admin') {
        if (isAdminApi) {
            return NextResponse.json(
                { error: 'Admin access required', code: 'FORBIDDEN' },
                { status: 403 }
            )
        }
        return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    return response
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
}
