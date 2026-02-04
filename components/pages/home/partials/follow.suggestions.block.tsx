'use client'

import React from 'react'
import { UserCheck, UserPlus } from 'lucide-react'
import { DBUser, DBUserWithFollowStatus } from '@/lib/models'
import { getUserFullName } from '@/lib/utils'
import UserAvatar from '@/components/partials/user-avatar'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getFollowSuggestions, toggleFollow } from '@/lib/actions.followings'
import { FOLLOW_SUGGESTIONS_LIMIT } from '@/lib/defaults'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Spinner } from '@/components/ui/spinner'
import Loader from '@/components/partials/loader'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { QUERY_KEYS } from '@/lib/constants'

const FollowSuggestionsBlock: React.FC = () => {
  const queryClient = useQueryClient()

  const suggestionsQuery = useQuery<DBUserWithFollowStatus[]>({
    queryKey: [QUERY_KEYS.FOLLOW_SUGGESTIONS],
    queryFn: async () => {
      const response = await getFollowSuggestions({
        count: FOLLOW_SUGGESTIONS_LIMIT,
      })

      if (response.status == 'error') {
        return []
      } else {
        return (response.data || []).map((i) => ({
          ...i,
          is_following: false,
        }))
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
        queryKey: [QUERY_KEYS.FOLLOW_SUGGESTIONS],
      })

      const previousSuggestions = queryClient.getQueryData([
        QUERY_KEYS.FOLLOW_SUGGESTIONS,
      ])

      queryClient.setQueryData(
        [QUERY_KEYS.FOLLOW_SUGGESTIONS],
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
        [QUERY_KEYS.FOLLOW_STATUS, variables.followingId],
        context?.previousSuggestions,
      )
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FOLLOW_STATUS, variables.followingId],
      })
    },
  })

  const suggestions: DBUserWithFollowStatus[] = suggestionsQuery.data || []

  if (suggestionsQuery.isLoading) {
    return <Loader wrapperClassName={'h-full w-full'} />
  }

  if (suggestions.length == 0) {
    return (
      <div
        className={
          'text-muted-foreground flex h-full w-full items-center justify-center text-sm/none'
        }
      >
        No suggestions
      </div>
    )
  }

  return (
    <ScrollArea className={'h-full w-full'}>
      {suggestions.map((user) => (
        <Link
          key={user.id}
          href={`/users/${user.id}`}
          className="group flex cursor-pointer items-center justify-between px-2 py-3 pr-3 transition-colors hover:bg-gray-100"
        >
          <div className="flex items-start gap-3">
            <UserAvatar src={user.avatar} />

            <div className="flex flex-col gap-0.5">
              <h3 className="flex items-center gap-1">
                <span className={'w-28 truncate text-sm/none font-bold'}>
                  {getUserFullName(user)}
                </span>
              </h3>
              <p className="text-muted-foreground w-28 truncate text-xs/none">
                @{user.username}
              </p>
              {user.occupation && (
                <p className="text-muted-foreground w-28 truncate text-xs/none">
                  {user.occupation}
                </p>
              )}
            </div>
          </div>

          <Button
            variant={'ghost'}
            disabled={
              toggleFollowMutation.isPending &&
              toggleFollowMutation.variables.followingId == user.id
            }
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-gray-200`}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()

              toggleFollowMutation.mutate({ followingId: user.id })
            }}
          >
            {toggleFollowMutation.isPending &&
            toggleFollowMutation.variables.followingId == user.id ? (
              <Spinner />
            ) : user.is_following ? (
              <UserCheck size={16} />
            ) : (
              <UserPlus size={16} />
            )}
          </Button>
        </Link>
      ))}
    </ScrollArea>
  )
}

export default FollowSuggestionsBlock
