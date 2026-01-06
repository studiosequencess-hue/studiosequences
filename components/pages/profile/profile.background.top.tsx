'use client'

import React from 'react'
import InputFile from '@/components/partials/input-file'
import { deleteFile, uploadFile } from '@/lib/actions.storage'
import { useAuthStore } from '@/store'
import { toast } from 'sonner'
import { StorageBucketType, StoragePath } from '@/lib/constants'
import { updateUserInfo } from '@/lib/actions.user'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { UserInfo } from '@/lib/models'

type Props = {
  user: UserInfo
  editable: boolean
}

const ProfileBackgroundTop: React.FC<Props> = ({ user, editable }) => {
  const { user: currentUser, setUser } = useAuthStore()
  const ref = React.useRef<HTMLInputElement>(null)
  const [editing, setEditing] = React.useState<boolean>(false)

  const handleFileUpload = async (file: File) => {
    if (editing) return
    if (!currentUser) return
    if (!editable) return

    setEditing(true)

    const uploadResponse = await uploadFile({
      bucket: StorageBucketType.Images,
      file: file,
      path: StoragePath.User,
      user_id: currentUser.id,
      basename: 'background-top',
    })

    if (uploadResponse.status == 'error') {
      toast.error(uploadResponse.message)
    } else {
      const url = uploadResponse.data

      const updateInfoResponse = await updateUserInfo({
        user_id: currentUser.id,
        background_top: `${url}?t=${new Date().getTime()}`,
      })

      if (updateInfoResponse.status == 'error') {
        toast.error(updateInfoResponse.message)
      } else {
        toast.success(updateInfoResponse.message)
        setUser({
          ...currentUser,
          background_top: url,
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
    if (!currentUser) return
    if (!currentUser.background_top) return

    setEditing(true)

    const [deleteResponse, updateInfoResponse] = await Promise.all([
      deleteFile({
        user_id: currentUser.id,
        bucket: StorageBucketType.Images,
        publicUrl: currentUser.background_top,
      }),
      updateUserInfo({
        user_id: currentUser.id,
        background_top: '',
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
        ...currentUser,
        background_top: '',
      })
    }

    setEditing(false)
  }

  return (
    <div className={'absolute inset-0 h-full w-full grow'}>
      {user?.background_top && (
        <div className={'absolute inset-0'}>
          <Image
            src={user.background_top}
            alt={'background-image-top'}
            layout="fill"
            objectFit="cover"
            unoptimized
          />
          <div className={'bg-background absolute inset-0 z-0 opacity-40'} />
        </div>
      )}
      {editable && (
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
            <div className={'hidden items-center gap-2 group-hover:flex'}>
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

              {currentUser?.background_top && (
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
      )}
    </div>
  )
}

export default ProfileBackgroundTop
