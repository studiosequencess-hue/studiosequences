'use client'

import React from 'react'
import Image from 'next/image'
import { ProjectFormFile, ProjectMember } from '@/lib/models'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
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
import ReactPlayer from 'react-player'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'

const itemFormSchema = z.object({
  department: z.string().max(255, {
    error: 'Too long',
  }),
})

type Props = {
  item: ProjectMember
  onChange: (item: ProjectMember) => void
  close: () => void
}

const ProjectFormPreviewFile: React.FC<Props> = ({ item, onChange, close }) => {
  const itemForm = useForm<z.infer<typeof itemFormSchema>>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      department: '',
    },
  })

  React.useEffect(() => {
    itemForm.setValue('department', item.department || '')
  }, [item, itemForm])

  return (
    <React.Fragment>
      <div className={'flex items-center gap-2 px-3 py-3'}>
        <ChevronLeft className={'cursor-pointer'} onClick={() => close()} />
        <span>Edit Selected Item</span>
      </div>
      <div className={'flex w-full flex-col gap-4 px-4'}>
        <Form {...itemForm}>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <FormField
              control={itemForm.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <div className={'flex items-center justify-between gap-2'}>
          <div className={'flex items-center gap-2'}>
            <Button
              disabled={
                !itemForm.formState.isDirty && !itemForm.formState.isValid
              }
              size={'sm'}
              variant={'secondary'}
              onClick={() => {
                onChange({
                  ...item,
                  department: itemForm.getValues('department'),
                })

                close()
              }}
            >
              Update
            </Button>
            <Button size={'sm'} variant={'ghost'} onClick={() => close()}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default ProjectFormPreviewFile
