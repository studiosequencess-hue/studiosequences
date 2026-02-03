'use client'

import React from 'react'
import { signOut } from '@/lib/actions.auth'
import { useAuthStore, useProjectsDialogStore } from '@/store'
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
import HeaderSearchbar from '@/components/partials/header/header.searchbar'
import { Plus } from 'lucide-react'
import { usePostsDialogStore } from '@/store/post.dialog.store'
import UserAvatar from '@/components/partials/user-avatar'

const HeaderContentAuthenticated = () => {
  const { user, setLoading, setUser } = useAuthStore()
  const { show: projectDialogShow } = useProjectsDialogStore()
  const { show: postDialogShow } = usePostsDialogStore()
  const router = useRouter()
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false)
  const [newDropdownOpen, setNewDropdownOpen] = React.useState(false)

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
    <div className="flex h-full w-full items-center justify-between">
      <div className="flex h-full w-full items-center gap-8">
        <Link href={'/'}>
          <h1 className="font-display text-2xl/none font-bold">
            Studio Sequence
          </h1>
        </Link>
        <HeaderSearchbar />
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
              onClick={() => router.push('/jobs')}
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

        <DropdownMenu open={newDropdownOpen} onOpenChange={setNewDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <div
              className={
                'hover:bg-primary flex h-8 w-8 items-center justify-center rounded-full'
              }
            >
              <Plus />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent side={'bottom'} align={'end'}>
            <DropdownMenuItem
              disabled={!user}
              onSelect={() => user && postDialogShow(null, true)}
            >
              New post
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={!user}
              onSelect={() => user && projectDialogShow(null, true)}
            >
              New portfolio project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu
          open={profileDropdownOpen}
          onOpenChange={setProfileDropdownOpen}
        >
          <DropdownMenuTrigger>
            <UserAvatar src={user?.avatar} />
          </DropdownMenuTrigger>
          <DropdownMenuContent side={'bottom'} align={'end'}>
            <DropdownMenuItem
              disabled={!user}
              onSelect={() => user && router.push(`/users/${user.id}`)}
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                handleSignOut()
                setProfileDropdownOpen(false)
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
