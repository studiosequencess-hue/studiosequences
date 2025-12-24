'use client'

import React from 'react'
import InputFile from '@/components/partials/input-file'
import { uploadFile } from '@/lib/actions.storage'
import { useAuthStore } from '@/store'
import { toast } from 'sonner'
import { StorageBucketType, StoragePath } from '@/lib/constants'
import { updateUserInfo } from '@/lib/actions.user'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

const BackgroundTop = () => {
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
      basename: 'background-top',
    })

    if (uploadResponse.status == 'error') {
      toast.error(uploadResponse.message)
    } else {
      const url = uploadResponse.data

      const updateInfoResponse = await updateUserInfo({
        user_id: user.id,
        background_top: `${url}?t=${new Date().getTime()}`,
      })

      if (updateInfoResponse.status == 'error') {
        toast.error(updateInfoResponse.message)
      } else {
        toast.success(updateInfoResponse.message)
        setUser({
          ...user,
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

  return (
    <div
      className={'absolute inset-0 h-full w-full grow'}
      style={{
        backgroundImage: user?.background_top
          ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${user?.background_top})`
          : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className={
          'group bg-background/25 absolute inset-0 z-10 flex cursor-pointer items-center justify-center text-sm/none opacity-0 transition-opacity hover:opacity-100'
        }
        onClick={() => {
          if (!ref.current) return

          ref.current.click()
        }}
      >
        {editing ? (
          <Spinner
            className={cn('absolute top-1/2 left-1/2 size-6 -translate-1/2')}
          />
        ) : (
          <span className={'hidden group-hover:block'}>change</span>
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
    </div>
  )
}

export default BackgroundTop
