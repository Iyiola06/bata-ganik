import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const collections = await prisma.collection.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
            include: {
                _count: { select: { products: { where: { isPublished: true } } } },
            },
        })

        return NextResponse.json({ collections })
    } catch (error) {
        console.error('[GET /api/collections]', error)
        return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 })
    }
}
