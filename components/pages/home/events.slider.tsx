'use client'

import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'

enum ScrollDirection {
  Left = -1,
  Right = 1,
}

const EventsSlider = () => {
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const eventsCount = 20
  const eventWidth = 150
  const eventGapWidth = 10
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(true)

  const handleScroll = (dir: ScrollDirection) => {
    const scrollArea = wrapperRef.current

    if (scrollArea) {
      const viewport = scrollArea.querySelector(
        '[data-radix-scroll-area-viewport]',
      )

      if (viewport) {
        const { scrollLeft, scrollWidth, clientWidth } = viewport

        const newScrollLeft = scrollLeft + (eventWidth + eventGapWidth) * dir

        viewport.scrollTo({
          left: newScrollLeft,
          behavior: 'smooth',
        })

        const isAtStart = newScrollLeft <= 5
        const isAtEnd = scrollWidth - newScrollLeft - clientWidth <= 5

        setCanScrollLeft(!isAtStart)
        setCanScrollRight(!isAtEnd)
      }
    }
  }

  return (
    <div className={'relative px-4'}>
      <ScrollArea
        ref={wrapperRef}
        className={'w-full'}
        style={{
          height: `${eventWidth}px`,
        }}
      >
        <div
          className={'flex items-center'}
          style={{ gap: `${eventGapWidth}px` }}
        >
          {new Array(eventsCount).fill(0).map((_, i) => (
            <Skeleton
              key={`event-${i}`}
              className="flex aspect-square items-center justify-center"
              style={{ width: `${eventWidth}px` }}
            />
          ))}
        </div>
        {/*<ScrollBar orientation={'horizontal'} />*/}
      </ScrollArea>

      <Button
        size={'icon'}
        variant={'outline'}
        className={
          'absolute top-1/2 left-5 h-fit w-fit -translate-y-1/2 p-1 transition-opacity duration-300'
        }
        onClick={() => handleScroll(ScrollDirection.Left)}
        style={{
          opacity: canScrollLeft ? 1 : 0,
        }}
      >
        <FaChevronLeft />
      </Button>

      <Button
        size={'icon'}
        variant={'outline'}
        className={
          'absolute top-1/2 right-5 h-fit w-fit -translate-y-1/2 p-1 transition-opacity duration-300'
        }
        onClick={() => handleScroll(ScrollDirection.Right)}
        style={{
          opacity: canScrollRight ? 1 : 0,
        }}
      >
        <FaChevronRight />
      </Button>
    </div>
  )
}

export default EventsSlider
