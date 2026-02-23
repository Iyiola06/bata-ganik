import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// PATCH /api/admin/products/[id] — update a product
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()

        const product = await prisma.product.update({
            where: { id },
            data: body,
            include: { images: true, variants: true },
        })

        return NextResponse.json({ product })
    } catch (error) {
        console.error('[PATCH /api/admin/products/[id]]', error)
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
    }
}

// DELETE /api/admin/products/[id] — delete a product
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await prisma.product.delete({ where: { id } })
        return NextResponse.json({ message: 'Product deleted' })
    } catch (error) {
        console.error('[DELETE /api/admin/products/[id]]', error)
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
    }
}
