'use client'

import React from 'react'
import ProfileInfo from '@/components/pages/profile/profile.info'
import { useAuthStore } from '@/store'
import Loader from '@/components/partials/loader'
import EmptyPage from '@/components/empty.page'

const ProfilePage = () => {
  const { user, loading } = useAuthStore()

  if (loading) return <Loader wrapperClassName={'min-h-screen'} />
  if (!user)
    return (
      <EmptyPage.Error
        title={'No such user found.'}
        description={'Please, try to login or contact support.'}
      />
    )

  return (
    <div className={'flex grow flex-col'}>
      <ProfileInfo user={user} />
    </div>
  )
}

export default ProfilePage
