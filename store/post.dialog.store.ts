import { create } from 'zustand'
import { Post } from '@/lib/models'

interface PostsDialogState {
  isOpen: boolean
  isEditable: boolean
  show: (post: Post | null, isEditable: boolean) => void
  close: () => void
  loading: boolean
  setLoading: (loading: boolean) => void
  post: Post | null
  projectsDialogOpen: boolean
  setProjectsDialogOpen: (open: boolean) => void
}

export const usePostsDialogStore = create<PostsDialogState>()((set) => ({
  isOpen: false,
  isEditable: false,
  show: (post, isEditable) => set({ isOpen: true, post: post, isEditable }),
  close: () => set({ isOpen: false, post: null, isEditable: false }),
  loading: false,
  setLoading: (loading: boolean) => set({ loading: loading }),
  post: null,
  projectsDialogOpen: false,
  setProjectsDialogOpen: (open: boolean) => set({ projectsDialogOpen: open }),
}))
