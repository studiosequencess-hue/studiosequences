import { create } from 'zustand'
import { User } from '@/lib/models'

interface AuthState {
  user: User | null
  setUser: (user: User | null) => void
  loading: boolean
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  setUser: (user: User | null) => set({ user }),
  loading: true,
  setLoading: (loading: boolean) => set({ loading }),
}))
