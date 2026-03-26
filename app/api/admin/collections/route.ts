import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { requireAdmin } from '@/lib/admin-auth'
import { apiError } from '@/lib/http'

const createSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    imageUrl: z.string().url().optional().or(z.literal('')),
    isActive: z.boolean().default(true),
})

export async function GET(request: NextRequest) {
    const auth = await requireAdmin()
    if ('response' in auth) return auth.response

    try {
        const collections = await prisma.collection.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: { select: { products: true } }
            }
        })
        return NextResponse.json({ collections })
    } catch (error) {
        console.error('[GET /api/admin/collections]', error)
        return apiError(500, 'Failed to fetch collections', 'INTERNAL_ERROR')
    }
}

export async function POST(request: NextRequest) {
    const auth = await requireAdmin()
    if ('response' in auth) return auth.response

    try {
        const body = await request.json()
        const data = createSchema.parse(body)
        
        const slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .concat(`-${Date.now()}`)

        const collection = await prisma.collection.create({
            data: {
                name: data.name,
                slug,
                description: data.description || null,
                imageUrl: data.imageUrl || null,
                isActive: data.isActive,
            }
        })

        return NextResponse.json({ collection }, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return apiError(400, 'Invalid payload', 'BAD_REQUEST', error.flatten())
        }
        console.error('[POST /api/admin/collections]', error)
        return apiError(500, 'Failed to create collection', 'INTERNAL_ERROR')
    }
}
