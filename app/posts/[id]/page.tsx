import React from 'react'
import { getPostById } from '@/lib/actions.posts'
import EmptyPage from '@/components/empty.page'
import PostCard from '@/components/partials/posts/post.card'

type Props = {
  params: Promise<{ id: string }>
}

const PostPage: React.FC<Props> = async ({ params }) => {
  const { id } = await params

  const numericId = parseInt(id)
  if (isNaN(numericId))
    return (
      <EmptyPage.Error
        title={'No such post found'}
        description={'Cannot find such post. Please try again'}
      />
    )

  const postResponse = await getPostById({
    id: numericId,
  })

  if (postResponse.status == 'error') {
    return (
      <EmptyPage.Error
        title={'No such post found'}
        description={'Cannot find such post. Please try again'}
      />
    )
  }

  return (
    <div
      className={
        'flex h-[calc(100vh-300px)] w-full items-center justify-center py-12'
      }
    >
      <div className={'w-full max-w-[600px]'}>
        <PostCard post={postResponse.data} />
      </div>
    </div>
  )
}

export default PostPage
