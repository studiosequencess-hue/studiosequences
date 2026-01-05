'use client'

import React from 'react'
import Image from 'next/image'
import { FormProjectFile } from '@/lib/models'
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
})

type Props = {
  item: FormProjectFile
  onChange: (item: FormProjectFile) => void
  close: () => void
}

const ProjectCreatePreviewItem: React.FC<Props> = ({
  item,
  onChange,
  close,
}) => {
  const itemForm = useForm<z.infer<typeof itemFormSchema>>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  })
  const [file, setFile] = React.useState<File>(item.file)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    itemForm.setValue('title', item.title)
    itemForm.setValue('description', item.description)
    setFile(item.file)
  }, [item, itemForm])

  return (
    <React.Fragment>
      <div className={'flex items-center gap-2 px-3 py-3'}>
        <ChevronLeft className={'cursor-pointer'} onClick={() => close()} />
        <span>Edit Selected Item</span>
      </div>
      <div className={'flex w-full flex-col gap-4 px-4'}>
        <Form {...itemForm}>
          <form className="flex flex-col gap-4">
            <FormField
              control={itemForm.control}
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
              control={itemForm.control}
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
          </form>
        </Form>

        {file.type.startsWith('image/') && (
          <div className={'relative aspect-square w-full'}>
            <Image
              src={URL.createObjectURL(file)}
              alt={'active-file-image'}
              fill
              className={'object-cover'}
            />
          </div>
        )}
        {file.type.startsWith('video/') && (
          <ReactPlayer
            src={URL.createObjectURL(file)}
            controls
            width={'100%'}
          />
        )}

        <div className={'flex items-center justify-between gap-2'}>
          <input
            ref={fileInputRef}
            type={'file'}
            accept={'image/*,video/*'}
            className={'hidden'}
            multiple={false}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (!file) {
                toast.error('No file selected')
                return
              }

              setFile(file)
              e.currentTarget.value = ''
              e.currentTarget.files = null
            }}
          />

          <Button
            size={'sm'}
            variant={'secondary'}
            onClick={() => {
              if (!fileInputRef.current) return

              fileInputRef.current.click()
            }}
          >
            Change File
          </Button>

          <div className={'flex items-center gap-2'}>
            <Button
              disabled={
                !itemForm.formState.isDirty &&
                !itemForm.formState.isValid &&
                file == item.file
              }
              size={'sm'}
              variant={'secondary'}
              onClick={() => {
                onChange({
                  title: itemForm.getValues('title'),
                  description: itemForm.getValues('description'),
                  file,
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

export default ProjectCreatePreviewItem
