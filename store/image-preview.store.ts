import { create } from 'zustand'
import { UserImage } from '@/lib/models'

interface ImagePreviewState {
  open: boolean
  image: UserImage | null
  showPreview: (image: UserImage) => void
  closePreview: () => void
  discoverImages: UserImage[]
  setDiscoverImages: (images: UserImage[]) => void
  loadingDiscoverImages: boolean
  setLoadingDiscoverImages: (loading: boolean) => void
  latestImages: UserImage[]
  setLatestImages: (images: UserImage[]) => void
  loadingLatestImages: boolean
  setLoadingLatestImages: (loading: boolean) => void
}

export const useImagePreviewStore = create<ImagePreviewState>()((set) => ({
  open: false,
  image: null,
  showPreview: (image: UserImage | null) => set({ open: true, image }),
  closePreview: () => set({ open: false, image: null }),
  discoverImages: [],
  setDiscoverImages: (images: UserImage[]) => set({ discoverImages: images }),
  latestImages: [],
  setLatestImages: (images: UserImage[]) => set({ latestImages: images }),
  loadingDiscoverImages: false,
  setLoadingDiscoverImages: (loading: boolean) =>
    set({ loadingDiscoverImages: loading }),
  loadingLatestImages: false,
  setLoadingLatestImages: (loading: boolean) =>
    set({ loadingLatestImages: loading }),
}))
