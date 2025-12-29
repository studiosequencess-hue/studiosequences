import React from 'react'
import Link from 'next/link'
import { IoGlobeOutline, IoSearch } from 'react-icons/io5'
import { Button } from '@/components/ui/button'
import { BsBriefcaseFill } from 'react-icons/bs'

const HeaderContentUnauthenticated = () => {
  return (
    <div className="flex h-full w-full items-center justify-between px-12">
      <div className="flex h-full items-center gap-8">
        <Link href={'/'}>
          <h1 className="font-display text-2xl font-bold">Studio Sequence</h1>
        </Link>
        <div className="hidden h-full gap-6 md:flex">
          <Link
            href="/"
            className="hover:border-primary-light flex h-full items-center gap-1.5 border-b border-b-transparent px-2 transition-colors"
          >
            <IoGlobeOutline />
            Discover
          </Link>
          <Link
            href="/companies"
            className="hover:border-primary-light flex h-full items-center gap-1.5 border-b border-b-transparent px-2 transition-colors"
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
        <Link href={'/login'}>
          <Button size={'sm'} variant={'secondary'}>
            Sign In
          </Button>
        </Link>
        <Link href={'/signup'}>
          <Button size={'sm'} variant={'link'} className={'text-primary-light'}>
            Sign Up
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default HeaderContentUnauthenticated
