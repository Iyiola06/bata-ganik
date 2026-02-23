import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

// POST /api/upload — upload a file to Supabase Storage (admin only)
export async function POST(request: NextRequest) {
    // Verify admin session
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !['admin', 'super_admin'].includes(user.app_metadata?.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const formData = await request.formData()
        const file = formData.get('file') as File | null
        const bucket = (formData.get('bucket') as string) ?? 'product-images'

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        const maxSize = 5 * 1024 * 1024 // 5 MB
        if (file.size > maxSize) {
            return NextResponse.json({ error: 'File must be under 5MB' }, { status: 400 })
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: 'File type not supported' }, { status: 400 })
        }

        const ext = file.name.split('.').pop()
        const filename = `${Date.now()}-${Math.random().toString(36).substr(2, 8)}.${ext}`
        const path = `${filename}`

        const adminClient = await createSupabaseAdminClient()
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const { error } = await adminClient.storage
            .from(bucket)
            .upload(path, buffer, {
                contentType: file.type,
                upsert: false,
            })

        if (error) {
            console.error('[Upload error]', error)
            return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
        }

        const { data: { publicUrl } } = adminClient.storage
            .from(bucket)
            .getPublicUrl(path)

        return NextResponse.json({ url: publicUrl, path })
    } catch (error) {
        console.error('[POST /api/upload]', error)
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }
}
