'use client'

import React from 'react'
import Image from 'next/image'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import { Collection, Project } from '@/lib/models'
import * as z from 'zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/constants'
import {
  addProjectsToCollection,
  createCollection,
} from '@/lib/actions.collections'
import { toast } from 'sonner'
import Loader from '@/components/partials/loader'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { getPersonalProjects } from '@/lib/actions.projects'
import { Switch } from '@/components/ui/switch'
import ReactPlayer from 'react-player'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  collection: Collection
  onSuccess?: () => void
}

const CollectionProjectsFormDialog: React.FC<Props> = (props) => {
  const [selectedProjects, setSelectProjects] = React.useState<Project[]>(
    props.collection.projects,
  )

  const projectsQuery = useQuery({
    queryKey: [QUERY_KEYS.PERSONAL_PROJECTS],
    queryFn: async () => {
      const response = await getPersonalProjects()

      if (response.status == 'success') {
        return response.data.projects
      } else {
        return []
      }
    },
  })

  const addProjectsToCollectionMutation = useMutation({
    mutationKey: [QUERY_KEYS.PERSONAL_COLLECTION_CREATE],
    mutationFn: () => {
      return addProjectsToCollection({
        projectIds: selectedProjects.map((p) => p.id),
        collectionId: props.collection.id,
      })
    },
    onSuccess: (response) => {
      if (response.status == 'success') {
        props.setOpen(false)
        props.onSuccess?.()
        toast.success(response.message)
      } else {
        toast.error(response.message)
      }
    },
  })

  const handleAddProjectsToCollection = () => {
    addProjectsToCollectionMutation.mutate()
  }

  const projects = projectsQuery.data || []

  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <span>Choose projects </span>
            {!projectsQuery.isLoading && (
              <span className={'text-muted-foreground text-sm/none'}>
                ({selectedProjects.length}/{projects.length})
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        {projectsQuery.isLoading ? (
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

                  <ScrollArea className={'h-15 w-full pr-4'}>
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

        <DialogFooter className={'w-full flex-row justify-start'}>
          <Button
            size={'sm'}
            variant={'secondary'}
            className={'w-18'}
            onClick={handleAddProjectsToCollection}
          >
            {addProjectsToCollectionMutation.isPending ? <Spinner /> : 'Update'}
          </Button>
          <DialogClose asChild>
            <Button size={'sm'} variant={'outline'}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CollectionProjectsFormDialog
