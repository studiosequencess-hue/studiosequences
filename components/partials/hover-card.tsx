import React from 'react'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { cn } from '@/lib/utils'

type HoverTriggerProps = React.ComponentProps<typeof HoverCardTrigger>
type HoverContentProps = React.ComponentProps<typeof HoverCardContent>

type Props = {
  trigger: React.ReactNode
  content: React.ReactNode
  triggerClassName?: string
  contentClassName?: string
  triggerProps?: Omit<HoverTriggerProps, 'children'>
  contentProps?: Omit<HoverContentProps, 'children'>
}

const HoverComponent: React.FC<Props> = (props) => {
  return (
    <HoverCard>
      <HoverCardTrigger
        className={cn(
          'flex cursor-pointer items-center justify-center text-sm/none',
          props.triggerClassName,
        )}
        {...props.triggerProps}
      >
        {props.trigger}
      </HoverCardTrigger>
      <HoverCardContent
        className={cn('h-fit w-fit p-2 text-xs/none', props.contentClassName)}
        align={'center'}
        side={'top'}
        sideOffset={5}
        {...props.contentProps}
      >
        {props.content}
      </HoverCardContent>
    </HoverCard>
  )
}

export default HoverComponent
