'use client'

import React from 'react'
import Image from 'next/image'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FormExperience, Project, UserExperienceFormFile } from '@/lib/models'
import { ChevronDownIcon, Save, Trash2, X } from 'lucide-react'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupTextarea } from '@/components/ui/input-group'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { EMPLOYMENT_TYPES } from '@/lib/defaults'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { beautifyEmploymentType, cn } from '@/lib/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EMPLOYMENT_TYPE, QUERY_KEYS, StorageBucketType } from '@/lib/constants'
import {
  deleteUserExperience,
  upsertExperience,
} from '@/lib/actions.experiences'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'
import HoverComponent from '@/components/partials/hover-card'
import { IoMdLink } from 'react-icons/io'
import { MdOutlineAttachment } from 'react-icons/md'
import InputFile from '@/components/partials/input-file'
import ReactPlayer from 'react-player'
import ExperiencesProjectsLinkDialog from '@/components/partials/experiences/experiences.projects.link.dialog'
import { createClient } from '@/lib/supabase.client'
import { useAuthStore } from '@/store'

const formSchema = z.object({
  title: z
    .string()
    .min(1, {
      error: 'Too short',
    })
    .max(255, {
      error: 'Too long',
    }),
  companyName: z
    .string()
    .min(1, {
      error: 'Too short',
    })
    .max(255, {
      error: 'Too long',
    }),
  employmentType: z.enum(EMPLOYMENT_TYPES),
  startDate: z.date(),
  endDate: z.date().optional(),
  location: z.string().max(255, {
    error: 'Too long',
  }),
  description: z.string().max(500, {
    error: 'Too long',
  }),
  skills: z.string().max(255, {
    error: 'Too long',
  }),
})

type Props = {
  experience: FormExperience | null
  onClose: () => void
}

