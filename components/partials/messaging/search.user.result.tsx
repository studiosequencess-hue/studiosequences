'use client'

import React, { useState } from 'react'
import { UserGeneralInfoSearchResult } from '@/lib/models'
import UserAvatar from '@/components/partials/user-avatar'
import {
  getOrCreateConversation,
  requestConversation,
} from '@/lib/actions.messaging'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/constants'
import { cn, getUserFullName, getUserInitials } from '@/lib/utils'
import { useConversationsStore } from '@/store'
import { Clock, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ButtonProps = React.ComponentProps<typeof Button>

type Props = {
  user: UserGeneralInfoSearchResult
  onClose: () => void
}

const SearchUserResult: React.FC<Props> = ({ user, onClose }) => {
  const { setConversation } = useConversationsStore()
  const [isRequestSent, setIsRequestSent] = useState<boolean>(
    user.has_pending_request,
  )

  const startChatMutation = useMutation({
    mutationKey: [QUERY_KEYS.CONVERSATIONS_START_CHAT],
    mutationFn: async () => {
      // If already has conversation, navigate
      if (user.has_conversation) {
        const response = await getOrCreateConversation(user.id)
        if (response.status === 'success') {
          setConversation(response.data)
          onClose()
        }
        return
      }

      if (user.role === 'company') {
        if (user.has_pending_request) return // Already pending

        // Send request first
        setIsRequestSent(true)
        const response = await requestConversation(user.id)
        if (response.status == 'success') {
          toast.success('Request sent to company')
        } else {
          setIsRequestSent(false)
        }
      } else {
        // Direct chat
        const response = await getOrCreateConversation(user.id)
        if (response.status === 'success') {
          setConversation(response.data)
          onClose()
        }
      }
    },
  })

  const getButtonState = (): {
    text: string
    icon: React.ReactNode
    disabled: ButtonProps['disabled']
    variant: ButtonProps['variant']
    className?: ButtonProps['className']
  } => {
    if (user.has_conversation) {
      return {
        text: 'Chat',
        icon: <MessageCircle size={14} />,
        disabled: true,
        variant: 'secondary',
      }
    }
    if (user.has_pending_request) {
      return {
        text: 'Pending',
        icon: <Clock size={14} />,
        disabled: true,
        variant: 'outline',
      }
    }
    if (user.role === 'company') {
      return {
        text: isRequestSent ? 'Sending...' : 'Request',
        icon: null,
        disabled: isRequestSent,
        variant: 'default',
        className: 'bg-blue-500 hover:bg-blue-600',
      }
    }
    return { text: 'Message', icon: null, disabled: false, variant: 'default' }
  }

  const btn = getButtonState()

  return (
    <button
      key={user.id}
      onClick={() => startChatMutation.mutate()}
      className="hover:bg-foreground/10 flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-left transition"
    >
      <UserAvatar
        src={user.avatar}
        fallback={getUserInitials(user.firstName, user.lastName, user.lastName)}
        rootClassName={'size-10'}
      />
      <div className="flex-1">
        <div className="truncate text-sm/none font-medium">
          {getUserFullName(user)}
        </div>
        <div className="text-muted-foreground truncate text-sm/none">
          @{user.username} {user.role === 'company' && '• Company'}
        </div>
      </div>

      <Button
        size="sm"
        variant={btn.variant}
        disabled={btn.disabled}
        onClick={() => startChatMutation.mutate()}
        className={cn(btn.className)}
      >
        {btn.icon && <span className="mr-1">{btn.icon}</span>}
        {btn.text}
      </Button>
    </button>
  )
}

export default SearchUserResult
