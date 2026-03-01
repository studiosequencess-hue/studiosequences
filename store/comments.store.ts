import { create } from 'zustand'
import { Post } from '@/lib/models'

interface CommentsState {
  isOpen: boolean
  post?: Post
  setIsOpen: (isOpen: boolean, postId?: Post) => void
}

export const useCommentsStore = create<CommentsState>()((set) => ({
  isOpen: false,
  post: undefined,
  setIsOpen: (isOpen, post) => set({ isOpen, post }),
}))
