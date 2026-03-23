import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { requireAdmin } from '@/lib/admin-auth'
import { apiError } from '@/lib/http'

// GET /api/admin/discount-codes
export async function GET() {
    const auth = await requireAdmin()
    if ('response' in auth) return auth.response

    try {
        const codes = await prisma.discountCode.findMany({
            orderBy: { createdAt: 'desc' },
            include: { _count: { select: { orders: true } } },
        })
        return NextResponse.json({ codes })
    } catch (error) {
        console.error('[GET /api/admin/discount-codes]', error)
        return apiError(500, 'Failed to fetch discount codes', 'INTERNAL_ERROR')
    }
}

const createSchema = z.object({
    code: z.string().min(3).toUpperCase(),
    type: z.enum(['percentage', 'fixed']),
    value: z.number().positive(),
    minimumOrder: z.number().positive().optional(),
    maxUses: z.number().int().positive().optional(),
    expiresAt: z.string().datetime().optional(),
    isActive: z.boolean().default(true),
})

// POST /api/admin/discount-codes
export async function POST(request: NextRequest) {
    const auth = await requireAdmin()
    if ('response' in auth) return auth.response

    try {
        const body = await request.json()
        const data = createSchema.parse(body)

        const code = await prisma.discountCode.create({
            data: {
                ...data,
                expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
            },
        })
        return NextResponse.json({ code }, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return apiError(400, 'Invalid discount payload', 'BAD_REQUEST', error.flatten())
        }
        console.error('[POST /api/admin/discount-codes]', error)
        return apiError(500, 'Failed to create discount code', 'INTERNAL_ERROR')
    }
}

const idQuerySchema = z.object({
    id: z.string().min(1),
})

// DELETE /api/admin/discount-codes?id=xxx
export async function DELETE(request: NextRequest) {
    const auth = await requireAdmin()
    if ('response' in auth) return auth.response

    try {
        const { searchParams } = new URL(request.url)
        const parsed = idQuerySchema.parse(Object.fromEntries(searchParams))
        await prisma.discountCode.delete({ where: { id: parsed.id } })
        return NextResponse.json({ message: 'Deleted' })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return apiError(400, 'Invalid discount code id', 'BAD_REQUEST', error.flatten())
        }
        console.error('[DELETE /api/admin/discount-codes]', error)
        return apiError(500, 'Failed to delete discount code', 'INTERNAL_ERROR')
    }
}

const updateSchema = z.object({
    code: z.string().min(3).toUpperCase().optional(),
    type: z.enum(['percentage', 'fixed']).optional(),
    value: z.number().positive().optional(),
    minimumOrder: z.number().positive().nullable().optional(),
    maxUses: z.number().int().positive().nullable().optional(),
    expiresAt: z.union([z.string().datetime(), z.null()]).optional(),
    isActive: z.boolean().optional(),
}).strict()

// PATCH /api/admin/discount-codes?id=xxx — toggle active or other fields
export async function PATCH(request: NextRequest) {
    const auth = await requireAdmin()
    if ('response' in auth) return auth.response

    try {
        const { searchParams } = new URL(request.url)
        const parsed = idQuerySchema.parse(Object.fromEntries(searchParams))

        const body = await request.json()
        const data = updateSchema.parse(body)
        const code = await prisma.discountCode.update({
            where: { id: parsed.id },
            data: {
                ...data,
                expiresAt: data.expiresAt === undefined
                    ? undefined
                    : data.expiresAt === null
                        ? null
                        : new Date(data.expiresAt),
            },
        })
        return NextResponse.json({ code })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return apiError(400, 'Invalid discount update payload', 'BAD_REQUEST', error.flatten())
        }
        console.error('[PATCH /api/admin/discount-codes]', error)
        return apiError(500, 'Failed to update discount code', 'INTERNAL_ERROR')
    }
}
