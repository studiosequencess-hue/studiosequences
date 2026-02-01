'use client'

import React from 'react'
import PostCard from '@/components/partials/posts/post.card'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getPosts } from '@/lib/actions.posts'
import { POSTS_PER_PAGE } from '@/lib/defaults'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store'
import { POSTS_LIST_TYPE, QUERY_KEYS } from '@/lib/constants'

type Props = {
  type: POSTS_LIST_TYPE
  wrapperClassName?: string
}

const PostsInfiniteList: React.FC<Props> = (props) => {
  const { user } = useAuthStore()

  const fetchPostsQuery = useInfiniteQuery({
    queryKey: [
      props.type == POSTS_LIST_TYPE.DISCOVER
        ? QUERY_KEYS.DISCOVER_POSTS
        : QUERY_KEYS.PERSONAL_POSTS,
    ],
    initialPageParam: {
      pageIndex: 0,
      pageSize: POSTS_PER_PAGE,
    },
    queryFn: async ({ pageParam: params }) => {
      const response = await getPosts({
        ...params,
        type: props.type,
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
      {posts.length == 0 && fetchPostsQuery.isPending && <Spinner />}
      {posts.length == 0 && !fetchPostsQuery.isPending && (
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

export default PostsInfiniteList
