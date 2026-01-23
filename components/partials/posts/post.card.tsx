import { Post } from '@/lib/models'
import React from 'react'
import Placeholder from '@/public/images/placeholder.svg'
import { format } from 'date-fns'
import { Heart, MessageCircle, Share2 } from 'lucide-react'

type Props = {
  post: Post
}

const PostCard: React.FC<Props> = ({ post }) => {
  return (
    <div
      key={post.id}
      className="rounded-xl border border-slate-100 transition-all duration-300 hover:border-indigo-100"
    >
      {/* Activity Header */}
      <div className="flex items-start gap-3 p-4">
        <img
          src={post.user.avatar || Placeholder}
          alt={post.user.email}
          className="h-10 w-10 rounded-full border border-slate-200"
        />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-1">
            <span className="cursor-pointer font-bold">
              {[post.user.first_name, post.user.last_name].join(' ').trim() ||
                'Anonymous'}
            </span>
            <span className="text-muted-foreground text-sm/none">
              @{post.user.username}
            </span>
          </div>
          <span className="block text-xs">
            {format(post.created_at, 'MM dd')}
          </span>
        </div>
      </div>

      <div className={'h-24 w-full bg-red-100'}></div>

      {/* Activity Footer */}
      <div className="flex items-center gap-4 border-t border-slate-50 p-3">
        <button className="flex items-center gap-1.5 text-sm transition-colors hover:text-rose-500">
          <Heart className="h-4 w-4" />
          <span>{post.likes_count}</span>
        </button>
        <button className="hover:text-accent-blue flex items-center gap-1.5 text-sm transition-colors">
          <MessageCircle className="h-4 w-4" />
          <span>{post.comments_count}</span>
        </button>
        <button className="ml-auto flex items-center gap-1.5 text-sm transition-colors hover:text-emerald-500">
          <Share2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default PostCard
