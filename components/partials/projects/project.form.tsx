'use client'

import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useAuthStore, useProjectsStore, useProjectViewerStore } from '@/store'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { FormProjectFile } from '@/lib/models'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { toast } from 'sonner'
import { FaMinus, FaPlus } from 'react-icons/fa6'
import { cn } from '@/lib/utils'
import ProjectFormPreviewItem from '@/components/partials/projects/project.form.preview.item'
import { LuImage, LuVideo } from 'react-icons/lu'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  createProject,
  deleteProject,
  getProjectFilesById,
  updateProject,
} from '@/lib/actions.projects'
import { createClient } from '@/lib/supabase.client'
import { Spinner } from '@/components/ui/spinner'
import Loader from '@/components/partials/loader'

const projectFormSchema = z.object({
  title: z
    .string()
    .min(1, {
      error: 'Too short',
    })
    .max(255, {
      error: 'Too long',
    }),
  description: z
    .string()
    .min(1, {
      error: 'Too short',
    })
    .max(1000, {
      error: 'Too long',
    }),
  is_sensitive: z.boolean(),
})

const ProjectForm = () => {
  const { isOpen, close, project, isEditable } = useProjectViewerStore()
  const { user, loading: userLoading } = useAuthStore()
  const { setProjects, projects } = useProjectsStore()

  const projectForm = useForm<z.infer<typeof projectFormSchema>>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: project?.title || '',
      description: project?.description || '',
      is_sensitive: project?.is_sensitive || false,
    },
  })
  const uploadInputRef = React.useRef<HTMLInputElement>(null)
  const [files, setFiles] = React.useState<FormProjectFile[]>([])
  const [filesLoading, setFilesLoading] = React.useState(true)
  const [activeFileIndex, setActiveFileIndex] = React.useState(-1)
  const [projectProcessing, setProjectProcessing] = React.useState(false)
  const [projectDeleting, setProjectDeleting] = React.useState(false)

  const handleDelete = async () => {
    if (!project) return
    setProjectDeleting(true)

    const response = await deleteProject({
      id: project.id,
    })

    if (response.status == 'success') {
      projectForm.reset()
      setFiles([])

      setProjects(projects.filter((p) => p.id != project.id))

      toast.success(response.message)
      close()
    } else {
      toast.error(response.message)
    }

    setProjectDeleting(false)
  }

  const handleUpload = (newFiles: File[]) => {
    setFiles([
      ...files,
      ...newFiles.map((file) => ({
        name: file.name,
        title: '',
        description: '',
        uploadType: 'file' as const,
        type: file.type.startsWith('image/') ? 'image' : 'video',
        file,
      })),
    ])

    if (uploadInputRef.current) {
      uploadInputRef.current.value = ''
      uploadInputRef.current.files = null
    }
  }

  const handleSubmit = async () => {
    if (!user || userLoading) return
    setProjectProcessing(true)

    const supabase = createClient()

    const uploadImagesPromises = files.map(async (projectFile) => {
      if (projectFile.uploadType == 'url') {
        return {
          status: 'success',
          url: projectFile.url,
          title: projectFile.title,
          description: projectFile.description,
          name: projectFile.name,
          type: projectFile.type,
        }
      }

      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}`
      const filePath = `projects/${user.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('files')
        .upload(filePath, projectFile.file)

      if (uploadError) {
        return {
          status: 'error',
          url: '',
          title: '',
          description: '',
          type: 'image',
          name: '',
        }
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('files').getPublicUrl(filePath)

      return {
        status: 'success',
        url: publicUrl,
        title: projectFile.title,
        description: projectFile.description,
        name: fileName,
        type: projectFile.file.type.startsWith('image/') ? 'image' : 'video',
      }
    })

    const uploadedImagesResponses = await Promise.all(uploadImagesPromises)

    const response = project
      ? await updateProject({
          ...projectForm.getValues(),
          id: project.id,
          files: uploadedImagesResponses.filter(
            (item) => item.status === 'success',
          ),
        })
      : await createProject({
          ...projectForm.getValues(),
          files: uploadedImagesResponses.filter(
            (item) => item.status === 'success',
          ),
        })

    if (response.status === 'success') {
      toast.success(response.message)
      if (project) {
        setProjects(
          projects.map((p) => {
            if (p.id == project.id) {
              return {
                ...response.data,
              }
            }

            return p
          }),
        )
      } else {
        setProjects([...projects, response.data])
      }

      projectForm.reset()
      setFiles([])

      close()
    } else {
      toast.error(response.message)
    }

    setProjectProcessing(false)
  }

  const loadProjectFiles = React.useCallback(async () => {
    if (!project) return

    const projectFilesResponse = await getProjectFilesById({
      id: project.id,
    })

    if (projectFilesResponse.status == 'success') {
      setFiles(
        projectFilesResponse.data.map((image) => ({
          title: image.title || '',
          description: image.description || '',
          url: image.url,
          type: image.type,
          name: image.name,
          uploadType: 'url',
        })),
      )
    } else {
      toast.error(projectFilesResponse.message)
    }
  }, [project])

  React.useEffect(() => {
    projectForm.reset()

    projectForm.setValue('title', project?.title || '')
    projectForm.setValue('description', project?.description || '')
    projectForm.setValue('is_sensitive', project?.is_sensitive || false)

    setFilesLoading(true)
    loadProjectFiles().finally(() => {
      setFilesLoading(false)
    })
  }, [project, projectForm, loadProjectFiles])

  return (
    <Sheet
      open={isOpen && isEditable}
      onOpenChange={(state) => {
        if (!state) {
          setActiveFileIndex(-1)
          close()
        }
      }}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{project ? 'Edit Project' : 'New Project'}</SheetTitle>
        </SheetHeader>
        <div className={'flex flex-col gap-4'}>
          <input
            ref={uploadInputRef}
            type={'file'}
            accept={'image/*,video/*'}
            className={'hidden'}
            multiple
            onChange={(e) => {
              const files = e.target.files
              if (!files || files.length == 0) {
                toast.error('No files selected')
                return
              }

              handleUpload(
                Array.from(files).filter(
                  (file) =>
                    file.type.startsWith('image/') ||
                    file.type.startsWith('video/'),
                ),
              )
            }}
          />
          <Form {...projectForm}>
            <form className="flex flex-col gap-4 px-4">
              <FormField
                control={projectForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={projectForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className={'h-14 max-h-14 min-h-14 resize-none'}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={projectForm.control}
                name="is_sensitive"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id="is_sensitive"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <Label htmlFor="is_sensitive">
                          Contains Sensitive Content
                        </Label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          {filesLoading ? (
            <Loader />
          ) : files.length === 0 ? (
            <Empty className="mx-4 border border-dashed">
              <EmptyHeader>
                <EmptyTitle>No Items</EmptyTitle>
                <EmptyDescription>
                  Attach images / videos to your project
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => uploadInputRef.current?.click()}
                >
                  Attach
                </Button>
              </EmptyContent>
            </Empty>
          ) : (
            <div className={'flex flex-col gap-2 px-4'}>
              <div className={'flex items-center justify-between gap-4'}>
                <span>Files</span>
                <Button
                  variant={'secondary'}
                  size={'icon-sm'}
                  className={'h-fit w-fit rounded-sm p-1'}
                  onClick={() => uploadInputRef.current?.click()}
                >
                  <FaPlus />
                </Button>
              </div>
              <ScrollArea
                className={
                  'border-foreground h-[calc(100vh-380px)] w-full rounded-sm border'
                }
              >
                <div className={'flex flex-col'}>
                  {files.map((file, fileIndex) => (
                    <div
                      id={`file-${fileIndex}`}
                      key={`file-${fileIndex}`}
                      className={cn(
                        'hover:bg-foreground/10 flex cursor-pointer items-start gap-4 p-2 pr-4',
                        activeFileIndex == fileIndex && 'bg-foreground/10',
                      )}
                      onClick={() => setActiveFileIndex(fileIndex)}
                    >
                      <div className={'flex grow items-start gap-2'}>
                        <div className={'py-1'}>
                          {file.type == 'image' && <LuImage size={20} />}
                          {file.type == 'video' && <LuVideo size={20} />}
                        </div>

                        <div
                          className={'flex w-64 flex-col gap-2 text-xs/none'}
                        >
                          <span className={'text-muted-foreground truncate'}>
                            {file.name || 'No name'}
                          </span>
                          <span className={'truncate'}>
                            {file.title || 'No title'}
                          </span>
                          <span className={'wrap-break line-clamp-3'}>
                            {file.description || 'No description'}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant={'destructive'}
                        size={'icon-sm'}
                        className={'h-fit w-fit rounded-sm p-1'}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setFiles(files.filter((_, i) => i != fileIndex))
                        }}
                      >
                        <FaMinus />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
        <SheetFooter
          className={'flex flex-row items-center justify-between gap-2 pt-0'}
        >
          <div className={'flex items-center gap-2'}>
            <Button
              disabled={
                !projectForm.formState.isValid ||
                files.length == 0 ||
                projectProcessing ||
                projectDeleting ||
                !user ||
                userLoading
              }
              size={'sm'}
              variant={'secondary'}
              className={'w-20'}
              onClick={projectForm.handleSubmit(handleSubmit)}
            >
              {projectProcessing ? <Spinner /> : project ? 'Update' : 'Create'}
            </Button>
            <Button size={'sm'} variant={'ghost'} onClick={() => close()}>
              Cancel
            </Button>
          </div>

          {project && (
            <Button
              size={'sm'}
              variant={'destructive'}
              disabled={projectDeleting || projectProcessing}
              onClick={handleDelete}
            >
              {projectDeleting ? <Spinner /> : 'Delete'}
            </Button>
          )}
        </SheetFooter>

        <div
          className={cn(
            'bg-background absolute inset-0 z-100 translate-x-full transition-transform duration-300',
            activeFileIndex >= 0 &&
              activeFileIndex < files.length &&
              'translate-x-0',
          )}
        >
          {activeFileIndex >= 0 && activeFileIndex < files.length && (
            <ProjectFormPreviewItem
              item={files[activeFileIndex]}
              onChange={(item) => {
                const tempFiles = [...files]
                tempFiles[activeFileIndex] = item

                setFiles(tempFiles)
              }}
              close={() => setActiveFileIndex(-1)}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default ProjectForm
