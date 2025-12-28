'use client'

import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'
import { Plus } from 'lucide-react'

interface Story {
  id: number
  name: string
  avatar: string
  isUnread: boolean
  isUser?: boolean
}

enum ScrollDirection {
  Left = -1,
  Right = 1,
}

type ShowScrollButtonsType = {
  left: boolean
  right: boolean
}

const StoriesSlider = () => {
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const eventsCount = 20
  const eventWidth = 60
  const eventGapWidth = 10
  const [showScrollButtons, setShowScrollButtons] =
    React.useState<ShowScrollButtonsType>({
      left: false,
      right: false,
    })

  const stories: Story[] = [
    {
      id: 0,
      name: 'Your Story',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
      isUnread: false,
      isUser: true,
    },
    {
      id: 1,
      name: 'Elena.Art',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      isUnread: true,
    },
    {
      id: 2,
      name: 'Marcus_V',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      isUnread: true,
    },
    {
      id: 3,
      name: 'Sienna_Fine',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      isUnread: true,
    },
    {
      id: 4,
      name: 'Julian.M',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      isUnread: false,
    },
    {
      id: 5,
      name: 'Studio_K',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      isUnread: true,
    },
    {
      id: 6,
      name: 'Aura_Paint',
      avatar:
        'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150&h=150&fit=crop',
      isUnread: true,
    },
    {
      id: 7,
      name: 'Loom.Art',
      avatar:
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop',
      isUnread: true,
    },
    {
      id: 8,
      name: 'Vivid_Ink',
      avatar:
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop',
      isUnread: false,
    },
    {
      id: 9,
      name: 'Clay_Master',
      avatar:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
      isUnread: true,
    },
    {
      id: 10,
      name: 'Pixel_Chef',
      avatar:
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop',
      isUnread: true,
    },
    {
      id: 11,
      name: 'Bronze_Age',
      avatar:
        'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=150&h=150&fit=crop',
      isUnread: false,
    },
    {
      id: 12,
      name: 'Easel_East',
      avatar:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop',
      isUnread: true,
    },
    {
      id: 13,
      name: 'Ink.Flow',
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
      isUnread: true,
    },
    {
      id: 14,
      name: 'Urban_Sketch',
      avatar:
        'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop',
      isUnread: true,
    },
    {
      id: 15,
      name: 'Canvas_Co',
      avatar:
        'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&h=150&fit=crop',
      isUnread: false,
    },
    {
      id: 16,
      name: 'Glaze_Gal',
      avatar:
        'https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?w=150&h=150&fit=crop',
      isUnread: true,
    },
    {
      id: 17,
      name: 'Abstract.H',
      avatar:
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=150&h=150&fit=crop',
      isUnread: true,
    },
    {
      id: 18,
      name: 'Portrait_P',
      avatar:
        'https://images.unsplash.com/photo-1502767089025-6572583495f3?w=150&h=150&fit=crop',
      isUnread: true,
    },
    {
      id: 19,
      name: 'Final_Fix',
      avatar:
        'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop',
      isUnread: false,
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
          className={'flex items-center'}
          style={{
            gap: `${eventGapWidth}px`,
          }}
        >
          {stories.map((story) => (
            <div
              key={story.id}
              className="group flex flex-shrink-0 cursor-pointer flex-col items-center gap-1"
            >
              <div className="relative">
                <div
                  className={`rounded-full p-[2px] ${
                    story.isUnread
                      ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600'
                      : 'border border-zinc-200 dark:border-zinc-800'
                  }`}
                >
                  <div className="rounded-full bg-white p-[2px] dark:bg-black">
                    <img
                      src={story.avatar}
                      alt={story.name}
                      className="h-14 w-14 rounded-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                </div>
                {story.isUser && (
                  <div className="absolute right-0 bottom-0 rounded-full border-2 border-white bg-blue-500 p-0.5 text-white dark:border-black">
                    <Plus size={12} strokeWidth={3} />
                  </div>
                )}
              </div>
              <span className="max-w-[64px] truncate text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                {story.name}
              </span>
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

export default StoriesSlider
