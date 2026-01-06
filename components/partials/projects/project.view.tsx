'use client'

import React from 'react'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useProjectViewerStore } from '@/store/project.viewer.store'
import { X } from 'lucide-react'
import ProjectViewFilesCarousel from '@/components/partials/projects/project.view.files.carousel'

const ProjectView = () => {
  const { project, isOpen, isEditable, close } = useProjectViewerStore()

  if (!project) return null

  return (
    <Dialog
      open={isOpen && !isEditable}
      onOpenChange={(state) => {
        if (!state) {
          close()
        }
      }}
    >
      <DialogContent className={'w-[500px] gap-0 p-0'}>
        <DialogHeader className={'p-3'}>
          <DialogTitle className={'w-96 truncate'}>{project.title}</DialogTitle>
          <DialogDescription className={'line-clamp-10 wrap-break-word'}>
            {project.description}
          </DialogDescription>
        </DialogHeader>
        <ProjectViewFilesCarousel files={project.files} />
      </DialogContent>
    </Dialog>
  )
}

export default ProjectView
