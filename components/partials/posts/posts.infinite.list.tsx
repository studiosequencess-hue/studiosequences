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

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
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

  const posts = data?.pages.flat() || []

  return (
    <div className={'flex flex-col items-center gap-2 pt-4 pb-8'}>
      {posts.length == 0 && status == 'pending' && <Spinner />}
      {posts.length == 0 && status != 'pending' && (
        <div className={'text-muted-foreground text-sm/none'}>No posts yet</div>
      )}
      {posts.map((post, postIndex) => {
        return <PostCard key={`post-${postIndex}`} post={post} />
      })}

      {hasNextPage && (
        <Button
          size={'sm'}
          variant={'secondary'}
          onClick={() => fetchNextPage()}
          className={'mt-8'}
        >
          {isFetchingNextPage ? <Spinner /> : 'Load More'}
        </Button>
      )}
    </div>
  )
}

export default PostsInfiniteList
