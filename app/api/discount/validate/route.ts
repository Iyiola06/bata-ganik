import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({ code: z.string().min(1).toUpperCase() })

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { code } = schema.parse(body)
        const orderTotal = Number(body.orderTotal ?? 0)

        const discount = await prisma.discountCode.findUnique({
            where: { code, isActive: true },
        })

        if (!discount) {
            return NextResponse.json({ error: 'Invalid or expired discount code' }, { status: 404 })
        }

        if (discount.expiresAt && discount.expiresAt < new Date()) {
            return NextResponse.json({ error: 'This discount code has expired' }, { status: 400 })
        }

        if (discount.maxUses && discount.usedCount >= discount.maxUses) {
            return NextResponse.json({ error: 'This discount code has reached its limit' }, { status: 400 })
        }

        if (discount.minimumOrder && orderTotal < discount.minimumOrder) {
            return NextResponse.json(
                { error: `Minimum order of ₦${discount.minimumOrder.toLocaleString()} required` },
                { status: 400 }
            )
        }

        const discountAmount =
            discount.type === 'percentage'
                ? (orderTotal * discount.value) / 100
                : discount.value

        return NextResponse.json({
            discount: {
                id: discount.id,
                code: discount.code,
                type: discount.type,
                value: discount.value,
                discountAmount: Math.min(discountAmount, orderTotal),
            },
        })
    } catch (error) {
        console.error('[POST /api/discount/validate]', error)
        return NextResponse.json({ error: 'Failed to validate discount' }, { status: 500 })
    }
}
