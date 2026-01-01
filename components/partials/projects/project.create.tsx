'use client'

import React from 'react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useProjectsStore } from '@/store'
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
import { FaFileImage, FaFileVideo, FaMinus, FaPlus } from 'react-icons/fa6'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group'

const formSchema = z.object({
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

const ProjectCreate = () => {
  const {
    createIsOpen: open,
    createShow: show,
    createClose: close,
  } = useProjectsStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  })
  const uploadInputRef = React.useRef<HTMLInputElement>(null)
  const [files, setFiles] = React.useState<FormProjectFile[]>([])

  const handleUpload = (newFiles: File[]) => {
    setFiles([
      ...files,
      ...newFiles.map((file) => ({
        file,
        title: '',
        description: '',
      })),
    ])

    if (uploadInputRef.current) {
      uploadInputRef.current.value = ''
      uploadInputRef.current.files = null
    }
  }

  const handleSubmit = () => {
    console.log(form.getValues())
  }

  React.useEffect(() => {
    if (!open) {
      form.reset()
      setFiles([])
    }
  }, [open])

  return (
    <Sheet
      open={open}
      onOpenChange={(state) => {
        if (!state) {
          close()
        }
      }}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New Project</SheetTitle>
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
          <Form {...form}>
            <form className="flex flex-col gap-4 px-4">
              <FormField
                control={form.control}
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
                control={form.control}
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

          {files.length === 0 ? (
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
                  'border-foreground h-[calc(100vh-340px)] w-full rounded-sm border'
                }
              >
                <div className={'flex flex-col'}>
                  {files.map((file, fileIndex) => (
                    <div
                      key={`file-${fileIndex}`}
                      className={
                        'hover:bg-foreground/10 flex cursor-pointer items-start gap-4 p-2 pr-4'
                      }
                    >
                      <div className={'flex grow items-start gap-2'}>
                        <div className={'py-1'}>
                          {file.file.type.startsWith('image/') && (
                            <FaFileImage size={20} />
                          )}
                          {file.file.type.startsWith('video/') && (
                            <FaFileVideo size={20} />
                          )}
                        </div>

                        <div
                          className={'flex w-64 flex-col gap-2 text-xs/none'}
                        >
                          <span className={'text-muted-foreground truncate'}>
                            {file.file.name || 'No name'}
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
                        onClick={() =>
                          setFiles(files.filter((_, i) => i != fileIndex))
                        }
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
        <SheetFooter className={'flex flex-row items-center pt-0'}>
          <Button size={'sm'} variant={'secondary'}>
            Create
          </Button>
          <SheetClose asChild>
            <Button size={'sm'} variant={'ghost'}>
              Cancel
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default ProjectCreate
