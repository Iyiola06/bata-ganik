import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

// POST /api/cart/clear — Clear all items from the current session's cart
export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const sessionId = cookieStore.get('cart_session')?.value

        if (!sessionId) {
            return NextResponse.json({ cleared: true })
        }

        const cart = await prisma.cart.findUnique({
            where: { sessionId },
        })

        if (cart) {
            await prisma.cartItem.deleteMany({
                where: { cartId: cart.id },
            })
        }

        return NextResponse.json({ cleared: true })
    } catch (error) {
        console.error('[POST /api/cart/clear]', error)
        return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 })
    }
}
