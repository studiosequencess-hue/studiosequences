'use client'

import React from 'react'
import { ProjectFormFile } from '@/lib/models'
import { toast } from 'sonner'
import Loader from '@/components/partials/loader'
import { LuImage, LuVideo } from 'react-icons/lu'
import { FaMinus, FaPlus } from 'react-icons/fa6'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store'
import { UserRole } from '@/lib/constants'

type Props = {
  files: ProjectFormFile[]
  setFiles: (files: ProjectFormFile[]) => void
  activeFileIndex: number
  setActiveFileIndex: (index: number) => void
  filesLoading: boolean
}

const ProjectFormFiles: React.FC<Props> = ({
  files,
  setFiles,
  activeFileIndex,
  setActiveFileIndex,
  filesLoading,
}) => {
  const { user } = useAuthStore()
  const uploadInputRef = React.useRef<HTMLInputElement>(null)

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

  return (
    <React.Fragment>
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
            className={cn(
              'border-foreground w-full rounded-sm border',
              user?.role == UserRole.Company
                ? 'h-[calc(100vh-450px)]'
                : 'h-[calc(100vh-300px)]',
            )}
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

                    <div className={'flex w-64 flex-col gap-2 text-xs/none'}>
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
    </React.Fragment>
  )
}

export default ProjectFormFiles
