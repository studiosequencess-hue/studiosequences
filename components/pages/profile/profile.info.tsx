import React from 'react'
import { User } from '@/lib/models'
import { cn } from '@/lib/utils'
import { HiBadgeCheck, HiOutlineBadgeCheck } from 'react-icons/hi'
import HoverCard from '@/components/partials/hover-card'
import ProfileDisplayName from '@/components/pages/profile/profile.display.name'
import ProfilePronoun from '@/components/pages/profile/profile.pronoun'
import ProfileBackgroundTop from '@/components/pages/profile/profile.background.top'
import ProfileBackgroundBottom from '@/components/pages/profile/profile.background.bottom'
import ProfileAvatar from '@/components/pages/profile/profile.avatar'
import ProfileExtraInfo from '@/components/pages/profile/profile.extra.info'

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
        <ProfileBackgroundTop />
        <div className={'z-20 flex items-center gap-2'}>
          <ProfileDisplayName />
          <ProfilePronoun />

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
          'bg-primary-dark/60 relative z-0 min-h-66 w-full pt-22 pl-20',
        )}
      >
        <ProfileExtraInfo />
        <ProfileBackgroundBottom />
      </div>
      <ProfileAvatar />
    </div>
  )
}

export default ProfileInfo
