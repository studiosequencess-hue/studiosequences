import React from 'react'
import ProfileLocation from '@/components/pages/profile/profile.location'
import ProfileContact from '@/components/pages/profile/profile.contact'

const ProfileExtraInfo = () => {
  return (
    <div className={'relative z-20 flex h-full w-fit max-w-96 flex-col gap-2'}>
      <ProfileLocation />
      <ProfileContact />
    </div>
  )
}

export default ProfileExtraInfo
