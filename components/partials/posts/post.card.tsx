'use client'

import React from 'react'
import Image from 'next/image'
import { Post } from '@/lib/models'
import { format } from 'date-fns'
import { MessageCircle, Share2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { useAuthStore } from '@/store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deletePostById, toggleLikePostById } from '@/lib/actions.posts'
import { POST_VISIBILITY, QUERY_KEYS } from '@/lib/constants'
import { FaHeart, FaRegHeart } from 'react-icons/fa6'
import ReactPlayer from 'react-player'
import { toast } from 'sonner'

type Props = {
  post: Post
  onDelete?: () => void
}

const PostCard: React.FC<Props> = (props) => {
  const { user, loading } = useAuthStore()
  const queryClient = useQueryClient()
  const [liked, setLiked] = React.useState(props.post.user_liked)
  const [likesCount, setLikesCount] = React.useState(props.post.likes_count)

  const deletePostMutation = useMutation({
    mutationKey: [QUERY_KEYS.DELETE_POST, props.post.id],
    mutationFn: () => {
      return deletePostById({
        id: props.post.id,
      })
    },
    onSuccess: () => props.onDelete && props.onDelete(),
  })

  const toggleLikeMutation = useMutation({
    mutationFn: () => {
      return toggleLikePostById({
        id: props.post.id,
        isLiked: !liked,
      })
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.TOGGLE_LIKE_POST, props.post.id],
      })

      const previousPost = queryClient.getQueryData([
        QUERY_KEYS.POST,
        props.post.id,
      ])

      setLiked((prevLiked) => !prevLiked)
      setLikesCount((prev) => (liked ? prev - 1 : prev + 1))

      return { previousPost }
    },
    onError: (err, newLike, context) => {
      queryClient.setQueryData(
        [QUERY_KEYS.POST, props.post.id],
        context?.previousPost,
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.POST, props.post.id],
      })
    },
  })

  const handleDelete = () => {
    deletePostMutation.mutate()
  }

  const handleShare = async () => {
    const shareData = {
      title: props.post.user.username + "'s post",
      text: `Check out this post: ${props.post.user.username}`,
      url: `${window.location.origin}/posts/${props.post.id}`,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(shareData.url)
        toast.success('Link copied to clipboard!')
      }
    } catch (err) {
      console.error('Error sharing:', err)
      toast.error('Failed to share post link!')
    }
  }

  return (
    <div
      key={props.post.id}
      className="w-full rounded-xl border border-slate-100 transition-all duration-300 hover:border-indigo-100"
    >
      <div className="flex items-start gap-3 p-4">
        <Avatar>
          <AvatarImage src={props.post.user?.avatar || ''} />
          <AvatarFallback className={'text-sm/none'}>P</AvatarFallback>
        </Avatar>

        <div className={'flex grow items-start justify-between gap-2'}>
          <div className="grow">
            <div className="flex flex-wrap items-center gap-1">
              <Link
                href={`/users/${props.post.user.id}`}
                className="max-w-64 truncate font-bold"
              >
                {[props.post.user.first_name, props.post.user.last_name]
                  .join(' ')
                  .trim() || 'Anonymous'}
              </Link>
              <span className="text-muted-foreground max-w-48 truncate text-sm/none">
                @{props.post.user.username}-{props.post.id}
              </span>
            </div>
            <span className="block text-xs/none">
              {format(props.post.created_at, 'MMMM dd, yyyy')}
            </span>
          </div>
          <div className={'flex items-center gap-2'}>
            {props.post.visibility == POST_VISIBILITY.PRIVATE && (
              <Badge variant={'accent'}>Private</Badge>
            )}
            {user?.id == props.post.user.id && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <BsThreeDotsVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side={'bottom'}
                  sideOffset={10}
                  align={'end'}
                >
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      disabled={loading || deletePostMutation.isPending}
                      onSelect={handleDelete}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      <div className={'px-4 pb-4 text-sm/none'}>{props.post.content}</div>

      <Carousel className="mx-auto w-full">
        <CarouselContent>
          {(props.post.files || []).map((file, fileIndex) => (
            <CarouselItem
              key={`post-file-${fileIndex}`}
              className="relative aspect-square h-72"
            >
              {file.type == 'image' && (
                <Image
                  src={file.url}
                  alt={`project-file-${fileIndex}`}
                  fill
                  className={`object-contain pr-6 pl-10`}
                />
              )}
              {file.type == 'video' && (
                <ReactPlayer
                  src={file.url}
                  controls
                  width={'100%'}
                  height={'100%'}
                />
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="flex items-center gap-4 border-t border-slate-50 p-4">
        <div
          className={
            'flex grow items-center justify-between gap-4 text-sm/none'
          }
        >
          <div
            className={
              'text-foreground hover:text-foreground/80 flex cursor-pointer items-center gap-1.5'
            }
            onClick={() => toggleLikeMutation.mutate()}
          >
            {liked ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
            <span>{likesCount}</span>
          </div>
          {/*<button className="hover:text-accent-blue flex items-center gap-1.5 text-sm transition-colors">*/}
          {/*  <MessageCircle className="h-4 w-4" />*/}
          {/*  <span>{props.post.comments_count}</span>*/}
          {/*</button>*/}
        </div>
        <div
          className={
            'text-foreground hover:text-foreground/80 flex cursor-pointer items-center gap-1.5'
          }
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4" />
        </div>
      </div>
    </div>
  )
}

export default PostCard
