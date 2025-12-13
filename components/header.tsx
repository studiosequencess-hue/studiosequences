import React from 'react'
import Link from 'next/link'
import { IoGlobeOutline, IoSearch } from 'react-icons/io5'
import { Button } from '@/components/ui/button'
import { BsBriefcaseFill } from 'react-icons/bs'

const Header = () => {
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

        <div className="flex items-center space-x-4">
          <Button variant={'secondary'}>Sign In</Button>
          <Button variant={'link'} className={'text-primary-light'}>
            Sign Up
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default Header
