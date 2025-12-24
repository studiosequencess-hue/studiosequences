'use client'

import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuthStore } from '@/store'
import { Button } from '@/components/ui/button'
import { deleteFile, uploadFile } from '@/lib/actions.storage'
import { StorageBucketType, StoragePath } from '@/lib/constants'
import { toast } from 'sonner'
import { updateUserInfo } from '@/lib/actions.user'
import { cn } from '@/lib/utils'
import InputFile from '@/components/partials/input-file'
import { Spinner } from '@/components/ui/spinner'

const ProfileAvatar = () => {
  const { user, setUser } = useAuthStore()
  const ref = React.useRef<HTMLInputElement>(null)
  const [editing, setEditing] = React.useState<boolean>(false)

  const handleFileUpload = async (file: File) => {
    if (editing) return
    if (!user) return

    setEditing(true)

    const uploadResponse = await uploadFile({
      bucket: StorageBucketType.Images,
      file: file,
      path: StoragePath.User,
      user_id: user.id,
      basename: 'avatar',
    })

    if (uploadResponse.status == 'error') {
      toast.error(uploadResponse.message)
    } else {
      const url = uploadResponse.data

      const updateInfoResponse = await updateUserInfo({
        user_id: user.id,
        avatar: `${url}?t=${new Date().getTime()}`,
      })

      if (updateInfoResponse.status == 'error') {
        toast.error(updateInfoResponse.message)
      } else {
        toast.success(updateInfoResponse.message)
        setUser({
          ...user,
          avatar: url,
        })
      }
    }

    if (ref.current) {
      ref.current.files = null
      ref.current.value = ''
    }
    setEditing(false)
  }

  const handleDelete = async () => {
    if (editing) return
    if (!user) return
    if (!user.avatar) return

    setEditing(true)

    const [deleteResponse, updateInfoResponse] = await Promise.all([
      deleteFile({
        user_id: user.id,
        bucket: StorageBucketType.Images,
        publicUrl: user.avatar,
      }),
      updateUserInfo({
        user_id: user.id,
        avatar: '',
      }),
    ])

    if (deleteResponse.status == 'error') {
      toast.error(deleteResponse.message)
    }
    if (updateInfoResponse.status == 'error') {
      toast.error(updateInfoResponse.message)
    }
    if (
      deleteResponse.status == 'success' &&
      updateInfoResponse.status == 'success'
    ) {
      toast.success('Background deleted successfully')
      setUser({
        ...user,
        avatar: '',
      })
    }

    setEditing(false)
  }

  return (
    <Avatar
      className={
        'group absolute top-44 left-20 z-20 h-40 w-40 -translate-y-1/2'
      }
    >
      <AvatarImage src={user?.avatar || ''} />
      <AvatarFallback className={'text-5xl/none'}>P</AvatarFallback>

      <div
        className={cn(
          'group bg-background/35 absolute inset-0 z-10 flex items-center justify-center text-sm/none opacity-0 transition-opacity hover:opacity-100',
          editing && 'opacity-100',
        )}
      >
        {editing ? (
          <Spinner
            className={cn('absolute top-1/2 left-1/2 size-6 -translate-1/2')}
          />
        ) : (
          <div
            className={
              'absolute inset-0 hidden flex-col items-center justify-center gap-2 group-hover:flex'
            }
          >
            <Button
              size={'sm'}
              variant={'secondary'}
              onClick={() => {
                if (!ref.current) return

                ref.current.click()
              }}
            >
              change
            </Button>

            {user?.avatar && (
              <Button
                size={'sm'}
                variant={'destructive'}
                onClick={handleDelete}
              >
                delete
              </Button>
            )}
          </div>
        )}
        <InputFile
          ref={ref}
          accept={'image/*'}
          disabled={editing}
          className={'hidden'}
          multiple={false}
          onFileUpload={handleFileUpload}
        />
      </div>
    </Avatar>
  )
}

export default ProfileAvatar
