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
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import { EMPLOYMENT_TYPES } from '@/lib/defaults'
import { ScrollArea } from '@/components/ui/scroll-area'

const formSchema = z.object({
  title: z.string().min(1, 'Too short'),
  companyName: z.string().min(1, 'Too short.'),
  employmentType: z.enum(EMPLOYMENT_TYPES),
  startDate: z.date(),
  endDate: z.date().optional(),
  location: z.string(),
  description: z.string(),
  skills: z.string(),
})

type Props = {
  experience: FormExperience | null
  onClose: () => void
  onDelete?: () => void
  onSave?: (exp: FormExperience) => void
}

const ExperiencesFormDialog: React.FC<Props> = (props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: props.experience?.title || '',
      companyName: props.experience?.companyName || '',
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

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    console.log(data)
  }

  return (
    <Dialog
      open={!!props.experience}
      onOpenChange={(state) => {
        if (!state) props.onClose()
      }}
    >
      <DialogContent className={'gap-0 p-0'}>
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
                    <Combobox
                      defaultValue={field.value}
                      items={EMPLOYMENT_TYPES}
                      onValueChange={field.onChange}
                    >
                      <ComboboxInput placeholder="Select" />
                      <ComboboxContent>
                        <ComboboxEmpty>Empty</ComboboxEmpty>
                        <ComboboxList>
                          {(item) => (
                            <ComboboxItem key={item} value={item}>
                              {item}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
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
          className={'flex items-center justify-between border-t px-6 py-4'}
        >
          {props.experience ? (
            <button
              type="button"
              onClick={() => props.onDelete?.()}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50"
            >
              <Trash2 size={16} /> Delete
            </button>
          ) : (
            <div />
          )}
          <div className="flex gap-3">
            <button
              onClick={() => props.onClose()}
              className="rounded-lg px-4 py-2 font-semibold text-gray-600 transition-colors hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                const values = form.getValues()
                props.onSave?.({
                  ...values,
                  id: -1,
                  files: [],
                  projects: [],
                  startDate: values.startDate.toISOString(),
                  endDate: values.endDate?.toISOString() || null,
                })
              }}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              <Save size={18} /> Save
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ExperiencesFormDialog
