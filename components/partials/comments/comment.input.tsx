'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Send } from 'lucide-react'
import { addComment } from '@/lib/actions.comments'

type Props = {
  postId: number
  onCommentAdded: () => void
}

const CommentInput: React.FC<Props> = ({ postId, onCommentAdded }) => {
  const [content, setContent] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async () => {
    if (!content.trim()) return

    setIsSubmitting(true)
    const res = await addComment(postId, content.trim())

    if (res.status === 'success') {
      setContent('')
      onCommentAdded()
    }
    setIsSubmitting(false)
  }

  return (
    <div className="flex items-start gap-2">
      <Textarea
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[60px] flex-1 resize-none"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
          }
        }}
      />
      <Button
        size="icon"
        onClick={handleSubmit}
        disabled={isSubmitting || !content.trim()}
        className="mt-1"
      >
        {isSubmitting ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Send size={18} />
        )}
      </Button>
    </div>
  )
}

export default CommentInput
