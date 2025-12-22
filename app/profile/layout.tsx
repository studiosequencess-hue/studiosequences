import React from 'react'
import { getUser } from '@/lib/actions.auth'
import EmptyPage from '@/components/empty.page'

const ProfileLayout = async () => {
  const response = await getUser()

  if (response.status == 'error') {
    return <EmptyPage.Error title="error" description={response.message} />
  }

  return <div></div>
}

export default ProfileLayout
