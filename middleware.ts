import { NextMiddleware, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export const middleware: NextMiddleware = async (request) => {
    const { pathname } = request.nextUrl

    // Only protect /admin routes (except /admin/login)
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
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
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }

        // Check admin role from user metadata
        const role = user.app_metadata?.role
        if (role !== 'admin' && role !== 'super_admin') {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }

        return response
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}
