import React from 'react'
import { getUser } from '@/lib/actions.auth'
import { redirect } from 'next/navigation'
import Loader from '@/components/partials/loader'

const UsersPage = async () => {
  const userResponse = await getUser()

  if (userResponse.status == 'error') {
    redirect('/')
  }

  redirect(`/users/${userResponse.data.id}`)

  return <Loader />
}

export default UsersPage
