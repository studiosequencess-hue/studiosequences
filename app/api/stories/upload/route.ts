import { NextResponse } from 'next/server'
import { createStory } from '@/lib/actions.stories'
import { createClient } from '@/lib/supabase.server'
import { prepareFileType } from '@/lib/utils'
import { StorageBucketType } from '@/lib/constants'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = prepareFileType(formData.get('type') as string)

    if (!file) {
      return NextResponse.json({ error: 'No file' }, { status: 400 })
    }

    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(StorageBucketType.Stories)
      .upload(fileName, file, { contentType: file.type })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(StorageBucketType.Stories).getPublicUrl(fileName)

    // Create in database
    const result = await createStory(publicUrl, type)

    if (result.status === 'error') {
      return NextResponse.json({ error: result.message }, { status: 500 })
    }

    return NextResponse.json(result)
  } catch (e) {
    console.error('Upload error:', e)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
