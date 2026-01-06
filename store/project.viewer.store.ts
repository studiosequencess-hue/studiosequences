import { create } from 'zustand'
import { Project } from '@/lib/models'

interface ProjectViewerState {
  isOpen: boolean
  isEditable: boolean
  show: (project: Project | null, isEditable: boolean) => void
  close: () => void
  loading: boolean
  setLoading: (loading: boolean) => void
  project: Project | null
}

export const useProjectViewerStore = create<ProjectViewerState>()((set) => ({
  isOpen: false,
  isEditable: false,
  show: (project, isEditable) => set({ isOpen: true, project, isEditable }),
  close: () => set({ isOpen: false, project: null, isEditable: false }),
  loading: false,
  setLoading: (loading: boolean) => set({ loading: loading }),
  project: null,
}))
