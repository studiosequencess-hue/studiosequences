'use client'

import React from 'react'
import Image from 'next/image'
import { usePostsDialogStore } from '@/store'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Project } from '@/lib/models'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Switch } from '@/components/ui/switch'
import {
  getAllProjectsByUserId,
  getPersonalProjects,
} from '@/lib/actions.projects'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import Loading from '@/app/loading'
import { Spinner } from '@/components/ui/spinner'
import Loader from '@/components/partials/loader'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'
import { cn } from '@/lib/utils'
import ReactPlayer from 'react-player'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  selectedProjects: Project[]
  setSelectProjects: (projects: Project[]) => void
}

const PostProjectsLinkDialog: React.FC<Props> = ({
  open,
  setOpen,
  selectedProjects,
  setSelectProjects,
}) => {
  const [projects, setProjects] = React.useState<Project[]>([])
  const mutation = useMutation({
    mutationKey: ['personal-projects'],
    mutationFn: () => {
      console.log('get personal projects')
      return getPersonalProjects()
    },
    onSuccess: (response) => {
      if (response.status == 'success') {
        setProjects(response.data.projects)
      } else {
        setProjects([])
      }
    },
  })

  React.useEffect(() => {
    if (!open) return

    mutation.mutate()
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <span>Choose projects </span>
            {!mutation.isPending && (
              <span className={'text-muted-foreground text-sm/none'}>
                ({selectedProjects.length}/{projects.length})
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        {mutation.isPending ? (
          <Loader />
        ) : (
          <ScrollArea className={'h-64 w-full pr-3'}>
            <div className={'flex flex-col gap-2'}>
              {projects.map((project, projectIndex) => (
                <div
                  key={`personal-project-${projectIndex}`}
                  className={'flex flex-col gap-2'}
                >
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldLabel
                        htmlFor={`enable-project-${projectIndex}`}
                        className={'grow'}
                      >
                        {projectIndex + 1}. {project.title}
                      </FieldLabel>
                    </FieldContent>
                    <Switch
                      id={`enable-project-${projectIndex}`}
                      size={'sm'}
                      defaultChecked={
                        selectedProjects.filter((p) => p.id == project.id)
                          .length > 0
                      }
                      onCheckedChange={(selected) => {
                        let newProjects = []

                        if (selected) {
                          newProjects = [...selectedProjects, project]
                        } else {
                          newProjects = selectedProjects.filter(
                            (p) => p.id != project.id,
                          )
                        }

                        setSelectProjects(
                          Array.from(
                            new Map(
                              newProjects.map((item) => [item.id, item]),
                            ).values(),
                          ),
                        )
                      }}
                    />
                  </Field>

                  <ScrollArea className={'h-15 w-full pr-3'}>
                    <div className={'flex h-full w-full flex-wrap gap-0.5'}>
                      {project.files.map((file, fileIndex) => (
                        <div
                          key={`file-${fileIndex}`}
                          className={'relative aspect-square h-12'}
                        >
                          {file.type == 'image' ? (
                            <Image
                              src={file.url}
                              alt={`file-${fileIndex}`}
                              fill
                              className={'z-0 object-cover'}
                            />
                          ) : (
                            <ReactPlayer
                              src={file.url}
                              width={'100%'}
                              height={'100%'}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default PostProjectsLinkDialog
