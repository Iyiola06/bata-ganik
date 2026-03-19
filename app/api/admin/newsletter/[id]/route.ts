import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { isActive } = await request.json()
        const subscriber = await prisma.newsletterSubscriber.update({
            where: { id: params.id },
            data: { isActive },
        })
        return NextResponse.json({ subscriber })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update subscriber' }, { status: 500 })
    }
}
