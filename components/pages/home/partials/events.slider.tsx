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

type ShowScrollButtonsType = {
  left: boolean
  right: boolean
}

const EventsSlider = () => {
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const eventsCount = 10
  const eventWidth = 150
  const eventGapWidth = 10
  const [showScrollButtons, setShowScrollButtons] =
    React.useState<ShowScrollButtonsType>({
      left: false,
      right: false,
    })

  const initScroll = () => {
    const scrollArea = wrapperRef.current

    if (scrollArea) {
      const viewport = scrollArea.querySelector(
        '[data-radix-scroll-area-viewport]',
      )

      if (viewport) {
        const { scrollLeft, scrollWidth, clientWidth } = viewport

        setShowScrollButtons({
          left: scrollLeft > 0,
          right: scrollLeft + clientWidth < scrollWidth - 1,
        })
      }
    }
  }

  const handleScroll = (dir: ScrollDirection) => {
    const scrollArea = wrapperRef.current

    if (scrollArea) {
      const viewport = scrollArea.querySelector(
        '[data-radix-scroll-area-viewport]',
      )

      if (viewport) {
        const { scrollLeft, scrollWidth, clientWidth } = viewport

        const newScrollLeft = Math.max(
          scrollLeft + (eventWidth + eventGapWidth) * dir,
          0,
        )

        viewport.scrollTo({
          left: newScrollLeft,
          behavior: 'smooth',
        })

        setShowScrollButtons({
          left: newScrollLeft > 0,
          right: newScrollLeft + clientWidth < scrollWidth - 1,
        })
      }
    }
  }

  React.useEffect(() => {
    initScroll()
  }, [])
  return (
    <div className={'relative w-full p-4'}>
      <ScrollArea ref={wrapperRef} className={'w-full'}>
        <div
          className={'flex items-center overflow-x-auto'}
          style={{
            gap: `${eventGapWidth}px`,
          }}
        >
          {new Array(eventsCount).fill(0).map((_, i) => (
            <Skeleton
              key={`event-${i}`}
              className="flex aspect-square items-center justify-center"
              style={{ width: `${eventWidth}px` }}
            />
          ))}
        </div>
      </ScrollArea>

      <Button
        size={'icon'}
        variant={'outline'}
        className={
          'absolute top-1/2 left-2 h-fit w-fit -translate-y-1/2 p-1 transition-opacity duration-300'
        }
        onClick={() => handleScroll(ScrollDirection.Left)}
        style={{
          display: showScrollButtons.left ? 'block' : 'none',
        }}
      >
        <FaChevronLeft />
      </Button>

      <Button
        size={'icon'}
        variant={'outline'}
        className={
          'absolute top-1/2 right-2 h-fit w-fit -translate-y-1/2 p-1 transition-opacity duration-300'
        }
        onClick={() => handleScroll(ScrollDirection.Right)}
        style={{
          display: showScrollButtons.right ? 'block' : 'none',
        }}
      >
        <FaChevronRight />
      </Button>
    </div>
  )
}

export default EventsSlider
