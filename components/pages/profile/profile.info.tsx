import React from 'react'
import { User } from '@/lib/models'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { HiBadgeCheck, HiOutlineBadgeCheck } from 'react-icons/hi'
import HoverCard from '@/components/partials/hover-card'
import DisplayName from '@/components/pages/profile/display.name'
import Pronoun from '@/components/pages/profile/pronoun'
import BackgroundTop from '@/components/pages/profile/background.top'

type Props = {
  user: User
}

const ProfileInfo: React.FC<Props> = ({ user }) => {
  return (
    <div className={'relative flex flex-col'}>
      <div
        className={cn(
          'bg-primary-dark relative flex h-44 w-full items-end px-64 py-4',
        )}
      >
        <BackgroundTop />
        <div className={'z-20 flex items-center gap-2'}>
          <DisplayName />
          <Pronoun />

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