const ExperiencesFormDialog: React.FC<Props> = (props) => {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: props.experience?.title || '',
      companyName: props.experience?.companyName || '',
      employmentType:
        (props.experience?.employmentType as EMPLOYMENT_TYPE) ||
        EMPLOYMENT_TYPE.FULL_TIME,
      startDate: props.experience
        ? new Date(props.experience.startDate)
        : new Date(),
      endDate: props.experience?.endDate
        ? new Date(props.experience.endDate)
        : new Date(),
      location: props.experience?.location || '',
      description: props.experience?.description || '',
      skills: props.experience?.skills || '',
    },
  })
  const [startDateOpen, setStartDateOpen] = React.useState<boolean>(false)
  const [endDateOpen, setEndDateOpen] = React.useState<boolean>(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [files, setFiles] = React.useState<UserExperienceFormFile[]>(
    (props.experience?.files || []).map((f) => ({
      uploadType: 'url',
      url: f.url,
      type: f.type as UserExperienceFormFile['type'],
      name: f.name,
    })),
  )
  const [projects, setProjects] = React.useState<Project[]>(
    props.experience?.projects || [],
  )
  const [experienceProjectsLinkOpen, setExperienceProjectsLinkOpen] =
    React.useState(false)

  const saveMutation = useMutation({
    mutationKey: [QUERY_KEYS.EXPERIENCES_SAVE, props.experience?.id],
    mutationFn: async (experience: FormExperience) => {
      if (!user) return
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.EXPERIENCES] })

      const supabase = createClient()

      const uploadImagesPromises = files.map(async (file) => {
        if (file.uploadType == 'url') {
          return {
            status: 'success',
            url: file.url,
            name: file.name,
            type: file.type,
          }
        }

        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}`
        const filePath = `${user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from(StorageBucketType.Experiences)
          .upload(filePath, file.file)

        if (uploadError) {
          console.log(uploadError)
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
        } = supabase.storage
          .from(StorageBucketType.Experiences)
          .getPublicUrl(filePath)

        return {
          status: 'success',
          url: publicUrl,
          name: fileName,
          type: file.file.type.startsWith('image/') ? 'image' : 'video',
        }
      })

      const uploadedImagesResponses = await Promise.all(uploadImagesPromises)
      const uploadedFiles = uploadedImagesResponses.filter(
        (item) => item.status === 'success',
      )

      const response = await upsertExperience({
        experience: {
          ...experience,
          files: uploadedFiles.map((f) => ({
            name: f.name,
            type: f.type,
            url: f.url,
          })),
          projects: projects,
        },
      })

      if (response.status == 'success') {
        toast.success(response.message)
        return response.data
      } else {
        toast.error(response.message)
        return null
      }
    },
    onSettled: () => {
      props.onClose()
      form.reset()
      setProjects([])
      setFiles([])

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EXPERIENCES],
        exact: false,
        refetchType: 'active',
      })
    },
  })

  const deleteMutation = useMutation({
    mutationKey: [QUERY_KEYS.EXPERIENCES_DELETE, props.experience?.id],
    mutationFn: async () => {
      if (!props.experience || props.experience.id == -1) return

      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.EXPERIENCES] })

      const response = await deleteUserExperience({
        experienceId: props.experience.id,
      })

      if (response.status == 'success') {
        toast.success(response.message)
        return response.data
      } else {
        toast.error(response.message)
        return null
      }
    },
    onSettled: () => {
      props.onClose()
      form.reset()

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EXPERIENCES],
        exact: false,
        refetchType: 'active',
      })
    },
  })

  const handleAddExperienceFiles = (newFiles: File[]) => {
    const filteredFiles = newFiles.filter(
      (file) =>
        file.type.startsWith('image/') || file.type.startsWith('video/'),
    )

    setFiles([
      ...files,
      ...filteredFiles.map((f) => ({
        uploadType: 'file' as UserExperienceFormFile['uploadType'],
        file: f,
        name: f.name,
        type: f.type.startsWith('video/') ? 'video' : 'image',
        url: '',
      })),
    ])
  }

  const handleRemoveExperienceFile = React.useCallback(
    (index: number) => {
      setFiles(files.filter((_, i) => i != index))
    },
    [files],
  )

  const handleSave = (values: z.infer<typeof formSchema>) => {
    saveMutation.mutate({
      ...values,
      id: props.experience?.id || -1,
      files: [],
      projects: [],
      startDate: values.startDate.toISOString(),
      endDate: values.endDate?.toISOString() || null,
    })
  }

  const handleDelete = () => {
    deleteMutation.mutate()
  }

  const renderExperienceFiles = React.useMemo(() => {
    const projectFiles = projects.reduce((acc, p) => {
      return acc.concat(
        p.files.map((f) => ({
          url: f.url,
          uploadType: 'url',
          type: f.type as UserExperienceFormFile['type'],
          name: f.name,
        })),
      )
    }, [] as UserExperienceFormFile[])

    const filesLength = files.length + projectFiles.length

    return filesLength == 0 ? (
      <div className={'text-muted-foreground w-full py-2 text-sm/none'}>
        No experience files
      </div>
    ) : (
      <ScrollArea
        className={cn(
          'h-42 w-full pr-3',
          filesLength == 0 && 'h-8',
          filesLength <= 6 && 'h-24',
        )}
      >
        <div className={'flex h-full w-full flex-wrap gap-0.5'}>
          {files.map((file, fileIndex) => (
            <div
              key={`file-${fileIndex}`}
              className={'group relative aspect-square h-20'}
            >
              <div
                className={cn(
                  'absolute inset-0 z-10 cursor-pointer bg-black/25 opacity-0 transition-opacity group-hover:opacity-100',
                  'flex items-center justify-center',
                )}
                onClick={() => handleRemoveExperienceFile(fileIndex)}
              >
                <X size={18} className={'text-destructive'} />
              </div>
              {file.uploadType == 'file' && (
                <div
                  className={cn(
                    'absolute inset-0 z-10 cursor-pointer bg-black/25 opacity-0 transition-opacity group-hover:opacity-100',
                    'flex items-center justify-center',
                  )}
                  onClick={() => handleRemoveExperienceFile(fileIndex)}
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
          {projectFiles.map((file, fileIndex) => (
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
                  onClick={() => handleRemoveExperienceFile(fileIndex)}
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
  }, [files, projects, handleRemoveExperienceFile])

  React.useEffect(() => {
    form.setValue('title', props.experience?.title || '')
    form.setValue('companyName', props.experience?.companyName || '')
    form.setValue(
      'employmentType',
      (props.experience?.employmentType as EMPLOYMENT_TYPE) ||
        EMPLOYMENT_TYPE.FULL_TIME,
    )
    form.setValue(
      'startDate',
      props.experience ? new Date(props.experience.startDate) : new Date(),
    )
    form.setValue(
      'endDate',
      props.experience?.endDate
        ? new Date(props.experience.endDate)
        : new Date(),
    )
    form.setValue('location', props.experience?.location || '')
    form.setValue('description', props.experience?.description || '')
    form.setValue('skills', props.experience?.skills || '')

    setFiles(
      (props.experience?.files || []).map((f) => ({
        uploadType: 'url',
        url: f.url,
        type: f.type as UserExperienceFormFile['type'],
        name: f.name,
      })),
    )
    setProjects(props.experience?.projects || [])
  }, [props.experience])

  return (
    <Dialog
      open={!!props.experience}
      onOpenChange={(state) => {
        if (!state) props.onClose()
      }}
    >
      <DialogContent className={'w-96 gap-0 p-0'}>
        <DialogHeader>
          <div className="flex items-center justify-between border-b px-6 py-4">
            <DialogTitle className="text-lg font-bold">
              {props.experience ? 'Edit Experience' : 'Add Experience'}
            </DialogTitle>
            <DialogDescription className={'hidden'} />
          </div>
        </DialogHeader>

        <ExperiencesProjectsLinkDialog
          open={experienceProjectsLinkOpen}
          setOpen={setExperienceProjectsLinkOpen}
          setSelectProjects={setProjects}
          selectedProjects={projects}
        />

        <ScrollArea className={'h-96 w-full py-4'}>
          <div className={'flex grow flex-col gap-2'}>
            <form>
              <FieldGroup className={'*:px-3 *:pr-4'}>
                <Controller
                  name="title"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="title">Job Title</FieldLabel>
                      <Input
                        {...field}
                        id="title"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="companyName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="companyName">Company</FieldLabel>
                      <Input
                        {...field}
                        id="companyName"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="employmentType"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="companyName">
                        Employment Type
                      </FieldLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {EMPLOYMENT_TYPES.map((type, index) => {
                              return (
                                <SelectItem
                                  key={`employment-type-${index}`}
                                  value={type}
                                >
                                  {beautifyEmploymentType(type)}
                                </SelectItem>
                              )
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <div className={'flex w-full items-start gap-3'}>
                  <Controller
                    name="startDate"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <div className={'flex w-full flex-col gap-2'}>
                        <FieldGroup className="flex flex-row items-start gap-4">
                          <Field>
                            <FieldLabel htmlFor="date-picker-optional">
                              Start Date
                            </FieldLabel>
                            <Popover
                              open={startDateOpen}
                              onOpenChange={setStartDateOpen}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  id="date-picker-optional"
                                  className="w-32 justify-between font-normal"
                                >
                                  {field.value
                                    ? format(field.value, 'PPP')
                                    : 'Select date'}
                                  <ChevronDownIcon />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto overflow-hidden p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  captionLayout="dropdown"
                                  defaultMonth={field.value}
                                  onSelect={(date) => {
                                    if (!date) return

                                    field.onChange(date)
                                    setStartDateOpen(false)
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                          </Field>
                        </FieldGroup>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </div>
                    )}
                  />
                  <Controller
                    name="endDate"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <div className={'flex w-full flex-col gap-2'}>
                        <FieldGroup className="flex flex-row items-start gap-4">
                          <Field>
                            <FieldLabel htmlFor="date-picker-optional">
                              End Date
                            </FieldLabel>
                            <Popover
                              open={endDateOpen}
                              onOpenChange={setEndDateOpen}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  id="date-picker-optional"
                                  className="w-32 justify-between font-normal"
                                >
                                  {field.value
                                    ? format(field.value, 'PPP')
                                    : 'Select date'}
                                  <ChevronDownIcon />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto overflow-hidden p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  captionLayout="dropdown"
                                  defaultMonth={field.value}
                                  onSelect={(date) => {
                                    if (!date) return

                                    field.onChange(date)
                                    setEndDateOpen(false)
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                          </Field>
                        </FieldGroup>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </div>
                    )}
                  />
                </div>
                <Controller
                  name="location"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="location">Location</FieldLabel>
                      <Input
                        {...field}
                        id="location"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="skills"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="skills">Skills</FieldLabel>
                      <Input
                        {...field}
                        id="skills"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="description"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="description">Description</FieldLabel>
                      <InputGroup className={'overflow-hidden'}>
                        <InputGroupTextarea
                          {...field}
                          id="description"
                          className="max-h-24 min-h-24 resize-none"
                          aria-invalid={fieldState.invalid}
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
            <div className={'px-4'}>{renderExperienceFiles}</div>
          </div>
        </ScrollArea>

        <DialogFooter
          className={'flex items-center justify-between border-t px-4 py-4'}
        >
          <InputFile
            ref={fileInputRef}
            multiple={true}
            accept={'image/*'}
            className={'hidden'}
            onFileUpload={handleAddExperienceFiles}
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
                  onClick={() => setExperienceProjectsLinkOpen(true)}
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

          <div className="flex gap-1">
            {props.experience?.id != -1 ? (
              <Button
                size={'sm'}
                variant={'destructive'}
                disabled={saveMutation.isPending || deleteMutation.isPending}
                onClick={handleDelete}
                className={'w-20'}
              >
                {deleteMutation.isPending ? (
                  <Spinner />
                ) : (
                  <div className={'flex items-center gap-1'}>
                    <Trash2 size={16} /> Delete
                  </div>
                )}
              </Button>
            ) : (
              <div />
            )}
            <Button size={'sm'} onClick={() => props.onClose()}>
              Cancel
            </Button>
            <Button
              size={'sm'}
              variant={'accent'}
              disabled={saveMutation.isPending || deleteMutation.isPending}
              onClick={form.handleSubmit(handleSave)}
              className={'w-20'}
            >
              {saveMutation.isPending ? (
                <Spinner />
              ) : (
                <div className={'flex items-center gap-1'}>
                  <Save size={16} /> Save
                </div>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ExperiencesFormDialog
