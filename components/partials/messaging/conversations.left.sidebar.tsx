'use client'

import React from 'react'
import Loader from '@/components/partials/loader'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useAuthStore, useConversationsStore } from '@/store'
import Link from 'next/link'
import UserAvatar from '@/components/partials/user-avatar'
import { getUserFullName, getUserInitials } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/constants'
import { getUserConversations } from '@/lib/actions.messaging'

const ConversationLeftSidebar = () => {
  const { user, loading: userLoading } = useAuthStore()
  const { conversation, setConversation, setNewConversationDialogOpen } =
    useConversationsStore()

  const loadConversationsMutation = useMutation({
    mutationKey: [QUERY_KEYS.CONVERSATIONS],
    mutationFn: async () => {
      const response = await getUserConversations()
      return response.status == 'success' ? response.data : []
    },
  })

  React.useEffect(() => {
    loadConversationsMutation.mutate()
  }, [])

  if (loadConversationsMutation.isPending || userLoading) {
    return <Loader wrapperClassName={'h-full w-full'} />
  }

  if (!user) {
    return (
      <div
        className={
          'flex h-full w-full flex-col items-center justify-center gap-2'
        }
      >
        <span>No user</span>
        <Link href={'/login'}>
          <Button>Login</Button>
        </Link>
      </div>
    )
  }

  const conversations = loadConversationsMutation.data || []

  return (
    <div className="flex h-full w-full grow flex-col">
      <div className="border-foreground/25 flex items-center justify-between gap-2 border-b p-2">
        <h1 className="text-sm/none font-bold">Messages</h1>
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={() => {
            setNewConversationDialogOpen(true)
          }}
        >
          <Plus size={18} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="text-muted-foreground p-8 text-center text-sm">
            No conversations yet
          </div>
        ) : (
          conversations.map((conv) => {
            const other = conv.participants?.find(
              (p) => p.userId !== user.id,
            )?.user
            const isSelected = conversation?.id === conv.id

            return (
              <button
                key={conv.id}
                onClick={() => setConversation(conv)}
                className={`border-foreground/25 flex w-full items-center gap-3 border-b p-2 text-left transition ${
                  isSelected ? 'bg-foreground/10' : 'bg-foreground/0'
                }`}
              >
                <UserAvatar
                  src={other?.avatar}
                  fallback={getUserInitials(
                    other?.firstName || null,
                    other?.lastName || null,
                    other?.lastName || null,
                  )}
                  rootClassName={'size-8'}
                  fallbackClassName={'text-xs/none'}
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">
                    {other ? getUserFullName(other) : 'Anonymous'}
                  </div>
                  <div className="truncate text-xs/none text-gray-500">
                    {conv.last_message?.content || 'New conversation'}
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}

export default function WithWrapper() {
  return (
    <div className={'border-foreground/25 max-w-64 min-w-64 grow border-r'}>
      <ConversationLeftSidebar />
    </div>
  )
}
