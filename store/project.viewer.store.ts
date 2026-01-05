import { create } from 'zustand'
import { Project, UserImage } from '@/lib/models'

interface ProjectViewerState {
  viewIsOpen: boolean
  viewProject: Project | null
  viewShow: (project: Project) => void
  viewClose: () => void
  viewLoading: boolean
  viewSetLoading: (loading: boolean) => void

  createIsOpen: boolean
  createShow: () => void
  createClose: () => void
  createLoading: boolean
  createSetLoading: (loading: boolean) => void
}

export const useProjectViewerStore = create<ProjectViewerState>()((set) => ({
  viewIsOpen: false,
  viewProject: null,
  viewShow: (project: Project) =>
    set({ viewProject: project, viewIsOpen: true }),
  viewClose: () => set({ viewProject: null, viewIsOpen: false }),
  viewLoading: false,
  viewSetLoading: (loading: boolean) => set({ viewLoading: loading }),

  createIsOpen: false,
  createShow: () => set({ createIsOpen: true }),
  createClose: () => set({ createIsOpen: false }),
  createLoading: false,
  createSetLoading: (loading: boolean) => set({ createLoading: loading }),
}))
