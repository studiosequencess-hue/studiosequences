'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2, MessageCircle, Send } from 'lucide-react'
import { getComments, addComment } from '@/lib/actions.comments'
import { Textarea } from '@/components/ui/textarea'
import { useAuthStore, useCommentsStore } from '@/store'
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  InfiniteData,
} from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/constants'
import { COMMENTS_PER_POST } from '@/lib/defaults'
import UserAvatar from '@/components/partials/user-avatar'
import { getUserInitials } from '@/lib/utils'
import { PostComment } from '@/lib/models'
import CommentItem from '@/components/partials/comments/comment.item'

const CommentsListDialog = () => {
  const { user } = useAuthStore()
  const { isOpen, post, setIsOpen } = useCommentsStore()
  const [newComment, setNewComment] = useState('')
  const queryClient = useQueryClient()
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const addNewCommentMutation = useMutation({
    mutationKey: [QUERY_KEYS.COMMENTS_INSERT],
    mutationFn: async () => {
      if (newComment.trim().length <= 0) return
      if (!post) return

      const response = await addComment(post.id, newComment.trim())
      if (response.status == 'success') {
        if (textAreaRef.current) {
          textAreaRef.current.value = ''
        }

        queryClient.setQueryData<InfiniteData<PostComment[]>>(
          [QUERY_KEYS.COMMENTS, post?.id],
          (data) => {
            if (!data) return { pages: [], pageParams: [] }

            const lastIdx = data.pages.length - 1
            return {
              ...data,
              pages: [
                ...data.pages.slice(0, lastIdx),
                [response.data, ...data.pages[lastIdx]],
              ],
            }
          },
        )

        setTimeout(() => {
          scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth',
          })
        }, 100)
      }
    },
  })

  const loadCommentsQuery = useInfiniteQuery({
    queryKey: [QUERY_KEYS.COMMENTS, post?.id],
    initialPageParam: {
      pageIndex: 0,
      pageSize: COMMENTS_PER_POST,
    },
    queryFn: async ({ pageParam: params }) => {
      if (!post) return []

      const response = await getComments({
        ...params,
        postId: post.id,
      })

      return response.status == 'success' ? response.data : []
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0
        ? {
            pageIndex: allPages.length,
            pageSize: COMMENTS_PER_POST,
          }
        : undefined
    },
  })

  // Load comments when sheet opens
  useEffect(() => {
    if (isOpen) {
      loadCommentsQuery.refetch()
    } else {
      queryClient.setQueryData<InfiniteData<PostComment[]>>(
        [QUERY_KEYS.COMMENTS, post?.id],
        () => {
          return {
            pages: [],
            pageParams: [],
          }
        },
      )
    }
  }, [isOpen])

  const handleDelete = (commentId: number) => {
    const newPagesArray =
      loadCommentsQuery.data?.pages.map((page) =>
        page.filter((val) => val.id !== commentId),
      ) ?? []

    queryClient.setQueryData<InfiniteData<PostComment[]>>(
      [QUERY_KEYS.COMMENTS, post?.id],
      (data) => {
        if (!data) return { pages: [], pageParams: [] }

        return {
          pages: newPagesArray,
          pageParams: data.pageParams,
        }
      },
    )
  }

  const comments = loadCommentsQuery.data?.pages.flat() || []

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="flex items-center gap-1.5 text-gray-600 transition hover:text-gray-900">
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm font-medium">{comments.length}</span>
        </button>
      </SheetTrigger>

      <SheetContent className="flex flex-col gap-0 p-0">
        {/* Header */}
        <SheetHeader className="border-foreground/25 border-b px-4 pb-4">
          <SheetTitle className="text-base font-semibold">
            Comments ({comments.length})
          </SheetTitle>
        </SheetHeader>

        {/* Comments List - Scrollable */}
        <ScrollArea ref={scrollRef} className="h-[calc(100vh-12rem)] px-4">
          <div className="space-y-4 py-4">
            {loadCommentsQuery.isFetching && comments.length === 0 ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : comments.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <MessageCircle className="mx-auto mb-3 h-12 w-12 opacity-20" />
                <p className="text-sm">No comments yet</p>
                <p className="mt-1 text-xs">Be the first to comment!</p>
              </div>
            ) : (
              <>
                {comments.map((comment, commentIndex) => (
                  <CommentItem
                    key={`comment-${commentIndex}`}
                    comment={comment}
                  />
                ))}

                {loadCommentsQuery.hasNextPage && (
                  <div className={'flex items-center justify-center'}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => loadCommentsQuery.fetchNextPage()}
                      className="w-fit"
                      disabled={loadCommentsQuery.isFetchingNextPage}
                    >
                      {loadCommentsQuery.isFetchingNextPage ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Load more comments'
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>

        {/* Bottom Input Area - Fixed */}
        <div className="border-foreground/25 border-t p-4">
          <div className="flex items-start gap-3">
            <UserAvatar
              src={user?.avatar}
              rootClassName={'size-8'}
              fallbackClassName={getUserInitials(
                user?.first_name || '',
                user?.last_name || '',
                user?.company_name || '',
              )}
            />

            <div className="relative flex-1">
              <Textarea
                ref={textAreaRef}
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="max-h-25 min-h-25 resize-none px-2 py-2 pr-12"
                rows={1}
              />

              <Button
                size="icon"
                className="hover:bg-accent-blue absolute right-2 bottom-2 flex size-8 cursor-pointer items-center justify-center rounded-full"
                onClick={() => addNewCommentMutation.mutate()}
                disabled={!newComment.trim() || addNewCommentMutation.isPending}
              >
                {addNewCommentMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default CommentsListDialog
