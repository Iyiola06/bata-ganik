import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { z } from 'zod'

function generateSessionId() {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

async function getOrCreateCart(sessionId?: string, customerId?: string) {
    let cart = null

    if (customerId) {
        cart = await prisma.cart.findFirst({
            where: { customerId },
            include: {
                items: {
                    include: {
                        product: {
                            include: { images: { where: { isMain: true }, take: 1 } },
                        },
                        variant: true,
                    },
                },
            },
        })
    } else if (sessionId) {
        cart = await prisma.cart.findUnique({
            where: { sessionId },
            include: {
                items: {
                    include: {
                        product: {
                            include: { images: { where: { isMain: true }, take: 1 } },
                        },
                        variant: true,
                    },
                },
            },
        })
    }

    if (!cart) {
        const newSessionId = sessionId || generateSessionId()
        cart = await prisma.cart.create({
            data: customerId
                ? { customerId }
                : { sessionId: newSessionId },
            include: {
                items: {
                    include: {
                        product: {
                            include: { images: { where: { isMain: true }, take: 1 } },
                        },
                        variant: true,
                    },
                },
            },
        })
    }

    return cart
}

// GET /api/cart — fetch the cart
export async function GET(request: NextRequest) {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('cart_session')?.value

    const cart = await getOrCreateCart(sessionId)

    const response = NextResponse.json({ cart })
    if (!sessionId) {
        response.cookies.set('cart_session', cart.sessionId!, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 days
        })
    }
    return response
}

const addItemSchema = z.object({
    productId: z.string(),
    variantId: z.string(),
    quantity: z.number().min(1).max(10).default(1),
})

// POST /api/cart — add item
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { productId, variantId, quantity } = addItemSchema.parse(body)

        const cookieStore = await cookies()
        const sessionId = cookieStore.get('cart_session')?.value

        const cart = await getOrCreateCart(sessionId)

        // Check stock
        const variant = await prisma.productVariant.findUnique({
            where: { id: variantId },
        })
        if (!variant) {
            return NextResponse.json({ error: 'Variant not found' }, { status: 404 })
        }
        if (variant.stockQty < quantity) {
            return NextResponse.json({ error: 'Not enough stock' }, { status: 400 })
        }

        // Upsert cart item
        const existingItem = await prisma.cartItem.findUnique({
            where: { cartId_variantId: { cartId: cart.id, variantId } },
        })

        if (existingItem) {
            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity },
            })
        } else {
            await prisma.cartItem.create({
                data: { cartId: cart.id, productId, variantId, quantity },
            })
        }

        const updatedCart = await prisma.cart.findUnique({
            where: { id: cart.id },
            include: {
                items: {
                    include: {
                        product: { include: { images: { where: { isMain: true }, take: 1 } } },
                        variant: true,
                    },
                },
            },
        })

        const response = NextResponse.json({ cart: updatedCart })
        if (!sessionId && cart.sessionId) {
            response.cookies.set('cart_session', cart.sessionId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 30,
            })
        }
        return response
    } catch (error) {
        console.error('[POST /api/cart]', error)
        return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 })
    }
}
