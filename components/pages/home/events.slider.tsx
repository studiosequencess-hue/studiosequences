import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

const EventsSlider = () => {
  return (
    <div className={'px-4'}>
      <ScrollArea className={'h-44 w-full'}>
        <div className={'flex items-center gap-4'}>
          {new Array(10).fill(0).map((_, i) => (
            <Skeleton key={`event-${i}`} className="aspect-square h-40" />
          ))}
        </div>

        <ScrollBar orientation={'horizontal'} />
      </ScrollArea>
    </div>
  )
}

export default EventsSlider
