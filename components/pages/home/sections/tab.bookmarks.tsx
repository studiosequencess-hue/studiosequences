'use client'

import React from 'react'
import PostCard from '@/components/partials/posts/post.card'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getBookmarks } from '@/lib/actions.posts'
import { POSTS_PER_PAGE } from '@/lib/defaults'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store'
import { QUERY_KEYS } from '@/lib/constants'

const TabBookmarks = () => {
  const { user } = useAuthStore()

  const fetchPostsQuery = useInfiniteQuery({
    queryKey: [QUERY_KEYS.BOOKMARKS],
    initialPageParam: {
      pageIndex: 0,
      pageSize: POSTS_PER_PAGE,
    },
    queryFn: async ({ pageParam: params }) => {
      const response = await getBookmarks({
        ...params,
        userId: user?.id,
      })

      return response.status == 'success' ? response.data : []
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0
        ? {
            pageIndex: allPages.length,
            pageSize: POSTS_PER_PAGE,
          }
        : undefined
    },
  })

  const posts = fetchPostsQuery.data?.pages.flat() || []

  return (
    <div
      className={
        'mx-auto flex w-full max-w-[600px] flex-col items-center gap-3 pb-6'
      }
    >
      {posts.length == 0 && fetchPostsQuery.isFetching && <Spinner />}
      {posts.length == 0 && !fetchPostsQuery.isFetching && (
        <div className={'text-muted-foreground text-sm/none'}>No posts yet</div>
      )}
      {posts.map((post, postIndex) => {
        return (
          <PostCard
            key={`post-${postIndex}`}
            post={post}
            onDelete={() => {
              fetchPostsQuery.refetch()
            }}
          />
        )
      })}

      {fetchPostsQuery.hasNextPage && (
        <Button
          size={'sm'}
          variant={'secondary'}
          onClick={() => fetchPostsQuery.fetchNextPage()}
          className={'mt-6'}
        >
          {fetchPostsQuery.isFetchingNextPage ? <Spinner /> : 'Load More'}
        </Button>
      )}
    </div>
  )
}

export default TabBookmarks
