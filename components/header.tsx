'use client'

import React from 'react'
import Link from 'next/link'
import { IoGlobeOutline, IoSearch } from 'react-icons/io5'
import { Button } from '@/components/ui/button'
import { BsBriefcaseFill } from 'react-icons/bs'
import { useAuthStore } from '@/store'
import { signOut } from '@/lib/actions.auth'
import { Spinner } from '@/components/ui/spinner'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const Header = () => {
  const { user, loading, setLoading, setUser } = useAuthStore()
  const router = useRouter()

  const handleSignOut = async () => {
    setLoading(true)

    const response = await signOut()

    if (response.status == 'success') {
      router.push('/')
      setUser(null)
      toast.success(response.message)
    } else {
      toast.error(response.message)
    }

    setLoading(false)
  }

  return (
    <nav className="text-primary-light border-b border-white/25 backdrop-blur-[20px]">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href={'/'}>
            <h1 className="font-display text-2xl font-bold">Studio Sequence</h1>
          </Link>
          <div className="hidden gap-6 md:flex">
            <Link
              href="/"
              className="hover:border-primary-light border-b-primary-dark flex h-full items-center gap-1.5 border-b px-2 py-4 transition-colors"
            >
              <IoGlobeOutline />
              Discover
            </Link>
            <Link
              href="/"
              className="hover:border-primary-light border-b-primary-dark flex h-full items-center gap-1.5 border-b px-2 py-4 transition-colors"
            >
              <BsBriefcaseFill />
              Companies
            </Link>
          </div>
          <div className="flex w-44 cursor-pointer items-center rounded-lg bg-white/15 p-2 transition-colors">
            <IoSearch />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <React.Fragment>
              <Button size={'sm'} variant={'secondary'} onClick={handleSignOut}>
                {loading ? (
                  <div className={'flex items-center gap-2'}>
                    <Spinner />
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Sign Out'
                )}
              </Button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Link href={'/login'}>
                <Button size={'sm'} variant={'secondary'}>
                  Sign In
                </Button>
              </Link>
              <Link href={'/signup'}>
                <Button
                  size={'sm'}
                  variant={'link'}
                  className={'text-primary-light'}
                >
                  Sign Up
                </Button>
              </Link>
            </React.Fragment>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Header
