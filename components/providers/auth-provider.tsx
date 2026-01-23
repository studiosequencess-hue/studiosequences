'use client'

import React from 'react'
import { useAuthStore } from '@/store'
import { getUser } from '@/lib/actions.auth'
import debounce from 'debounce'
import { AUTH_CHECK_EVENT_ID } from '@/lib/constants'
import Loader from '@/components/partials/loader'

type Props = {
  children: React.ReactNode
}

const AuthProvider: React.FC<Props> = ({ children }) => {
  const { setUser, setLoading } = useAuthStore()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)

    const fetchUser = debounce(() => {
      setLoading(true)
      getUser()
        .then((response) => {
          // console.log('getUser', response)
          if (response.status == 'success') {
            setUser(response.data || null)
          } else {
            setUser(null)
          }
        })
        .finally(() => setLoading(false))
    }, 100)

    fetchUser()

    document.addEventListener(AUTH_CHECK_EVENT_ID, fetchUser)

    return () => {
      document.removeEventListener(AUTH_CHECK_EVENT_ID, fetchUser)
    }
  }, [setUser, setLoading])

  if (!mounted) return <Loader wrapperClassName={'h-screen'} />

  return <React.Fragment>{children}</React.Fragment>
}

export default AuthProvider
