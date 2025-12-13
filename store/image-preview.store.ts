import { create } from 'zustand'
import { UserImage } from '@/lib/models'

interface ImagePreviewState {
  open: boolean
  image: UserImage | null
  showPreview: (image: UserImage) => void
  closePreview: () => void
}

export const useImagePreviewStore = create<ImagePreviewState>()((set) => ({
  open: false,
  image: null,
  showPreview: (image: UserImage | null) => set({ open: true, image }),
  closePreview: () => set({ open: false, image: null }),
}))
