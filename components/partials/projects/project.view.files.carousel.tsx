'use client'

import React from 'react'
import Image from 'next/image'
import ReactPlayer from 'react-player'
import { EmblaOptionsType } from 'embla-carousel'
import { ProjectFile } from '@/lib/models'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'

type Props = {
  files: ProjectFile[]
  options?: EmblaOptionsType
}

const ProjectViewFilesCarousel: React.FC<Props> = (props) => {
  const { files, options } = props
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      <Carousel setApi={setApi} className="mx-auto w-full">
        <CarouselContent>
          {files.map((file, fileIndex) => (
            <CarouselItem
              className="relative aspect-square h-96"
              key={fileIndex}
            >
              {file.type == 'image' && (
                <Image
                  src={file.url}
                  alt={`project-file-${fileIndex}`}
                  fill
                  className={`object-cover pr-6 pl-10`}
                />
              )}
              {file.type == 'video' && (
                <ReactPlayer
                  src={file.url}
                  controls
                  width={'100%'}
                  height={'100%'}
                />
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className={'flex flex-col gap-2 py-4 text-sm/none'}>
        <div className={'line-clamp-2 w-full px-6 text-center wrap-break-word'}>
          {files[current].title}
        </div>
        <div
          className={
            'text-muted-foreground line-clamp-4 w-full px-6 text-center wrap-break-word'
          }
        >
          {files[current].description}
        </div>
        <div className="text-muted-foreground absolute top-2 right-8 rounded-sm bg-black/90 px-2 py-0.5 text-center text-sm">
          File {current + 1} of {count}
        </div>
      </div>
    </div>
  )
}

export default ProjectViewFilesCarousel
