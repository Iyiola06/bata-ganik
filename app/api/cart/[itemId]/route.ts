import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { z } from 'zod'

const patchSchema = z.object({ quantity: z.number().min(0).max(10) })

// PATCH /api/cart/[itemId] — update quantity (0 = remove)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ itemId: string }> }
) {
    try {
        const { itemId } = await params
        const body = await request.json()
        const { quantity } = patchSchema.parse(body)

        if (quantity === 0) {
            await prisma.cartItem.delete({ where: { id: itemId } })
            return NextResponse.json({ message: 'Item removed' })
        }

        const updated = await prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity },
        })
        return NextResponse.json({ item: updated })
    } catch (error) {
        console.error('[PATCH /api/cart/[itemId]]', error)
        return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
    }
}

// DELETE /api/cart/[itemId] — remove item
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ itemId: string }> }
) {
    try {
        const { itemId } = await params
        await prisma.cartItem.delete({ where: { id: itemId } })
        return NextResponse.json({ message: 'Item removed' })
    } catch (error) {
        console.error('[DELETE /api/cart/[itemId]]', error)
        return NextResponse.json({ error: 'Failed to remove item' }, { status: 500 })
    }
}
