import { create } from 'zustand'

interface CompanyEventsState {
  formOpen: boolean
  setFormOpen: (open: boolean) => void
}

export const useCompanyEventsStore = create<CompanyEventsState>()((set) => ({
  formOpen: false,
  setFormOpen: (open: boolean) => {
    set({ formOpen: open })
  },
}))
