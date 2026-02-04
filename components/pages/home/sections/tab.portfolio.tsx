import React from 'react'
import ProfilePortfolio from '@/components/pages/profile/profile.portfolio'
import { DBUser } from '@/lib/models'

type Props = {
  user: DBUser
}

const TabPortfolio: React.FC<Props> = ({ user }) => {
  return <ProfilePortfolio user={user} editable={false} />
}

export default TabPortfolio
