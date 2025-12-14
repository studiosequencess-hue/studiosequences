import React from 'react'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/actions.auth'

type Props = {
  children: React.ReactNode
}

const Layout: React.FC<Props> = async ({ children }) => {
  const response = await getUser()

  if (response.status == 'success' && response.data) {
    redirect('/')
  }

  return <React.Fragment>{children}</React.Fragment>
}

export default Layout
