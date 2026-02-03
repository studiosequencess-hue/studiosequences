import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

type AvatarProps = React.ComponentProps<typeof Avatar>
type AvatarImageProps = React.ComponentProps<typeof AvatarImage>
type AvatarFallbackProps = React.ComponentProps<typeof AvatarFallback>

type Props = {
  src?: AvatarImageProps['src'] | null
  alt?: AvatarImageProps['alt']
  fallback?: AvatarFallbackProps['children']
  rootClassName?: AvatarProps['className']
  imageClassName?: AvatarImageProps['className']
  fallbackClassName?: AvatarFallbackProps['className']
}

const UserAvatar: React.FC<Props> = (props) => {
  return (
    <Avatar className={cn(props.rootClassName)}>
      <AvatarImage
        src={props.src || ''}
        alt={props.alt}
        className={cn(props.imageClassName)}
      />
      <AvatarFallback className={cn(props.fallbackClassName)}>
        {props.fallback || 'P'}
      </AvatarFallback>
    </Avatar>
  )
}

export default UserAvatar
