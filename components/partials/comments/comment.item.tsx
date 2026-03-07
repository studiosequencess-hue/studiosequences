'use client'

import React from 'react'
import { deleteComment, updateComment } from '@/lib/actions.comments'
import { Button } from '@/components/ui/button'
import { Edit2, Check, X, Loader2 } from 'lucide-react'
import { PostComment } from '@/lib/models'
import { useAuthStore, useCommentsStore } from '@/store'
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/constants'
import { getUserFullName, getUserInitials } from '@/lib/utils'
import UserAvatar from '@/components/partials/user-avatar'
import { Textarea } from '@/components/ui/textarea'

type Props = {
  comment: PostComment
}

const CommentItem: React.FC<Props> = ({ comment }) => {
  const { user } = useAuthStore()
  const { post } = useCommentsStore()
  const [isEditing, setIsEditing] = React.useState(false)
  const [editContent, setEditContent] = React.useState(comment.content || '')

  const queryClient = useQueryClient()
  const isOwner = comment.user.id === user?.id

  const deleteMutation = useMutation({
    mutationKey: [QUERY_KEYS.COMMENTS_DELETE, comment.id, comment.userId],
    mutationFn: async () => {
      if (!post) return

      const response = await deleteComment(comment.id, post.id)

      return response.status == 'success'
    },
  })

  const updateMutation = useMutation({
    mutationKey: [QUERY_KEYS.COMMENTS_UPDATE, comment.id, comment.userId],
    mutationFn: async () => {
      if (!post) return

      const response = await updateComment(comment.id, editContent)

      if (response.status == 'success') {
        queryClient.setQueryData<InfiniteData<PostComment[]>>(
          [QUERY_KEYS.COMMENTS, post?.id],
          (data) => {
            if (!data) return { pages: [], pageParams: [] }

            return {
              ...data,
              pages: data.pages.map((page) =>
                page.map((val) =>
                  val.id.toString() === response.data.id.toString()
                    ? { ...val, ...response.data }
                    : val,
                ),
              ),
            }
          },
        )
      }

      if (response.status == 'success') {
        setIsEditing(false)
      }

      return response.status == 'success'
    },
  })

  React.useEffect(() => {
    if (!isEditing) {
      setEditContent(comment.content || '')
    }
  }, [isEditing])

  const isEdited =
    comment.updatedAt &&
    new Date(comment.updatedAt) > new Date(comment.createdAt)

  if (isEditing) {
    return (
      <div className="flex gap-3 rounded-lg">
        <div className="flex-1">
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full resize-none rounded border p-2 text-sm/none"
            rows={1}
          />
          <div className="mt-2 flex justify-end gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(false)}
            >
              <X size={14} />
            </Button>
            <Button
              size="sm"
              disabled={updateMutation.isPending}
              onClick={() => {
                updateMutation.mutate()
              }}
            >
              <Check size={14} />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group flex w-full grow flex-col gap-3 rounded-lg">
      {/* Avatar */}
      <div className={'flex min-h-12 w-full grow gap-3'}>
        <UserAvatar
          src={comment.user.avatar}
          rootClassName={'size-8 group-hover:hidden'}
          fallbackClassName={getUserInitials(
            comment.user.firstName || '',
            comment.user.lastName || '',
            comment.user.lastName || '',
          )}
        />

        {/* Actions */}
        {isOwner && (
          <div className="hidden flex-col gap-1 opacity-0 transition-opacity group-hover:flex group-hover:opacity-100">
            <Button
              size="icon-sm"
              variant="ghost"
              className="size-8"
              onClick={() => setIsEditing(true)}
            >
              {updateMutation.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Edit2 size={14} />
              )}
            </Button>
            {/*<Button*/}
            {/*  size="icon-sm"*/}
            {/*  variant="ghost"*/}
            {/*  className="size-8 text-red-500 hover:text-red-600"*/}
            {/*  onClick={() => deleteMutation.mutate()}*/}
            {/*  disabled={deleteMutation.isPending}*/}
            {/*>*/}
            {/*  {deleteMutation.isPending ? (*/}
            {/*    <Loader2 size={14} className="animate-spin" />*/}
            {/*  ) : (*/}
            {/*    <Trash2 size={14} />*/}
            {/*  )}*/}
            {/*</Button>*/}
          </div>
        )}

        {/* Content */}
        <div className="flex w-full flex-col">
          <div className="flex w-full items-center justify-between gap-2">
            <span className="grow truncate text-sm/none font-semibold">
              {getUserFullName(comment.user)}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
            {isEdited && (
              <span className="text-xs text-gray-400">(edited)</span>
            )}
          </div>

          <p className="text-muted-foreground mt-1 text-sm/none whitespace-pre-wrap">
            {comment.content}
          </p>
        </div>
      </div>
    </div>
  )
}

export default CommentItem
