'use client'

import React from 'react'
import { DBUser, DBUserWithFollowStatus } from '@/lib/models'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/constants'
import { getFollowings, toggleFollow } from '@/lib/actions.followings'
import { Loader, UserCheck, Search, Users } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import UserAvatar from '@/components/partials/user-avatar'
import { cn, getUserFullName } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { debounce } from '@tanstack/pacer'
import { Spinner } from '@/components/ui/spinner'

type Props = {
  user: DBUser
  editable: boolean
  rootClassName?: string
}

const ProfileFollowings: React.FC<Props> = (props) => {
  const [searchQuery, setSearchQuery] = React.useState<string>('')
  const queryClient = useQueryClient()

  const followingsQuery = useQuery<DBUser[]>({
    queryKey: [QUERY_KEYS.FOLLOWINGS, props.user.id],
    queryFn: async () => {
      const response = await getFollowings({
        followerId: props.user.id,
      })

      if (response.status == 'error') {
        return []
      } else {
        return (response.data || []).map((f) => ({ ...f, is_following: true }))
      }
    },
  })

  const toggleFollowMutation = useMutation({
    mutationFn: async ({ followingId }: { followingId: DBUser['id'] }) => {
      const response = await toggleFollow({ followingId: followingId })
      return response.status == 'success'
    },
    onMutate: async ({ followingId }: { followingId: DBUser['id'] }) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.FOLLOWINGS, props.user.id],
      })

      const previousSuggestions = queryClient.getQueryData([
        QUERY_KEYS.FOLLOWINGS,
        props.user.id,
      ])

      queryClient.setQueryData(
        [QUERY_KEYS.FOLLOWINGS, props.user.id],
        (old: DBUserWithFollowStatus[]) => {
          return old?.map((user) =>
            user.id === followingId
              ? { ...user, is_following: !user.is_following }
              : user,
          )
        },
      )

      return { previousSuggestions }
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        [QUERY_KEYS.FOLLOWINGS, props.user.id],
        context?.previousSuggestions,
      )
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FOLLOWINGS, props.user.id],
      })
    },
  })

  const debouncedSearch = debounce(
    (searchTerm: string) => setSearchQuery(searchTerm),
    {
      wait: 500,
    },
  )

  const filteredFollowings = React.useMemo(() => {
    return (followingsQuery.data || []).filter(
      (user) =>
        user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [followingsQuery, searchQuery])

  if (followingsQuery.isLoading) {
    return (
      <div
        className={cn(
          'border-foreground/25 flex w-fit min-w-18 items-center justify-center gap-2 rounded-md border px-2 py-1 text-xs/none',
          props.rootClassName,
        )}
      >
        <Loader className={'size-4'} />
      </div>
    )
  }

  if (!props.editable)
    return (
      <div
        className={cn(
          'border-foreground/25 flex w-fit min-w-18 items-center justify-center gap-2 rounded-md border px-2 py-1 text-xs/none',
          props.rootClassName,
        )}
      >
        <UserCheck size={14} />
        <span>Following</span>
        <span>{(followingsQuery.data || []).length}</span>
      </div>
    )

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={cn(
            'border-foreground/25 flex cursor-pointer items-center justify-center gap-2 rounded-md border px-2 py-1 text-xs/none',
            props.rootClassName,
          )}
        >
          <UserCheck size={14} />
          <span>Followings</span>
          <span>{(followingsQuery.data || []).length}</span>
        </div>
      </DialogTrigger>
      <DialogContent className={'w-96'}>
        <DialogHeader>
          <DialogTitle>Following</DialogTitle>
          <DialogDescription className={'hidden'} />
        </DialogHeader>
        <div className={'flex flex-col gap-4'}>
          <InputGroup className="w-full">
            <InputGroupInput
              placeholder="Search..."
              onChange={(e) => debouncedSearch(e.currentTarget.value.trim())}
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            {searchQuery && (
              <InputGroupAddon align="inline-end">
                {filteredFollowings.length} results
              </InputGroupAddon>
            )}
          </InputGroup>

          <ScrollArea className="h-96 w-full">
            <div className="flex flex-col gap-1">
              {filteredFollowings.length > 0 ? (
                filteredFollowings.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between rounded-xl p-2.5"
                  >
                    <div className="flex items-center gap-3">
                      <UserAvatar src={user.avatar} />
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate text-sm/none font-bold">
                          {getUserFullName(user)}
                        </span>
                        <span className="truncate text-xs text-slate-500">
                          @{user.username}
                        </span>
                      </div>
                    </div>

                    <Button
                      size={'sm'}
                      variant={'outline'}
                      onClick={() =>
                        toggleFollowMutation.mutate({
                          followingId: user.id,
                        })
                      }
                      className="group bg-foreground text-background w-20 text-xs font-bold"
                    >
                      {toggleFollowMutation.isPending &&
                      toggleFollowMutation.variables.followingId == user.id ? (
                        <Spinner />
                      ) : (
                        <React.Fragment>
                          <span className="group-hover:hidden">Following</span>
                          <span className="hidden group-hover:inline">
                            Unfollow
                          </span>
                        </React.Fragment>
                      )}
                    </Button>
                  </div>
                ))
              ) : (
                <div className="my-10 flex flex-col items-center justify-center gap-3 opacity-40">
                  <Users className="size-8" />
                  <p className="text-sm/none font-medium">No accounts found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ProfileFollowings
