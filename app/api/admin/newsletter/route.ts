import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { apiError } from '@/lib/http'

export async function GET() {
    const auth = await requireAdmin()
    if ('response' in auth) return auth.response

    try {
        const subscribers = await prisma.newsletterSubscriber.findMany({
            orderBy: { createdAt: 'desc' },
        })
        return NextResponse.json({ subscribers })
    } catch (error) {
        console.error('[GET /api/admin/newsletter]', error)
        return apiError(500, 'Failed to fetch subscribers', 'INTERNAL_ERROR')
    }
}
