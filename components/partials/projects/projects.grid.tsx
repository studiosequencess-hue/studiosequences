'use client'

import React from 'react'
import Image from 'next/image'
import { useProjectsStore, useProjectViewerStore } from '@/store'
import { Layers, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { cn, getProjectPreview } from '@/lib/utils'
import { FaPlus } from 'react-icons/fa6'
import ProjectsGridPreviewBackground from '@/components/partials/projects/projects.grid.preview.background'

type Props = {
  editable: boolean
}

const ProjectsGrid: React.FC<Props> = (props) => {
  const { show } = useProjectViewerStore()
  const { projects, setProjects } = useProjectsStore()

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
                onClick={() => show(null, true)}
              >
                Create
              </Button>
            </EmptyContent>
          )}
        </Empty>
      )}
      {projects.length != 0 && props.editable && (
        <div
          className="group flex size-52 cursor-pointer flex-col items-center justify-center gap-2 border border-dashed"
          onClick={() => show(null, true)}
        >
          <FaPlus className={'text-xl/none'} />
          <span>Add</span>
        </div>
      )}
      {projects.map((project) => {
        const isCensored = project.is_sensitive && !project.is_revealed

        return (
          <div
            key={project.id}
            onClick={() => !isCensored && show(project, true)}
            className={cn(
              `group relative size-52 overflow-hidden border-[0.5px] border-white/5 bg-zinc-950`,
              !isCensored && 'cursor-pointer',
            )}
          >
            <ProjectsGridPreviewBackground project={project} />

            {!isCensored && (
              <div className="absolute inset-0 z-10 flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <div
                  className={
                    'absolute top-2 right-2 flex h-fit w-fit items-center gap-1 rounded-sm border border-white/10 bg-black/40 px-1.5 py-0.5 backdrop-blur-md'
                  }
                >
                  <Layers className="h-2.5 w-2.5 text-white/70" />
                  <span className="text-[9px] font-black text-white/90 uppercase">
                    {project.files.length}
                  </span>
                </div>

                {project.title && (
                  <div
                    className={cn(
                      'absolute bottom-2 left-1/2 max-w-[calc(100%-1rem)] -translate-x-1/2',
                      'rounded-sm border border-white/10 bg-black/40 px-1.5 py-0.5 backdrop-blur-md',
                      'truncate text-xs/none break-all',
                    )}
                  >
                    {project.title}
                  </div>
                )}
              </div>
            )}

            {isCensored && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 transition-colors duration-300 group-hover:bg-black/40">
                <div className="flex flex-col items-center gap-3 p-4">
                  <div className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                    <Lock className="size-5 text-white/40" />
                  </div>
                  <Button
                    size={'sm'}
                    variant={'secondary'}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      toggleReveal(project.id)
                    }}
                    // className="rounded-full bg-white px-4 py-1.5 text-[9px] font-black tracking-widest text-black uppercase shadow-lg shadow-black/20 transition-all hover:bg-zinc-200 active:scale-95"
                  >
                    Reveal
                  </Button>
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
