import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Post } from '@/lib/models'
import PostForm from '@/components/partials/posts/post.form'
import { POSTS_LIST_TYPE } from '@/lib/constants'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  post: Post
}

const PostEditDialog: React.FC<Props> = (props) => {
  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogContent className={'w-fit sm:max-w-fit'}>
        <DialogHeader className={'hidden'}>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className={'w-[600px]'}>
          <PostForm
            post={props.post}
            type={POSTS_LIST_TYPE.PERSONAL}
            onSuccess={() => {
              props.setOpen(false)
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PostEditDialog
