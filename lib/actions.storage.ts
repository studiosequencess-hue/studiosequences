'use server'

import { createClient } from '@/lib/supabase.server'
import { ServerResponse } from '@/lib/models'
import { StorageBucketType, StoragePath } from '@/lib/constants'
import { getPathFromPublicUrl } from '@/lib/utils'

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '1024 * 1024 * 5')

type UploadFileProps = {
  user_id: string
  bucket: StorageBucketType
  file: File
  path: StoragePath
  basename: string
}

export async function uploadFile(
  props: UploadFileProps,
): Promise<ServerResponse<string>> {
  try {
    const supabase = await createClient()
    const currentUserResponse = await supabase.auth.getUser()

    if (currentUserResponse.error) {
      return {
        status: 'error',
        message: currentUserResponse.error.message,
      }
    }

    if (currentUserResponse.data.user.id != props.user_id) {
      return {
        status: 'error',
        message: 'Invalid access permission. Please try again later.',
      }
    }

    if (props.file.size > MAX_FILE_SIZE) {
      return {
        status: 'error',
        message: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit.`,
      }
    }

    if (!props.file.type.startsWith('image/')) {
      return {
        status: 'error',
        message: `File type is not supported. Please upload an image file.`,
      }
    }

    const ext = props.file.name.split('.').pop() || '.png'

    const uploadResponse = await supabase.storage
      .from(props.bucket)
      .upload(
        `${props.path}/${props.basename}.${ext}`.replace(
          '{id}',
          currentUserResponse.data.user.id,
        ),
        props.file,
        {
          upsert: true,
        },
      )

    if (uploadResponse.error) {
      return {
        status: 'error',
        message: uploadResponse.error.message,
      }
    }

    const publicUrlResponse = supabase.storage
      .from(props.bucket)
      .getPublicUrl(uploadResponse.data.path)

    return {
      status: 'success',
      message: 'Successfully uploaded file.',
      data: publicUrlResponse.data.publicUrl,
    }
  } catch (e) {
    console.log('getUser', e)
    return {
      status: 'error',
      message: 'Failed to fetch user. Please try again later.',
    }
  }
}

type DeleteFileProps = {
  user_id: string
  bucket: StorageBucketType
  publicUrl: string
}

export async function deleteFile(
  props: DeleteFileProps,
): Promise<ServerResponse<boolean>> {
  try {
    const supabase = await createClient()
    const currentUserResponse = await supabase.auth.getUser()

    if (currentUserResponse.error) {
      return {
        status: 'error',
        message: currentUserResponse.error.message,
      }
    }

    if (currentUserResponse.data.user.id != props.user_id) {
      return {
        status: 'error',
        message: 'Invalid access permission. Please try again later.',
      }
    }

    const path = getPathFromPublicUrl(props.publicUrl, props.bucket)
    if (!path) {
      return {
        status: 'error',
        message: 'Invalid file path.',
      }
    }

    const deleteResponse = await supabase.storage
      .from(props.bucket)
      .remove([path])

    if (deleteResponse.error) {
      return {
        status: 'error',
        message: deleteResponse.error.message,
      }
    }

    return {
      status: 'success',
      message: 'Successfully removed file.',
      data: true,
    }
  } catch (e) {
    console.log('getUser', e)
    return {
      status: 'error',
      message: 'Failed to fetch user. Please try again later.',
    }
  }
}
