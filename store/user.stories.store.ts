import { CompanyEvent } from '@/lib/models'
import { create } from 'zustand'

interface UserStoriesState {
  formOpen: boolean
  setFormOpen: (open: boolean, event?: CompanyEvent) => void
  selectedEvent: CompanyEvent | null
  previewOpen: boolean
  setPreviewOpen: (open: boolean, event?: CompanyEvent) => void
}

export const useUserStoriesStore = create<UserStoriesState>()((set) => ({
  formOpen: false,
  setFormOpen: (open, event) => {
    set({ formOpen: open, selectedEvent: event || null })
  },
  selectedEvent: null,
  previewOpen: false,
  setPreviewOpen: (previewOpen, event) => {
    set({ previewOpen, selectedEvent: event || null })
  },
}))
