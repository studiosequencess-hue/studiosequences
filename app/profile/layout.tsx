import React from 'react'
import { getUser } from '@/lib/actions.auth'
import EmptyPage from '@/components/empty.page'

type Props = {
  children: React.ReactNode
}

const ProfileLayout: React.FC<Props> = async ({ children }) => {
  const response = await getUser()

  if (response.status == 'error') {
    return <EmptyPage.Error title="error" description={response.message} />
  }

  return <React.Fragment>{children}</React.Fragment>
}

export default ProfileLayout
