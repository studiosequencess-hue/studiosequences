'use client'

import React from 'react'
import Image from 'next/image'
import { useAuthStore } from '@/store'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import {
  Post,
  PostFile,
  PostFormFile,
  PostProject,
  Project,
} from '@/lib/models'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { X } from 'lucide-react'
import { MdOutlineAttachment } from 'react-icons/md'
import HoverComponent from '@/components/partials/hover-card'
import { IoMdLink } from 'react-icons/io'
import InputFile from '@/components/partials/input-file'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import PostProjectsLinkDialog from '@/components/partials/posts/post.projects.link.dialog'
import ReactPlayer from 'react-player'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPost } from '@/lib/actions.posts'
import { createClient } from '@/lib/supabase.client'
import { toast } from 'sonner'
import { POSTS_LIST_TYPE, QUERY_KEYS } from '@/lib/constants'
import { Spinner } from '@/components/ui/spinner'

const MAX_CHARS = 500

const postFormSchema = z.object({
  content: z
    .string()
    .min(1, {
      error: 'Too short',
    })
    .max(MAX_CHARS, {
      error: 'Too long',
    }),
})

type Props = {
  type: POSTS_LIST_TYPE
  post?: Post
}

const PostForm: React.FC<Props> = (props) => {
  const { user, loading: userLoading } = useAuthStore()
  const queryClient = useQueryClient()

  const postForm = useForm<z.infer<typeof postFormSchema>>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      content: props.post?.content || '',
    },
  })
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [files, setFiles] = React.useState<PostFormFile[]>(
    (props.post?.files || []).map((f) => ({
      uploadType: 'url',
      url: f.url,
      type: f.type as PostFormFile['type'],
      name: f.name,
    })),
  )
  const [projects, setProjects] = React.useState<Project[]>(
    props.post?.projects || [],
  )
  const [postProjectsLinkOpen, setPostProjectsLinkOpen] = React.useState(false)
  const postProcessMutation = useMutation({
    mutationKey: ['post-processing'],
    mutationFn: async (data: {
      content: string
      files: Pick<PostFile, 'url' | 'type' | 'name'>[]
      projects: Pick<PostProject, 'project_id'>[]
    }) => {
      return createPost(data)
    },
    onSuccess: (response) => {
      if (response.status == 'error') {
        toast.error(response.message)
      } else {
        toast.success(response.message)
        postForm.reset()
        setFiles([])
        setProjects([])

        queryClient.invalidateQueries({
          queryKey: [
            props.type == POSTS_LIST_TYPE.DISCOVER
              ? QUERY_KEYS.DISCOVER_POSTS
              : QUERY_KEYS.PERSONAL_POSTS,
          ],
        })
      }
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const content = postForm.watch('content')
  const contentLength = content.trim().length

  const isValidPost = contentLength != 0 && contentLength < MAX_CHARS

  const handleAddPostFiles = (files: File[]) => {
    const filteredFiles = files.filter(
      (file) =>
        file.type.startsWith('image/') || file.type.startsWith('video/'),
    )

    setFiles(
      filteredFiles.map((f) => ({
        uploadType: 'file',
        file: f,
        name: f.name,
        type: f.type.startsWith('video/') ? 'video' : 'image',
        created_at: Date.now().toString(),
        id: -1,
        post_id: -1,
        url: '',
      })),
    )
  }

  const handleRemovePostFile = React.useCallback(
    (index: number) => {
      setFiles(files.filter((_, i) => i != index))
    },
    [files],
  )

  const handleSubmit = async () => {
    if (!user || userLoading) return

    const supabase = createClient()

    const uploadImagesPromises = files.map(async (projectFile) => {
      if (projectFile.uploadType == 'url') {
        return {
          status: 'success',
          url: projectFile.url,
          name: projectFile.name,
          type: projectFile.type,
        }
      }

      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}`
      const filePath = `posts/${user.id}/${fileName}`

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
        name: fileName,
        type: projectFile.file.type.startsWith('image/') ? 'image' : 'video',
      }
    })

    const uploadedImagesResponses = await Promise.all(uploadImagesPromises)
    const uploadedFiles = uploadedImagesResponses.filter(
      (item) => item.status === 'success',
    )
    const content = postForm.getValues().content

    postProcessMutation.mutate({
      content,
      files: uploadedFiles.map((f) => ({
        name: f.name,
        type: f.type,
        url: f.url,
      })),
      projects: projects.map((p) => ({
        project_id: p.id,
      })),
    })
  }

  const renderPostFiles = React.useMemo(() => {
    const postFiles = files.concat(
      projects.reduce((acc, p) => {
        return acc.concat(
          p.files.map((f) => ({
            url: f.url,
            uploadType: 'url',
            type: f.type as PostFormFile['type'],
            name: f.name,
          })),
        )
      }, [] as PostFormFile[]),
    )

    return postFiles.length == 0 ? (
      <div className={'text-muted-foreground w-full py-2 text-sm/none'}>
        No post files
      </div>
    ) : (
      <ScrollArea
        className={cn(
          'h-42 w-full pr-3',
          postFiles.length == 0 && 'h-8',
          postFiles.length <= 6 && 'h-24',
        )}
      >
        <div className={'flex h-full w-full flex-wrap gap-0.5'}>
          {postFiles.map((file, fileIndex) => (
            <div
              key={`file-${fileIndex}`}
              className={'group relative aspect-square h-20'}
            >
              {file.uploadType == 'file' && (
                <div
                  className={cn(
                    'absolute inset-0 z-10 cursor-pointer bg-black/25 opacity-0 transition-opacity group-hover:opacity-100',
                    'flex items-center justify-center',
                  )}
                  onClick={() => handleRemovePostFile(fileIndex)}
                >
                  <X size={18} className={'text-destructive'} />
                </div>
              )}
              {file.type == 'image' ? (
                <Image
                  src={
                    file.uploadType == 'file'
                      ? URL.createObjectURL(file.file)
                      : file.url
                  }
                  alt={`file-${fileIndex}`}
                  fill
                  className={'z-0 object-cover'}
                />
              ) : (
                <ReactPlayer
                  src={
                    file.uploadType == 'file'
                      ? URL.createObjectURL(file.file)
                      : file.url
                  }
                  width={'100%'}
                  height={'100%'}
                />
              )}
            </div>
          ))}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    )
  }, [files, projects, handleRemovePostFile])

  return (
    <div className="flex justify-center">
      <PostProjectsLinkDialog
        open={postProjectsLinkOpen}
        setOpen={setPostProjectsLinkOpen}
        setSelectProjects={setProjects}
        selectedProjects={projects}
      />

      <div className="h-fit w-[600px] rounded-xl border border-gray-800 bg-black">
        <div className="flex w-full gap-4 p-4">
          <Avatar>
            <AvatarImage src={user?.avatar || ''} />
            <AvatarFallback className={'text-sm/none'}>P</AvatarFallback>
          </Avatar>

          <div className="flex w-10/12 grow flex-col gap-2">
            <form id="post-form">
              <FieldGroup>
                <Controller
                  name="content"
                  control={postForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="post-form-title">
                        Create Post
                      </FieldLabel>
                      <Textarea
                        {...field}
                        id="post-form-content"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
            {renderPostFiles}

            <div className="flex items-center justify-between">
              <InputFile
                ref={fileInputRef}
                multiple={true}
                accept={'image/*'}
                className={'hidden'}
                onFileUpload={handleAddPostFiles}
              />
              <div className="flex items-center gap-2">
                <HoverComponent
                  trigger={
                    <Button
                      variant={'ghost'}
                      size={'icon-sm'}
                      className={'relative h-fit w-fit p-1.5'}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <MdOutlineAttachment
                        size={32}
                        className={
                          'group-hover:text-background text-muted-foreground -rotate-45'
                        }
                      />
                      {files.length > 0 && (
                        <span
                          className={
                            'text-accent-blue absolute right-0.5 bottom-0.5 text-xs/none group-hover:hidden'
                          }
                        >
                          {files.length}
                        </span>
                      )}
                    </Button>
                  }
                  content={'Attach file'}
                />
                <HoverComponent
                  trigger={
                    <Button
                      variant={'ghost'}
                      size={'icon-lg'}
                      className={'group relative h-fit w-fit p-1.5'}
                      onClick={() => setPostProjectsLinkOpen(true)}
                    >
                      <IoMdLink
                        size={32}
                        className={
                          'group-hover:text-background text-muted-foreground'
                        }
                      />
                      {projects.length > 0 && (
                        <span
                          className={
                            'text-accent-blue absolute right-0.5 bottom-0.5 text-xs/none group-hover:hidden'
                          }
                        >
                          {projects.length}
                        </span>
                      )}
                    </Button>
                  }
                  content={'Link projects'}
                />
              </div>

              <div className="flex items-center gap-4">
                {/* Character Counter Ring */}
                <div className={'text-muted-foreground'}>{}</div>

                <Button
                  disabled={!isValidPost || postProcessMutation.isFetching}
                  variant={'accent'}
                  onClick={postForm.handleSubmit(handleSubmit)}
                  className={'w-18'}
                >
                  {postProcessMutation.isFetching ? <Spinner /> : 'Post'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostForm
