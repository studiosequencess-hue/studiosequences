'use client'

import React from 'react'
import { createClient } from '@/lib/supabase.client'
import { Message } from '@/lib/models'
import { getMessageById } from '@/lib/actions.messaging'

export function useRealtimeMessages(
  conversationId: number,
  onNewMessage: (message: Message) => void,
) {
  const fetchFullMessage = React.useCallback(
    async (messageId: number) => {
      const res = await getMessageById(messageId)
      if (res.status === 'success' && res.data) {
        onNewMessage(res.data)
      }
    },
    [onNewMessage],
  )

  React.useEffect(() => {
    if (!conversationId) return

    const supabase = createClient()

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          await fetchFullMessage(payload.new.id)
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, onNewMessage])
}
