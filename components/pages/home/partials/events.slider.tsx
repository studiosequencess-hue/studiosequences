'use client'

import React from 'react'
import Image from 'next/image'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'
import { Calendar, MapPin, Ticket } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/constants'
import { getEvents } from '@/lib/actions.events'
import { CompanyEvent } from '@/lib/models'
import { format } from 'date-fns'

enum ScrollDirection {
  Left = -1,
  Right = 1,
}

type ShowScrollButtonsType = {
  left: boolean
  right: boolean
}

interface ArtEvent {
  id: number
  title: string
  date: string
  location: string
  type: string
  thumbnail: string
}

const EventsSlider = () => {
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const eventsCount = 20
  const eventWidth = 150
  const eventGapWidth = 10
  const [showScrollButtons, setShowScrollButtons] =
    React.useState<ShowScrollButtonsType>({
      left: false,
      right: false,
    })

  const eventsQuery = useQuery<CompanyEvent[]>({
    queryKey: [QUERY_KEYS.EVENTS],
    queryFn: async () => {
      const response = await getEvents()

      return response.status == 'success' ? response.data || [] : []
    },
  })

  const events = eventsQuery.data || []

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

  if (events.length == 0) return <div />

  return (
    <div className={'relative w-full p-4'}>
      <ScrollArea ref={wrapperRef} className={'w-full'}>
        <div
          className={'flex items-center overflow-x-auto'}
          style={{
            gap: `${eventGapWidth}px`,
          }}
        >
          {events.map((event) => (
            <div
              key={event.id}
              className="group w-48 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <div className="relative h-28 overflow-hidden">
                {event.background_url ? (
                  <Image
                    src={event.background_url}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className={'bg-accent-sage h-full w-full'} />
                )}
                <div className="absolute top-2 left-2">
                  <span className="rounded-md bg-white/90 px-2 py-1 text-[9px] font-bold tracking-wider text-zinc-800 uppercase backdrop-blur-sm dark:bg-black/90 dark:text-zinc-200">
                    {event.tag}
                  </span>
                </div>
              </div>

              <div className="p-3">
                <h3 className="mb-2 line-clamp-1 text-[13px] leading-tight font-bold text-zinc-900 dark:text-zinc-100">
                  {event.title}
                </h3>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 dark:text-zinc-400">
                    <Calendar size={12} className="text-blue-500" />
                    <span>{format(event.start_time, 'MM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 dark:text-zinc-400">
                    <MapPin size={12} className="text-zinc-400" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>

                <button className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg bg-zinc-100 py-1.5 text-[10px] font-bold text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700">
                  <Ticket size={12} />
                  Get Tickets
                </button>
              </div>
            </div>
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
