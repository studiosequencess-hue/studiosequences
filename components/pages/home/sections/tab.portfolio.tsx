import React from 'react'
import ProfilePortfolio from '@/components/pages/profile/profile.portfolio'
import { UserInfo } from '@/lib/models'

type Props = {
  user: UserInfo
}

const TabPortfolio: React.FC<Props> = ({ user }) => {
  return <ProfilePortfolio user={user} editable={false} />
}

export default TabPortfolio
