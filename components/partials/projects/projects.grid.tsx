'use client'

import React from 'react'
import Image from 'next/image'
import { Project } from '@/lib/models'
import { useProjectsStore } from '@/store'
import { Layers, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { cn } from '@/lib/utils'

type Props = {
  projects: Project[]
  editable: boolean
}

const ProjectsGrid: React.FC<Props> = (props) => {
  const { createShow, viewShow } = useProjectsStore()
  const [projects, setProjects] = React.useState<Project[]>(props.projects)

  const toggleReveal = (id: number): void => {
    setProjects(
      projects.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            is_revealed: !p.is_revealed,
          }
        }

        return p
      }),
    )
  }

  return (
    <div
      className={cn(
        'flex h-auto w-full grow flex-wrap',
        projects.length == 0 && 'items-center justify-center',
      )}
    >
      {projects.length == 0 && (
        <Empty className="max-h-52 max-w-96 border border-dashed">
          <EmptyHeader>
            <EmptyTitle>No Projects</EmptyTitle>
            {props.editable && (
              <EmptyDescription>
                Create new project to add to portfolio
              </EmptyDescription>
            )}
          </EmptyHeader>
          {props.editable && (
            <EmptyContent>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => createShow()}
              >
                Create
              </Button>
            </EmptyContent>
          )}
        </Empty>
      )}
      {projects.map((project) => {
        const isCensored = project.is_sensitive && !project.is_revealed

        return (
          <div
            key={project.id}
            onClick={() => viewShow(project)}
            className={`group relative aspect-square w-64 overflow-hidden border-[0.5px] border-white/5 bg-zinc-950 ${!isCensored ? 'cursor-pointer' : ''}`}
          >
            <Image
              src={project.images[0].url || ''}
              alt={project.title || 'project-image'}
              className={`h-full w-full object-cover transition-all duration-1000 ${
                isCensored
                  ? 'scale-150 opacity-30 blur-3xl grayscale'
                  : 'group-hover:scale-110'
              }`}
            />

            {!isCensored && (
              <div className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded-sm border border-white/10 bg-black/40 px-1.5 py-0.5 opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">
                <Layers className="h-2.5 w-2.5 text-white/70" />
                <span className="text-[9px] font-black text-white/90 uppercase">
                  {project.images.length}
                </span>
              </div>
            )}

            {isCensored && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 transition-colors duration-300 group-hover:bg-black/40">
                <div className="flex flex-col items-center gap-3 p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                    <Lock className="h-3.5 w-3.5 text-white/40" />
                  </div>
                  <button
                    onClick={() => toggleReveal(project.id)}
                    className="rounded-full bg-white px-4 py-1.5 text-[9px] font-black tracking-widest text-black uppercase shadow-lg shadow-black/20 transition-all hover:bg-zinc-200 active:scale-95"
                  >
                    Reveal
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ProjectsGrid
