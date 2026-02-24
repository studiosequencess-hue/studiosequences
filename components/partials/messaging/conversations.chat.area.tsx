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

const ConversationsChatArea = () => {
  const { user, loading: userLoading } = useAuthStore()
  const { conversation } = useConversationsStore()

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
  })

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

  const messages: Message[] = loadMessagesMutation.data || []

  return (
    <div className="flex grow flex-col">
      {/* Chat Header */}
      <div className="border-foreground/25 flex items-center gap-3 border-b px-4 py-2">
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
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((msg) => {
          const isMe = msg.sender_id === user.id
          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  isMe ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
                }`}
              >
                {msg.content}
              </div>
            </div>
          )
        })}
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <input
          type="text"
          placeholder="Type a message..."
          className="w-full rounded-full border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              // Handle send
            }
          }}
        />
      </div>
    </div>
  )
}

export default ConversationsChatArea
