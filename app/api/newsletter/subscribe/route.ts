import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const subscribeSchema = z.object({
    email: z.string().email('Invalid email address'),
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email } = subscribeSchema.parse(body)

        // Check if already subscribed
        const existing = await prisma.newsletterSubscriber.findUnique({
            where: { email: email.toLowerCase() },
        })

        if (existing) {
            if (existing.isActive) {
                return NextResponse.json({ message: 'You are already subscribed!' }, { status: 200 })
            } else {
                // Re-activate if they unsubscribed before
                await prisma.newsletterSubscriber.update({
                    where: { email: email.toLowerCase() },
                    data: { isActive: true },
                })
                return NextResponse.json({ message: 'Welcome back! Your subscription is active again.' }, { status: 200 })
            }
        }

        // Create new subscriber
        await prisma.newsletterSubscriber.create({
            data: { email: email.toLowerCase() },
        })

        return NextResponse.json({ message: 'Thank you for subscribing!' }, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.flatten().fieldErrors.email?.[0] || 'Invalid input' }, { status: 400 })
        }
        console.error('[Newsletter Subscription Error]', error)
        return NextResponse.json({ error: 'Subscription failed. Please try again later.' }, { status: 500 })
    }
}
