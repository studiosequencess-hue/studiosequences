'use client'

import React from 'react'
import { signOut } from '@/lib/actions.auth'
import { useAuthStore } from '@/store'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import Link from 'next/link'
import { IoSearch } from 'react-icons/io5'
import { FaMessage } from 'react-icons/fa6'
import { MdNotifications } from 'react-icons/md'
import { BsBriefcaseFill } from 'react-icons/bs'
import HoverCard from '@/components/partials/hover-card'
import { AiFillHome } from 'react-icons/ai'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const HeaderContentAuthenticated = () => {
  const { user, setLoading, setUser } = useAuthStore()
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = React.useState(false)

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

  React.useEffect(() => {
    router.prefetch('/')
  }, [])

  return (
    <div className="flex h-full w-full items-center justify-between px-12">
      <div className="flex h-full items-center gap-8">
        <Link href={'/'}>
          <h1 className="font-display text-2xl font-bold">Studio Sequence</h1>
        </Link>
        <div className="flex w-96 cursor-pointer items-center rounded-lg bg-white/15 p-2 transition-colors">
          <IoSearch />
        </div>
      </div>

      <div className={'flex items-center gap-2'}>
        <HoverCard
          trigger={
            <AiFillHome
              size={20}
              className={
                'text-foreground group-hover:text-foreground/80 transition-colors'
              }
              onClick={() => router.push('/')}
            />
          }
          content={'Home'}
          triggerClassName={
            'group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full'
          }
        />
        <HoverCard
          trigger={
            <BsBriefcaseFill
              size={20}
              className={
                'text-foreground group-hover:text-foreground/80 transition-colors'
              }
              onClick={() => router.push('/')}
            />
          }
          content={'Jobs'}
          triggerClassName={
            'group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full'
          }
        />
        <HoverCard
          trigger={
            <div
              className={
                'group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full'
              }
            >
              <MdNotifications
                size={24}
                className={
                  'text-foreground group-hover:text-foreground/80 transition-colors'
                }
              />
              <div
                className={
                  'bg-accent-blue absolute top-[55%] left-[55%] z-1 h-2.5 w-2.5 rounded-full text-xs/none'
                }
              />
            </div>
          }
          content={'Notifications'}
          triggerClassName={
            'group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full'
          }
        />
        <HoverCard
          trigger={
            <div
              className={
                'group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full'
              }
            >
              <FaMessage
                size={18}
                className={
                  'text-foreground group-hover:text-foreground/80 transition-colors'
                }
              />
              <div
                className={
                  'bg-accent-blue absolute top-[55%] left-[55%] z-1 h-2.5 w-2.5 rounded-full text-xs/none'
                }
              />
            </div>
          }
          content={'Messages'}
          triggerClassName={
            'group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full'
          }
        />

        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src={user?.avatar || ''} />
              <AvatarFallback>{'P'}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent side={'bottom'} align={'end'}>
            <DropdownMenuItem>
              <Link href={'/profile'}>Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                handleSignOut()
                setDropdownOpen(false)
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default HeaderContentAuthenticated
