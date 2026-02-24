'use client'

import React, { useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Paperclip, Send, X } from 'lucide-react'
import { uploadMessageFile, sendMessage } from '@/lib/actions.messaging'
import FilePreview from '@/components/partials/messaging/file.preview'
import { MAX_FILE_SIZE, MAX_FILE_SIZE_MB } from '@/lib/constants'

type Props = {
  conversationId: number
  onSent: () => void
}

const MessageInput: React.FC<Props> = (props) => {
  const [message, setMessage] = useState('')
  const [attachments, setAttachments] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [sending, setSending] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Check file sizes before uploading
    const oversizedFiles = files.filter((f) => f.size > MAX_FILE_SIZE)
    if (oversizedFiles.length > 0) {
      setError(
        `Some files exceed ${MAX_FILE_SIZE_MB}MB limit: ${oversizedFiles.map((f) => f.name).join(', ')}`,
      )
      return
    }

    setError(null)
    setUploading(true)

    for (const file of files) {
      const res = await uploadMessageFile(file)
      if (res.status === 'success' && res.data) {
        setAttachments((prev) => [...prev, res.data])
      } else {
        setError(res.message || 'Upload failed')
      }
    }

    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSend = async () => {
    if (!message.trim() && attachments.length === 0) return

    setSending(true)
    const res = await sendMessage(props.conversationId, message, attachments)

    if (res.status === 'success') {
      setMessage('')
      setAttachments([])
      props.onSent()
    }
    setSending(false)
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="bg-background border-t p-4">
      {error && (
        <div className="mb-3 flex items-center justify-between rounded-lg bg-red-50 p-2 text-sm text-red-600">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Attachment Previews */}
      {attachments.length > 0 && (
        <div className="mb-3 flex gap-2 overflow-x-auto pb-2">
          {attachments.map((att, idx) => (
            <FilePreview
              key={idx}
              url={att.url}
              name={att.name}
              type={att.type}
              onRemove={() => removeAttachment(idx)}
              compact
            />
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          multiple
          accept="image/*,video/*,application/pdf,application/*"
        />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Paperclip size={20} />
        </Button>

        <Input
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          className="flex-1"
          disabled={sending}
        />

        <Button
          onClick={handleSend}
          disabled={sending || (!message.trim() && attachments.length === 0)}
          size="icon"
        >
          <Send size={20} />
        </Button>
      </div>

      {/* File size hint */}
      <div className="text-muted-foreground mt-2 text-center text-xs">
        Max file size: {MAX_FILE_SIZE_MB}MB
      </div>

      {uploading && (
        <div className="text-muted-foreground mt-2 text-xs">Uploading...</div>
      )}
    </div>
  )
}

export default MessageInput
