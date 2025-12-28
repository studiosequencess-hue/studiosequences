import React from 'react'
import ProfileLocation from '@/components/pages/profile/profile.location'
import ProfileContact from '@/components/pages/profile/profile.contact'
import ProfileOccupation from '@/components/pages/profile/profile.occupation'
import ProfileSocials from '@/components/pages/profile/profile.socials'
import ProfileOpenToWork from '@/components/pages/profile/profile.open.to.work'

const ProfileExtraInfo = () => {
  return (
    <div className={'relative z-20 flex h-full w-fit max-w-96 flex-col gap-3'}>
      <ProfileOpenToWork />
      <ProfileOccupation />
      <ProfileLocation />
      <ProfileContact />
      <ProfileSocials />
    </div>
  )
}

export default ProfileExtraInfo
