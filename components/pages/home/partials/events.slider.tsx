'use client'

import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'
import { Calendar, MapPin, Ticket } from 'lucide-react'

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

  const events: ArtEvent[] = [
    {
      id: 1,
      title: 'Neon Surrealism Workshop',
      date: 'Jan 15',
      location: 'London',
      type: 'Masterclass',
      thumbnail:
        'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=300&h=200&fit=crop',
    },
    {
      id: 2,
      title: 'Contemporary Fair 2026',
      date: 'Feb 02',
      location: 'New York',
      type: 'Exhibition',
      thumbnail:
        'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300&h=200&fit=crop',
    },
    {
      id: 3,
      title: 'Digital Sculpture Summit',
      date: 'Mar 10',
      location: 'Berlin',
      type: 'Conference',
      thumbnail:
        'https://images.unsplash.com/photo-1554188248-986adbb73be4?w=300&h=200&fit=crop',
    },
    {
      id: 4,
      title: 'Oil Portraits Live',
      date: 'Jan 20',
      location: 'Paris',
      type: 'Live Demo',
      thumbnail:
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300&h=200&fit=crop',
    },
    {
      id: 5,
      title: 'Abstract Flow Gala',
      date: 'Feb 14',
      location: 'Milan',
      type: 'Gala',
      thumbnail:
        'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=300&h=200&fit=crop',
    },
    {
      id: 6,
      title: 'Sculpting the Future',
      date: 'Mar 05',
      location: 'Tokyo',
      type: 'Symposium',
      thumbnail:
        'https://images.unsplash.com/photo-1551732998-9573f695fdbb?w=300&h=200&fit=crop',
    },
    {
      id: 7,
      title: 'Graffiti Heritage Tour',
      date: 'Jan 28',
      location: 'Bristol',
      type: 'Tour',
      thumbnail:
        'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=300&h=200&fit=crop',
    },
    {
      id: 8,
      title: 'Minimalist Expo',
      date: 'Feb 20',
      location: 'Oslo',
      type: 'Exhibition',
      thumbnail:
        'https://images.unsplash.com/photo-1518998053574-53f0201f97ea?w=300&h=200&fit=crop',
    },
    {
      id: 9,
      title: 'VR Art Experience',
      date: 'Mar 12',
      location: 'Seoul',
      type: 'Tech Expo',
      thumbnail:
        'https://images.unsplash.com/photo-1592477130065-2217a5a8720f?w=300&h=200&fit=crop',
    },
    {
      id: 10,
      title: 'The Ceramic Studio',
      date: 'Jan 12',
      location: 'Kyoto',
      type: 'Workshop',
      thumbnail:
        'https://images.unsplash.com/photo-1565191999001-551c187427bb?w=300&h=200&fit=crop',
    },
    {
      id: 11,
      title: 'Modernist Rebirth',
      date: 'Feb 10',
      location: 'Chicago',
      type: 'Talk',
      thumbnail:
        'https://images.unsplash.com/photo-1501472312651-726afe119ff1?w=300&h=200&fit=crop',
    },
    {
      id: 12,
      title: 'Water Color Weekend',
      date: 'Mar 20',
      location: 'Venice',
      type: 'Retreat',
      thumbnail:
        'https://images.unsplash.com/photo-1520038410233-7141be7e6f97?w=300&h=200&fit=crop',
    },
    {
      id: 13,
      title: 'Ink & Calligraphy',
      date: 'Jan 30',
      location: 'Shanghai',
      type: 'Masterclass',
      thumbnail:
        'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=300&h=200&fit=crop',
    },
    {
      id: 14,
      title: 'Kinetic Motion Art',
      date: 'Feb 25',
      location: 'Bilbao',
      type: 'Installation',
      thumbnail:
        'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=300&h=200&fit=crop',
    },
    {
      id: 15,
      title: 'Photography Awards',
      date: 'Mar 28',
      location: 'Los Angeles',
      type: 'Awards',
      thumbnail:
        'https://images.unsplash.com/photo-1452784444945-3f422708fe5e?w=300&h=200&fit=crop',
    },
    {
      id: 16,
      title: 'Renaissance Revisited',
      date: 'Jan 18',
      location: 'Florence',
      type: 'Lecture',
      thumbnail:
        'https://images.unsplash.com/photo-1549490349-8643362247b5?w=300&h=200&fit=crop',
    },
    {
      id: 17,
      title: 'Street Art Festival',
      date: 'Feb 28',
      location: 'Melbourne',
      type: 'Festival',
      thumbnail:
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=200&fit=crop',
    },
    {
      id: 18,
      title: 'Lithography 101',
      date: 'Mar 15',
      location: 'Amsterdam',
      type: 'Workshop',
      thumbnail:
        'https://images.unsplash.com/photo-1508833940372-7ecbb26d2d79?w=300&h=200&fit=crop',
    },
    {
      id: 19,
      title: 'Gothic Arch. Study',
      date: 'Jan 22',
      location: 'Prague',
      type: 'Study',
      thumbnail:
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=200&fit=crop',
    },
    {
      id: 20,
      title: 'Final Winter Auction',
      date: 'Feb 15',
      location: 'Geneva',
      type: 'Auction',
      thumbnail:
        'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=300&h=200&fit=crop',
    },
  ]

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
          {events.map((event) => (
            <div
              key={event.id}
              className="group w-48 flex-shrink-0 cursor-pointer overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <div className="relative h-28 overflow-hidden">
                <img
                  src={event.thumbnail}
                  alt={event.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-2 left-2">
                  <span className="rounded-md bg-white/90 px-2 py-1 text-[9px] font-bold tracking-wider text-zinc-800 uppercase backdrop-blur-sm dark:bg-black/90 dark:text-zinc-200">
                    {event.type}
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
                    <span>{event.date}</span>
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
