import React from 'react'
import ProfileLocation from '@/components/pages/profile/profile.location'
import ProfileContact from '@/components/pages/profile/profile.contact'
import ProfileOccupation from '@/components/pages/profile/profile.occupation'
import ProfileSocials from '@/components/pages/profile/profile.socials'
import ProfileOpenToWork from '@/components/pages/profile/profile.open.to.work'
import { DBUser } from '@/lib/models'
import { UserRole } from '@/lib/constants'
import ProfileFollowings from '@/components/pages/profile/profile.followings'

type Props = {
  user: DBUser
  editable: boolean
}

const ProfileExtraInfo: React.FC<Props> = ({ user, editable }) => {
  return (
    <div className={'relative z-20 flex h-full w-fit max-w-96 flex-col gap-3'}>
      {user.role == UserRole.User.toString() && (
        <ProfileOpenToWork editable={editable} />
      )}
      <ProfileOccupation editable={editable} />
      <ProfileLocation user={user} editable={editable} />
      <ProfileContact user={user} editable={editable} />
      <ProfileSocials user={user} editable={editable} />
      <ProfileFollowings
        user={user}
        editable={editable}
        rootClassName={'my-1.5'}
      />
    </div>
  )
}

export default ProfileExtraInfo
