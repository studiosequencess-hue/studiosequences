import React from 'react'

type Props = {
  children: React.ReactNode
}

const ProfileLayout: React.FC<Props> = async ({ children }) => {
  return <React.Fragment>{children}</React.Fragment>
}

export default ProfileLayout
