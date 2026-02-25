'use client'

import React from 'react'
import { getMessages } from '@/lib/actions.messaging'
import { useAuthStore, useConversationsStore } from '@/store'
import UserAvatar from '@/components/partials/user-avatar'
import { getUserFullName, getUserInitials } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/constants'
import { Message } from '@/lib/models'
import { Spinner } from '@/components/ui/spinner'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useRealtimeMessages } from '@/hooks/useRealtimeMessages'
import ConversationsMessageInput from '@/components/partials/messaging/conversations.message.input'
import FilePreview from '@/components/partials/messaging/file.preview'

const ConversationsChatArea = () => {
  const { user, loading: userLoading } = useAuthStore()
  const { conversation } = useConversationsStore()
  const [messages, setMessages] = React.useState<Message[]>([])
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  // Load messages when conversation changes
  const loadMessagesMutation = useMutation({
    mutationKey: [QUERY_KEYS.MESSAGES, conversation?.id],
    mutationFn: async () => {
      if (!conversation) return []

      const response = await getMessages(conversation.id)

      if (response.status === 'success') {
        return response.data || []
      }

      return []
    },
    onSuccess: (data) => {
      setMessages(data)
      scrollToBottom()
    },
  })

  const handleNewMessage = React.useCallback((newMessage: Message) => {
    // Check if message already exists (avoid duplicates)
    setMessages((prev) => {
      const exists = prev.some((m) => m.id === newMessage.id)
      if (exists) return prev
      return [...prev, newMessage]
    })
    scrollToBottom()
  }, [])

  useRealtimeMessages(conversation?.id || -1, handleNewMessage)

  React.useEffect(() => {
    loadMessagesMutation.mutate()
  }, [conversation])

  if (!conversation) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <p className="mb-2 text-lg">Select a conversation</p>
          <p className="text-sm">Choose from the left sidebar</p>
        </div>
      </div>
    )
  }

  if (loadMessagesMutation.isPending || userLoading) {
    return (
      <div className="flex grow items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Spinner className={'size-6'} />
          <p className="text-muted-foreground text-sm">Loading messages...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className={'flex grow flex-col items-center justify-center gap-2'}>
        <span className={'text-muted-foreground'}>No user</span>
        <Link href={'/login'}>
          <Button>Login</Button>
        </Link>
      </div>
    )
  }

  const otherUser = conversation?.participants?.find(
    (p) => p.user_id !== user.id,
  )?.user

  return (
    <div className="flex grow flex-col">
      {/* Chat Header */}
      <div className="border-foreground/25 flex h-12 items-center gap-3 border-b px-4">
        <UserAvatar
          src={otherUser?.avatar}
          fallback={getUserInitials(
            otherUser?.first_name || null,
            otherUser?.last_name || null,
            otherUser?.company_name || null,
          )}
          rootClassName={'size-8'}
          fallbackClassName={'text-xs/none'}
        />
        <div>
          <div className="text-sm font-semibold">
            {otherUser ? getUserFullName(otherUser) : 'Anonymous'}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-[calc(100vh-11rem)] space-y-4 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-gray-400">
            <p>No messages yet</p>
            <p className="text-sm">Send a message to start the conversation</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === user.id
            const showAvatar =
              !isMe &&
              (!messages[messages.indexOf(msg) - 1] ||
                messages[messages.indexOf(msg) - 1].sender_id !== msg.sender_id)

            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}
              >
                {/* Avatar for received messages */}
                {!isMe && showAvatar && (
                  <UserAvatar
                    src={msg.sender.avatar}
                    fallback={getUserInitials(
                      msg.sender.first_name,
                      msg.sender.last_name,
                      msg.sender.company_name,
                    )}
                  />
                )}
                {!isMe && !showAvatar && <div className="w-8 shrink-0" />}

                <div
                  className={`max-w-[70%] ${isMe ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-2xl px-4 py-2 shadow-sm`}
                >
                  {/* Sender name in groups (optional) */}
                  {!isMe && conversation?.is_group && (
                    <div className="mb-1 text-xs font-medium opacity-70">
                      {msg.sender?.first_name || msg.sender?.username}
                    </div>
                  )}

                  {/* Text content */}
                  {msg.content && (
                    <div className="text-sm wrap-break-word whitespace-pre-wrap">
                      {msg.content}
                    </div>
                  )}

                  {/* Attachments */}
                  {msg.attachments?.length > 0 && (
                    <div className={`${msg.content ? 'mt-2' : ''} space-y-2`}>
                      {msg.attachments.map((att) => (
                        <FilePreview
                          key={att.url}
                          url={att.url}
                          name={att.name}
                          type={att.type}
                        />
                      ))}
                    </div>
                  )}

                  {/* Time */}
                  <div
                    className={`mt-1 text-right text-xs ${isMe ? 'text-blue-100' : 'text-gray-400'}`}
                  >
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ConversationsMessageInput onSent={handleNewMessage} />
    </div>
  )
}

export default ConversationsChatArea
