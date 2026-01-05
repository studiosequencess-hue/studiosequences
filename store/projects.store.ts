import { create } from 'zustand'
import { Project } from '@/lib/models'

interface ProjectsState {
  fetchAllTriggerValue: number
  fetchAllTrigger: () => void
  fetching: boolean
  setFetching: (fetching: boolean) => void
  projects: Project[]
  setProjects: (projects: Project[]) => void
  addProject: (project: Project) => void
}

export const useProjectsStore = create<ProjectsState>()((set) => ({
  fetchAllTriggerValue: 0,
  fetchAllTrigger: () =>
    set((state) => ({
      fetchAllTriggerValue: state.fetchAllTriggerValue + 1,
    })),
  fetching: true,
  setFetching: (state: boolean) => set({ fetching: state }),
  projects: [],
  setProjects: (projects: Project[]) => set({ projects: projects }),
  addProject: (project: Project) =>
    set((state) => ({ ...state, projects: [...state.projects, project] })),
}))
