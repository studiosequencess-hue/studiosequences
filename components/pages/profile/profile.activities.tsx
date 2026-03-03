'use client'

import React from 'react'
import PostsInfiniteList from '@/components/partials/posts/posts.infinite.list'
import PostForm from '@/components/partials/posts/post.form'
import { POSTS_LIST_TYPE } from '@/lib/constants'

interface User {
  name: string
  handle: string
  avatar: string
}

type Props = { editable: boolean }

const ProfileActivities: React.FC<Props> = (props) => {
  return (
    <div className={'flex flex-col gap-3'}>
      {props.editable && <PostForm type={POSTS_LIST_TYPE.PERSONAL} />}
      <PostsInfiniteList type={POSTS_LIST_TYPE.PERSONAL} />
    </div>
  )
}

export default ProfileActivities
