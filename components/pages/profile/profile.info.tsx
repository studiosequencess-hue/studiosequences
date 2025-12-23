'use client'

import React, { useRef } from 'react'
import { User } from '@/lib/models'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { HiBadgeCheck, HiOutlineBadgeCheck } from 'react-icons/hi'
import HoverCard from '@/components/partials/hover-card'
import EditDisplayName from '@/components/pages/profile/edit.display.name'
import EditPronoun from '@/components/pages/profile/edit.pronoun'
import { toast } from 'sonner'

type Props = {
  user: User
  setUser: (user: User) => void
}

enum EditingPopupType {
  DisplayName,
  Pronoun,
  AccountVerification,
}

const ProfileInfo: React.FC<Props> = ({ user, setUser }) => {
  const [editingPopupType, setEditingPopupType] =
    React.useState<EditingPopupType | null>(null)
  const backgroundTopRef = useRef<HTMLInputElement>(null)
  const [backgroundTopEditing, setBackgroundTopEditing] =
    React.useState<boolean>(false)

  return (
    <div className={'relative flex flex-col'}>
      <div
        className={cn(
          'group bg-primary-dark relative flex h-44 w-full items-end px-64 py-4',
          user.background_top &&
            'bg-[url(${user.background_top}) center center / cover no-repeat]',
        )}
      >
        <div
          className={
            'bg-background/25 absolute inset-0 z-10 flex cursor-pointer items-center justify-center text-sm/none opacity-0 transition-colors group-hover:opacity-100'
          }
          onClick={() => {
            if (!backgroundTopRef.current) return

            backgroundTopRef.current.click()
          }}
        >
          change
          <input
            ref={backgroundTopRef}
            type={'file'}
            className={'hidden'}
            multiple={false}
            accept={'image/*'}
            onChange={(e) => {
              const file = e.currentTarget.files?.[0]
              if (!file) {
                toast.error('No file selected')
              }
            }}
          />
        </div>
        <div className={'z-20 flex items-center gap-2'}>
          <EditDisplayName
            user={user}
            setUser={setUser}
            show={editingPopupType == EditingPopupType.DisplayName}
            setShow={(state) =>
              setEditingPopupType(state ? EditingPopupType.DisplayName : null)
            }
          />
          <EditPronoun
            user={user}
            setUser={setUser}
            show={editingPopupType == EditingPopupType.Pronoun}
            setShow={(state) =>
              setEditingPopupType(state ? EditingPopupType.Pronoun : null)
            }
          />

          <HoverCard
            trigger={
              <span className={'text-xl/none'}>
                {user.is_verified ? (
                  <HiBadgeCheck className={'text-accent-blue'} />
                ) : (
                  <HiOutlineBadgeCheck className={'text-muted-foreground'} />
                )}
              </span>
            }
            content={
              user.is_verified
                ? 'Account verified'
                : 'Contact support to obtain verification'
            }
          />
        </div>
      </div>
      <div
        className={cn(
          'bg-primary-dark/60 h-66 w-full',
          user.background_bottom &&
            'bg-[url(${user.background_top}) center center / cover no-repeat]',
        )}
      />
      <Avatar
        className={'absolute top-44 left-20 z-20 h-40 w-40 -translate-y-1/2'}
      >
        <AvatarImage src={user.avatar || ''} />
        <AvatarFallback className={'text-5xl/none'}>P</AvatarFallback>
      </Avatar>
    </div>
  )
}

export default ProfileInfo
