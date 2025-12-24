import React from 'react'
import ProfileInfo from '@/components/pages/profile/profile.info'
import EmptyPage from '@/components/empty.page'
import { getUser } from '@/lib/actions.auth'

const ProfilePage = async () => {
  const userResponse = await getUser()

  if (userResponse.status == 'error') {
    return (
      <EmptyPage.Error
        title={'No such user found.'}
        description={'Please, try to login or contact support.'}
      />
    )
  }

  return (
    <div className={'flex grow flex-col'}>
      <ProfileInfo user={userResponse.data} />
    </div>
  )
}

export default ProfilePage
