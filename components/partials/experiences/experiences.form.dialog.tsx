'use client'

import React from 'react'
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
import { FormExperience } from '@/lib/models'
import { ChevronDownIcon, Save, Trash2 } from 'lucide-react'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { beautifyEmploymentType } from '@/lib/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EMPLOYMENT_TYPE, QUERY_KEYS } from '@/lib/constants'
import {
  deleteUserExperience,
  upsertExperience,
} from '@/lib/actions.experiences'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'

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

  const saveMutation = useMutation({
    mutationKey: [QUERY_KEYS.EXPERIENCES_SAVE, props.experience?.id],
    mutationFn: async (experience: FormExperience) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.EXPERIENCES] })

      const response = await upsertExperience({ experience })

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

        <ScrollArea className={'h-96 w-full py-4'}>
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
        </ScrollArea>

        <DialogFooter
          className={'flex items-center justify-between border-t px-4 py-4'}
        >
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
          <div className="flex gap-2">
            <Button size={'sm'} onClick={() => props.onClose()}>
              Cancel
            </Button>
            <Button
              size={'sm'}
              variant={'accent'}
              disabled={
                !form.formState.isValid ||
                saveMutation.isPending ||
                deleteMutation.isPending
              }
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
