'use client'

import React from 'react'
import { useAuthStore } from '@/store'
import HeaderContentAuthenticated from '@/components/partials/header/header.content.authenticated'
import HeaderContentUnauthenticated from '@/components/partials/header/header.content.unauthenticated'
import ThemeToggler from '@/components/partials/theme-toggler'

const Header = () => {
  const { user, loading } = useAuthStore()

  return (
    <nav className="text-primary-light relative flex h-14 w-full items-center border-b border-white/25 px-12 backdrop-blur-[20px]">
      {loading && <div className={'absolute inset-0 z-10 bg-transparent'} />}
      {user ? <HeaderContentAuthenticated /> : <HeaderContentUnauthenticated />}
      <ThemeToggler />
    </nav>
  )
}

export default Header
