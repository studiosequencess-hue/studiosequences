import React from 'react'
import Image from 'next/image'
import { Project } from '@/lib/models'
import Placeholder from '@/public/images/placeholder.svg'
import { cn } from '@/lib/utils'

type Props = {
  project: Project
}

const ProjectsGridPreviewBackground: React.FC<Props> = ({ project }) => {
  const isCensored = project.is_sensitive && !project.is_revealed

  if (!project.files || project.files.length == 0) {
    return (
      <Image
        src={Placeholder}
        alt={`${project.id}-preview`}
        fill
        className={cn(
          `h-full w-full object-cover transition-all duration-500`,
          isCensored
            ? 'scale-150 opacity-30 blur-3xl grayscale'
            : 'group-hover:scale-110',
        )}
      />
    )
  }

  const file = project.files[0]

  if (file.type == 'video') {
    return (
      <video
        src={`${file.url}#t=0.5`}
        preload="metadata"
        className={'h-full w-full'}
        muted
        playsInline
      />
    )
  }

  return (
    <Image
      src={file.url}
      alt={`${project.id}-preview`}
      fill
      className={cn(
        `h-full w-full object-cover transition-all duration-500`,
        isCensored
          ? 'scale-150 opacity-30 blur-3xl grayscale'
          : 'group-hover:scale-110',
      )}
    />
  )
}

export default ProjectsGridPreviewBackground
