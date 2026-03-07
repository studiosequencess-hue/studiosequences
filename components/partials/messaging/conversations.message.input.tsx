'use client'

import React, { useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send, Loader2 } from 'lucide-react'
import { uploadMessageFile, sendMessage } from '@/lib/actions.messaging'
import { MAX_FILE_SIZE } from '@/lib/constants'
import { useConversationsStore } from '@/store'
import { Message, MessageAttachment } from '@/lib/models'

type Props = {
  onSent: (message: Message) => void
}

const ConversationsMessageInput: React.FC<Props> = ({ onSent }) => {
  const { conversation } = useConversationsStore()
  const [message, setMessage] = useState('')
  const [attachments, setAttachments] = useState<MessageAttachment[]>([])
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([]) // Track which files are uploading
  const [isSending, setIsSending] = useState(false)
  const [_, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Check sizes
    const oversized = files.filter((f) => f.size > MAX_FILE_SIZE)
    if (oversized.length > 0) {
      setError(
        `Files must be under 5MB: ${oversized.map((f) => f.name).join(', ')}`,
      )
      return
    }

    setError(null)

    // Upload files one by one with progress tracking
    for (const file of files) {
      setUploadingFiles((prev) => [...prev, file.name])

      try {
        const res = await uploadMessageFile(file)
        if (res.status === 'success' && res.data) {
          setAttachments((prev) => [...prev, res.data])
        } else {
          setError(res.message || `Failed to upload ${file.name}`)
        }
      } catch (e) {
        setError(`Error uploading ${file.name}`)
      } finally {
        setUploadingFiles((prev) => prev.filter((name) => name !== file.name))
      }
    }

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSend = async () => {
    if (!conversation) return
    if (!message.trim() && attachments.length === 0) return

    setIsSending(true)
    setError(null)

    try {
      const res = await sendMessage(conversation.id, message, attachments)

      if (res.status === 'success') {
        setMessage('')
        setAttachments([])
        onSent(res.data)
      } else {
        setError(res.message || 'Failed to send message')
      }
    } catch (e) {
      setError('Failed to send message')
    } finally {
      setIsSending(false)
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const isBusy = uploadingFiles.length > 0 || isSending

  return (
    <div className="border-foreground/25 flex h-16 grow items-center border-t px-4">
      {/* Attachment Previews */}
      {/*{attachments.length > 0 && (*/}
      {/*  <div className="mb-3 flex gap-2 overflow-x-auto pb-2">*/}
      {/*    {attachments.map((att, idx) => (*/}
      {/*      <FilePreview*/}
      {/*        key={idx}*/}
      {/*        url={att.url}*/}
      {/*        name={att.name}*/}
      {/*        type={att.type}*/}
      {/*        onRemove={() => removeAttachment(idx)}*/}
      {/*      />*/}
      {/*    ))}*/}
      {/*  </div>*/}
      {/*)}*/}

      <div className="flex grow items-center gap-2">
        {/*<input*/}
        {/*  type="file"*/}
        {/*  ref={fileInputRef}*/}
        {/*  onChange={handleFileSelect}*/}
        {/*  className="hidden"*/}
        {/*  multiple*/}
        {/*  accept="image/*,video/*,application/pdf,application/*"*/}
        {/*  disabled={isBusy}*/}
        {/*/>*/}

        {/*<Button*/}
        {/*  variant="ghost"*/}
        {/*  size="icon"*/}
        {/*  onClick={() => fileInputRef.current?.click()}*/}
        {/*  disabled={isBusy}*/}
        {/*  className="flex-shrink-0"*/}
        {/*>*/}
        {/*  <Paperclip size={20} />*/}
        {/*</Button>*/}

        <Input
          placeholder={
            isBusy
              ? uploadingFiles.length > 0
                ? 'Uploading files...'
                : 'Sending...'
              : 'Type a message...'
          }
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !isBusy) {
              e.preventDefault()
              handleSend()
            }
          }}
          className="flex-1"
          disabled={isBusy}
        />

        <Button
          onClick={handleSend}
          disabled={isBusy || (!message.trim() && attachments.length === 0)}
          size="icon"
          className="flex-shrink-0"
        >
          {isSending ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Send size={20} />
          )}
        </Button>
      </div>
    </div>
  )
}

export default ConversationsMessageInput
