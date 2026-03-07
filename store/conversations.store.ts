import { Conversation } from '@/lib/models'
import { create } from 'zustand'

interface ConversationsState {
  newConversationDialogOpen: boolean
  setNewConversationDialogOpen: (open: boolean) => void
  conversation: Conversation | null
  setConversation: (conversation: Conversation | null) => void
}

export const useConversationsStore = create<ConversationsState>()((set) => ({
  newConversationDialogOpen: false,
  setNewConversationDialogOpen: (newConversationDialogOpen) => {
    set({ newConversationDialogOpen })
  },
  conversation: null,
  setConversation: (conversation) => set({ conversation }),
}))
