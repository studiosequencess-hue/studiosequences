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

interface Activity {
  id: number
  user: User
  type: 'posted_artwork' | 'started_following' | 'liked_artwork' | 'commented'
  target: string
  timestamp: string
  content: string | null
  previewImg: string | null
  stats: {
    likes: number
    comments: number
    shares: number
  }
}

const ProfileActivities: React.FC = () => {
  return (
    <div className={'flex flex-col gap-3'}>
      <PostForm type={POSTS_LIST_TYPE.PERSONAL} />
      <PostsInfiniteList type={POSTS_LIST_TYPE.PERSONAL} />
    </div>
  )
}

export default ProfileActivities
