import React from 'react'
import PostsInfiniteList from '@/components/partials/posts/posts.infinite.list'
import { POSTS_LIST_TYPE } from '@/lib/constants'
import PostForm from '@/components/partials/posts/post.form'

const TabPosts = () => {
  return (
    <div className={'flex flex-col gap-3'}>
      <PostForm type={POSTS_LIST_TYPE.DISCOVER} />
      <PostsInfiniteList type={POSTS_LIST_TYPE.DISCOVER} />
    </div>
  )
}

export default TabPosts
