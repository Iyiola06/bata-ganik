import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { Resend } from 'resend'

function getResend() { return new Resend(process.env.RESEND_API_KEY) }

const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Valid email is required'),
    subject: z.string().optional(),
    message: z.string().min(10, 'Message must be at least 10 characters'),
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const data = schema.parse(body)

        // Save to DB
        const message = await prisma.contactMessage.create({ data })

        // Email notification to admin
        await getResend().emails.send({

            from: process.env.EMAIL_FROM ?? 'Bata Ganik <orders@bataganik.com>',
            to: 'info@bataganik.com',
            subject: `New Contact Message: ${data.subject ?? 'No Subject'}`,
            html: `
        <p><strong>From:</strong> ${data.name} (${data.email})</p>
        <p><strong>Subject:</strong> ${data.subject ?? 'N/A'}</p>
        <hr />
        <p>${data.message.replace(/\n/g, '<br>')}</p>
      `,
        })

        return NextResponse.json({ message: 'Message sent successfully', id: message.id }, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.flatten().fieldErrors }, { status: 400 })
        }
        console.error('[POST /api/contact]', error)
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
    }
}
