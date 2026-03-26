import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { requireAdmin } from '@/lib/admin-auth'
import { apiError } from '@/lib/http'

const postSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
    isActive: z.boolean().optional(),
    parentId: z.string().nullable().optional()
})

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export async function GET() {
    const auth = await requireAdmin()
    if ('response' in auth) return auth.response

    try {
        const categories = await prisma.category.findMany({
            orderBy: { createdAt: 'desc' },
            include: { _count: { select: { products: true, children: true } } }
        })
        return NextResponse.json({ categories })
    } catch (error) {
        console.error('[GET /api/admin/categories]', error)
        return apiError(500, 'Failed to fetch categories', 'INTERNAL_ERROR')
    }
}

export async function POST(request: NextRequest) {
    const auth = await requireAdmin()
    if ('response' in auth) return auth.response

    try {
        const body = await request.json()
        const data = postSchema.parse(body)
        
        let slug = slugify(data.name)
        let count = 1
        while (await prisma.category.findUnique({ where: { slug } })) {
            slug = `${slugify(data.name)}-${count++}`
        }

        const category = await prisma.category.create({
            data: { ...data, slug }
        })

        return NextResponse.json({ category })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return apiError(400, 'Invalid category payload', 'BAD_REQUEST', error.flatten())
        }
        console.error('[POST /api/admin/categories]', error)
        return apiError(500, 'Failed to create category', 'INTERNAL_ERROR')
    }
}
