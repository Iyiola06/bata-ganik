import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// GET /api/admin/discount-codes
export async function GET() {
    const codes = await prisma.discountCode.findMany({
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { orders: true } } },
    })
    return NextResponse.json({ codes })
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
            return NextResponse.json({ error: error.flatten() }, { status: 400 })
        }
        console.error('[POST /api/admin/discount-codes]', error)
        return NextResponse.json({ error: 'Failed to create discount code' }, { status: 500 })
    }
}

// DELETE /api/admin/discount-codes?id=xxx
export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    await prisma.discountCode.delete({ where: { id } })
    return NextResponse.json({ message: 'Deleted' })
}

// PATCH /api/admin/discount-codes?id=xxx — toggle active or other fields
export async function PATCH(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

        const body = await request.json()
        const code = await prisma.discountCode.update({
            where: { id },
            data: body,
        })
        return NextResponse.json({ code })
    } catch (error) {
        console.error('[PATCH /api/admin/discount-codes]', error)
        return NextResponse.json({ error: 'Failed to update discount code' }, { status: 500 })
    }
}
