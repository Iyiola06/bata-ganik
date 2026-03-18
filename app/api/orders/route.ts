import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { convertFromNGN } from '@/lib/currency'

const addressSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phone: z.string().min(1),
    addressLine1: z.string().min(1),
    addressLine2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    country: z.string().default('Nigeria'),
})

const createOrderSchema = z.object({
    // Customer info
    customerId: z.string().optional(),
    guestEmail: z.string().email().optional(),
    guestFirstName: z.string().optional(),
    guestLastName: z.string().optional(),
    guestPhone: z.string().optional(),
    // Shipping
    shippingAddress: addressSchema,
    // Cart
    cartId: z.string(),
    // Pricing
    currency: z.enum(['NGN', 'USD', 'GBP', 'EUR']).default('NGN'),
    shippingFee: z.number().default(5000),
    discountCodeId: z.string().optional(),
    discountAmount: z.number().default(0),
    // Payment
    paymentGateway: z.enum(['paystack', 'stripe']),
    notes: z.string().optional(),
})

function generateOrderNumber(): string {
    const year = new Date().getFullYear()
    const random = Math.floor(10000 + Math.random() * 90000)
    return `BG-${year}-${random}`
}

// POST /api/orders — create a new order from cart
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const data = createOrderSchema.parse(body)

        // Fetch cart with items
        const cart = await prisma.cart.findUnique({
            where: { id: data.cartId },
            include: {
                items: {
                    include: {
                        product: true,
                        variant: true,
                    },
                },
            },
        })

        if (!cart || cart.items.length === 0) {
            return NextResponse.json({ error: 'Cart is empty or not found' }, { status: 400 })
        }

        // 1. Base NGN total
        const subtotalNGN = cart.items.reduce((sum, item) => {
            const unitPrice = item.product.price + item.variant.priceModifier
            return sum + unitPrice * item.quantity
        }, 0)

        const shippingFeeNGN = data.shippingFee
        const discountAmountNGN = data.discountAmount

        // 2. Final currency conversion
        const currency = data.currency
        const subtotal = convertFromNGN(subtotalNGN, currency)
        const shippingFee = convertFromNGN(shippingFeeNGN, currency)
        const discountAmount = convertFromNGN(discountAmountNGN, currency)
        const total = Number((subtotal + shippingFee - discountAmount).toFixed(2))

        // Create order in a transaction
        const order = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    orderNumber: generateOrderNumber(),
                    customerId: data.customerId,
                    guestEmail: data.guestEmail,
                    guestFirstName: data.guestFirstName,
                    guestLastName: data.guestLastName,
                    guestPhone: data.guestPhone,
                    shippingAddress: data.shippingAddress,
                    subtotal,
                    shippingFee,
                    discountAmount,
                    discountCodeId: data.discountCodeId,
                    total,
                    currency,
                    paymentGateway: data.paymentGateway,
                    notes: data.notes,
                    items: {
                        create: cart.items.map((item) => {
                            const unitPriceNGN = item.product.price + item.variant.priceModifier
                            const unitPrice = convertFromNGN(unitPriceNGN, currency)
                            const lineTotal = Number((unitPrice * item.quantity).toFixed(2))
                            
                            return {
                                productId: item.productId,
                                variantId: item.variantId,
                                productName: item.product.name,
                                size: item.variant.sizeEU,
                                color: item.variant.color ?? undefined,
                                quantity: item.quantity,
                                unitPrice,
                                lineTotal,
                            }
                        }),
                    },
                },
                include: { items: true },
            })

            // Decrement stock for each variant
            for (const item of cart.items) {
                await tx.productVariant.update({
                    where: { id: item.variantId },
                    data: { stockQty: { decrement: item.quantity } },
                })
            }

            // Increment discount code usage
            if (data.discountCodeId) {
                await tx.discountCode.update({
                    where: { id: data.discountCodeId },
                    data: { usedCount: { increment: 1 } },
                })
            }

            // Clear the cart
            await tx.cartItem.deleteMany({ where: { cartId: cart.id } })

            return newOrder
        })

        return NextResponse.json({ order }, { status: 201 })
    } catch (error) {
        console.error('[POST /api/orders]', error)
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.flatten() }, { status: 400 })
        }
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }
}

// GET /api/orders?orderId=xxx or ?email=xxx
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const orderId = searchParams.get('orderId')
        const email = searchParams.get('email')

        if (orderId) {
            const order = await prisma.order.findUnique({
                where: { id: orderId },
                include: {
                    items: {
                        include: { product: { include: { images: { where: { isMain: true }, take: 1 } } } },
                    },
                },
            })
            if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
            return NextResponse.json({ order })
        }

        if (email) {
            const orders = await prisma.order.findMany({
                where: { guestEmail: email },
                orderBy: { createdAt: 'desc' },
                include: {
                    items: {
                        include: { product: { include: { images: { where: { isMain: true }, take: 1 } } } },
                    },
                },
            })
            return NextResponse.json({ orders })
        }

        return NextResponse.json({ error: 'orderId or email is required' }, { status: 400 })
    } catch (error) {
        console.error('[GET /api/orders]', error)
        return NextResponse.json({ error: 'Failed to fetch order(s)' }, { status: 500 })
    }
}
