import React from 'react'
import Image from 'next/image'
import { FormExperience, UserExperienceFormFile } from '@/lib/models'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import ReactPlayer from 'react-player'

type Props = {
  experience: FormExperience
  onRemove?: (index: number) => void
}

const ExperiencesPortfolioGallery: React.FC<Props> = (props) => {
  const files = props.experience.files
  const projects = props.experience.projects

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
            {props.onRemove && (
              <div
                className={cn(
                  'absolute inset-0 z-10 cursor-pointer bg-black/25 opacity-0 transition-opacity group-hover:opacity-100',
                  'flex items-center justify-center',
                )}
                onClick={() => props.onRemove?.(fileIndex)}
              >
                <X size={18} className={'text-destructive'} />
              </div>
            )}
            {file.type == 'image' ? (
              <Image
                src={file.url}
                alt={`file-${fileIndex}`}
                fill
                className={'z-0 object-cover'}
              />
            ) : (
              <ReactPlayer src={file.url} width={'100%'} height={'100%'} />
            )}
          </div>
        ))}
        {projectFiles.map((file, fileIndex) => (
          <div
            key={`file-${fileIndex}`}
            className={'group relative aspect-square h-20'}
          >
            {props.onRemove && file.uploadType == 'file' && (
              <div
                className={cn(
                  'absolute inset-0 z-10 cursor-pointer bg-black/25 opacity-0 transition-opacity group-hover:opacity-100',
                  'flex items-center justify-center',
                )}
                onClick={() => props.onRemove?.(fileIndex)}
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
}

export default ExperiencesPortfolioGallery
