'use client'

import React from 'react'
import Image from 'next/image'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useCompanyEventsStore } from '@/store'
import { Button } from '@/components/ui/button'
import * as z from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ChevronDownIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { createEvent, updateEvent } from '@/lib/actions.events'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS, StorageBucketType, StoragePath } from '@/lib/constants'
import { FormCompanyEvent } from '@/lib/models'
import InputFile from '@/components/partials/input-file'
import Placeholder from '@/public/images/placeholder.svg'
import { uploadFile } from '@/lib/actions.storage'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'

const MAX_DESCRIPTION = 300
const MAX_FILE_SIZE = parseInt(
  process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '1024 * 1024 * 5',
)

const formSchema = z.object({
  title: z.string().min(1, 'Too short').max(255, 'Too long'),
  description: z.string().min(10, 'Too short').max(MAX_DESCRIPTION, 'Too long'),
  location: z.string().min(1, 'Too short').max(255, 'Too long'),
  tag: z.string().min(1, 'Too short').max(50, 'Too long'),
  start_date: z.date(),
  end_date: z.date(),
})

const CompanyEventsFormDialog = () => {
  const queryClient = useQueryClient()
  const { formOpen, setFormOpen } = useCompanyEventsStore()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      tag: '',
      start_date: new Date(),
      end_date: new Date(),
    },
  })
  const [startDateOpen, setStartDateOpen] = React.useState<boolean>(false)
  const [endDateOpen, setEndDateOpen] = React.useState<boolean>(false)
  const backgroundFileInputRef = React.useRef<HTMLInputElement>(null)
  const [backgroundFile, setBackgroundFile] = React.useState<File | null>(null)

  const createEventMutation = useMutation({
    mutationKey: [QUERY_KEYS.EVENTS_CREATE],
    mutationFn: async (data: FormCompanyEvent) => {
      if (backgroundFile && backgroundFile.size > MAX_FILE_SIZE) {
        return toast.error(
          `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit.`,
        )
      }

      const eventResponse = await createEvent({ event: data })

      if (
        eventResponse.status == 'success' &&
        eventResponse.data &&
        backgroundFile != null
      ) {
        const uploadResponse = await uploadFile({
          bucket: StorageBucketType.Events,
          file: backgroundFile,
          path: StoragePath.Events,
          basename: 'event',
          id: eventResponse.data.id.toString(),
        })

        if (uploadResponse.status == 'success') {
          const updateInfoResponse = await updateEvent({
            event_id: eventResponse.data.id,
            event: {
              background_url: uploadResponse.data,
            },
          })

          if (updateInfoResponse.status == 'error') {
            toast.error(updateInfoResponse.message)
          } else {
            toast.success(updateInfoResponse.message)
          }
        } else {
          toast.error(uploadResponse.message)
        }
      } else {
        toast.error(eventResponse.message)
      }

      return eventResponse.status == 'success'
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS] })
      form.reset()
      setBackgroundFile(null)
      setFormOpen(false)
    },
    onError: (err) => {
      console.error('Failed to create event:', err.message)
    },
  })

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    createEventMutation.mutate({
      ...data,
      background_url: '',
      start_date: data.start_date.toISOString(),
      end_date: data.end_date.toISOString(),
    })
  }

  return (
    <Sheet open={formOpen} onOpenChange={setFormOpen}>
      <SheetContent className={'w-96 gap-0'}>
        <SheetHeader>
          <SheetTitle>New Event</SheetTitle>
          <SheetDescription className={'hidden'} />
        </SheetHeader>
        <ScrollArea className={'h-[calc(100vh-125px)] w-full p-3'}>
          <form id="event-form">
            <FieldGroup>
              <div className="relative h-40 w-full">
                <Image
                  src={
                    backgroundFile
                      ? URL.createObjectURL(backgroundFile)
                      : Placeholder
                  }
                  alt="event-image"
                  fill
                  className="z-10 cursor-pointer object-cover"
                  onClick={() => {
                    backgroundFileInputRef.current?.click()
                  }}
                />
                <InputFile
                  ref={backgroundFileInputRef}
                  accept={'image/*'}
                  disabled={createEventMutation.isPending}
                  className={'hidden'}
                  onFileUpload={(file) => {
                    setBackgroundFile(file)
                  }}
                />
              </div>
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="event-form-title">Title</FieldLabel>
                    <Input
                      {...field}
                      id="event-form-title"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter title"
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
                    <FieldLabel htmlFor="event-form-description">
                      Description
                    </FieldLabel>
                    <InputGroup className={'overflow-hidden'}>
                      <InputGroupTextarea
                        {...field}
                        id="event-form-description"
                        placeholder="Enter description"
                        className="min-h-16 resize-none"
                        aria-invalid={fieldState.invalid}
                      />
                      <InputGroupAddon
                        align="block-end"
                        className={'bg-background/5 w-full px-3 py-2'}
                      >
                        <InputGroupText className="w-full text-right text-xs/none tabular-nums">
                          {field.value.length}/{MAX_DESCRIPTION} characters
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="location"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="event-form-location">
                      Location
                    </FieldLabel>
                    <Input
                      {...field}
                      id="event-form-location"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter location"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="tag"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="event-form-tag">Tag</FieldLabel>
                    <Input
                      {...field}
                      id="event-form-tag"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter tag"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="start_date"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className={'flex flex-col gap-2'}>
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

                                field.onChange(
                                  new Date(
                                    date.getFullYear(),
                                    date.getMonth(),
                                    date.getDate(),
                                    field.value.getHours(),
                                    field.value.getMinutes(),
                                    field.value.getSeconds(),
                                  ),
                                )
                                setStartDateOpen(false)
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </Field>
                      <Field className="w-32">
                        <FieldLabel htmlFor="time-picker-optional">
                          Start Time
                        </FieldLabel>
                        <Input
                          type="time"
                          id="time-picker-optional"
                          step="1"
                          defaultValue="00:00:00"
                          className="bg-background text-foreground appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                          onChange={(e) => {
                            const value = e.currentTarget.value
                            const [hours, minutes, seconds = '00'] =
                              value.split(':')

                            field.onChange(
                              new Date(
                                field.value.getFullYear(),
                                field.value.getMonth(),
                                field.value.getDate(),
                                parseInt(hours),
                                parseInt(minutes),
                                parseInt(seconds),
                              ),
                            )
                          }}
                        />
                      </Field>
                    </FieldGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
                )}
              />
              <Controller
                name="end_date"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className={'flex flex-col gap-2'}>
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

                                field.onChange(
                                  new Date(
                                    date.getFullYear(),
                                    date.getMonth(),
                                    date.getDate(),
                                    field.value.getHours(),
                                    field.value.getMinutes(),
                                    field.value.getSeconds(),
                                  ),
                                )
                                setEndDateOpen(false)
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </Field>
                      <Field className="w-32">
                        <FieldLabel htmlFor="time-picker-optional">
                          End Time
                        </FieldLabel>
                        <Input
                          type="time"
                          id="time-picker-optional"
                          step="1"
                          defaultValue="00:00:00"
                          className="bg-background text-foreground appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                          onChange={(e) => {
                            const value = e.currentTarget.value
                            const [hours, minutes, seconds = '00'] =
                              value.split(':')

                            field.onChange(
                              new Date(
                                field.value.getFullYear(),
                                field.value.getMonth(),
                                field.value.getDate(),
                                parseInt(hours),
                                parseInt(minutes),
                                parseInt(seconds),
                              ),
                            )
                          }}
                        />
                      </Field>
                    </FieldGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
                )}
              />
            </FieldGroup>
          </form>
        </ScrollArea>

        <SheetFooter className={'grid w-full grid-cols-2'}>
          <Button
            size={'sm'}
            variant={'secondary'}
            disabled={createEventMutation.isPending}
            onClick={form.handleSubmit(handleSubmit)}
          >
            {createEventMutation.isPending ? <Spinner /> : 'Add event'}
          </Button>
          <SheetClose asChild>
            <Button size={'sm'} variant={'outline'}>
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default CompanyEventsFormDialog
