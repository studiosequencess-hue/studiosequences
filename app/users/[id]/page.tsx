import React from 'react'
import ProfileInfo from '@/components/pages/profile/profile.info'
import EmptyPage from '@/components/empty.page'
import { getUser } from '@/lib/actions.auth'

type Props = {
  params: Promise<{ id: string }>
}

const ProfilePage: React.FC<Props> = async (props) => {
  const [userResponse, { id }] = await Promise.all([getUser(), props.params])

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
      <ProfileInfo
        user={userResponse.data}
        editable={id === userResponse.data.id}
      />
    </div>
  )
}

export default ProfilePage
