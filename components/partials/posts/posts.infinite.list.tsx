'use client'

import React from 'react'
import PostCard from '@/components/partials/posts/post.card'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getPosts } from '@/lib/actions.posts'
import { POSTS_PER_PAGE } from '@/lib/defaults'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'

type Props = {
  type: 'discover' | 'profile'
}

const PostsInfiniteList: React.FC<Props> = ({ type }) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [`${type}-posts`],
      initialPageParam: {
        pageIndex: 0,
        pageSize: POSTS_PER_PAGE,
      },
      queryFn: async ({ pageParam: params }) => {
        const response = await getPosts(params)

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
    <div className={'flex flex-col items-center gap-2 py-4'}>
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
