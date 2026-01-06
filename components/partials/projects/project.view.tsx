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
import { toast } from 'sonner'
import { ProjectFile } from '@/lib/models'
import { getProjectFilesById } from '@/lib/actions.projects'
import Loader from '@/components/partials/loader'

const ProjectView = () => {
  const { project, isOpen, isEditable, close } = useProjectViewerStore()
  const [files, setFiles] = React.useState<ProjectFile[]>([])
  const [filesLoading, setFilesLoading] = React.useState(true)

  const loadProjectFiles = React.useCallback(async () => {
    if (!project) return

    const projectFilesResponse = await getProjectFilesById({
      id: project.id,
    })

    if (projectFilesResponse.status == 'success') {
      setFiles(projectFilesResponse.data)
    } else {
      toast.error(projectFilesResponse.message)
    }
  }, [project])

  React.useEffect(() => {
    setFilesLoading(true)
    loadProjectFiles().finally(() => {
      setFilesLoading(false)
    })
  }, [project, loadProjectFiles])

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
        {filesLoading ? <Loader /> : <ProjectViewFilesCarousel files={files} />}
      </DialogContent>
    </Dialog>
  )
}

export default ProjectView
