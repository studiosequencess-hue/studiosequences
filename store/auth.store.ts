import { create } from 'zustand'
import { DBUser } from '@/lib/models'

interface AuthState {
  user: DBUser | null
  setUser: (user: DBUser | null) => void
  loading: boolean
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  loading: true,
  setLoading: (loading: boolean) => set({ loading }),
}))
