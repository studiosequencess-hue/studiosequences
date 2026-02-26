import React from 'react'
import { Post } from '@/lib/models'
import { Button } from '@/components/ui/button'
import { QUERY_KEYS } from '@/lib/constants'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toggleBookmarkPostById } from '@/lib/actions.posts'
import { FaBookmark, FaRegBookmark } from 'react-icons/fa6'
import { cn } from '@/lib/utils'

type Props = {
  post: Post
}

const PostCardBookmarkButton: React.FC<Props> = (props) => {
  const queryClient = useQueryClient()
  const [isBookmarked, setIsBookmarked] = React.useState(
    props.post.user_bookmarked,
  )

  const toggleBookmarkMutation = useMutation({
    mutationKey: [QUERY_KEYS.TOGGLE_BOOKMARK_POST, props.post.id],
    mutationFn: () => {
      return toggleBookmarkPostById({
        id: props.post.id,
        isBookmarked: !isBookmarked,
      })
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.TOGGLE_BOOKMARK_POST, props.post.id],
      })

      const previousPost = queryClient.getQueryData([
        QUERY_KEYS.POST,
        props.post.id,
      ])

      setIsBookmarked((prev) => !prev)

      return { previousPost }
    },
    onError: (err, newBookmark, context) => {
      queryClient.setQueryData(
        [QUERY_KEYS.POST, props.post.id],
        context?.previousPost,
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.BOOKMARK, props.post.id],
      })
    },
  })

  return (
    <button
      className={cn(
        'text-foreground/50 hover:text-foreground cursor-pointer transition-colors',
        isBookmarked && 'text-foreground',
      )}
      onClick={() => toggleBookmarkMutation.mutate()}
    >
      {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
    </button>
  )
}

export default PostCardBookmarkButton
