import React from 'react'
import { getUser } from '@/lib/actions.auth'
import EmptyPage from '@/components/empty.page'
import PostForm from '@/components/partials/posts/post.form'
import { POSTS_LIST_TYPE } from '@/lib/constants'
import PostsInfiniteList from '@/components/partials/posts/posts.infinite.list'

const PostsPage = async () => {
  const userResponse = await getUser()

  if (userResponse.status == 'error') {
    return (
      <EmptyPage.Error
        title={'You are not logged in'}
        description={'Please login to continue'}
      />
    )
  }

  return (
    <div className={'flex flex-col gap-3 pt-6'}>
      <PostForm type={POSTS_LIST_TYPE.DISCOVER} />
      <PostsInfiniteList type={POSTS_LIST_TYPE.DISCOVER} />
    </div>
  )
}

export default PostsPage
