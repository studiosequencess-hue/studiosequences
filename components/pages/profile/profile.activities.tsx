'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import {
  Heart,
  MessageCircle,
  Share2,
  UserPlus,
  Palette,
  Image as ImageIcon,
  MoreHorizontal,
  Search,
} from 'lucide-react'

interface User {
  name: string
  handle: string
  avatar: string
}

interface Activity {
  id: number
  user: User
  type: 'posted_artwork' | 'started_following' | 'liked_artwork' | 'commented'
  target: string
  timestamp: string
  content: string | null
  previewImg: string | null
  stats: {
    likes: number
    comments: number
    shares: number
  }
}

const ProfileActivities: React.FC = () => {
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [startY, setStartY] = useState<number>(0)
  const [thumbHeight, setThumbHeight] = useState<number>(0)
  const [thumbTop, setThumbTop] = useState<number>(0)

  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const thumbRef = useRef<HTMLDivElement | null>(null)

  // Generate 20 dummy activities
  const activities = useMemo<Activity[]>(() => {
    const types: Activity['type'][] = [
      'posted_artwork',
      'started_following',
      'liked_artwork',
      'commented',
    ]

    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      user: {
        name: ['Elena Rossi', 'Marcus Thorne', 'Saki Tanaka', 'Julian Vane'][
          i % 4
        ],
        handle: `@artist_${i + 100}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`,
      },
      type: types[i % types.length],
      target: i % 2 === 0 ? 'Midnight Serenity' : 'The Urban Pulse',
      timestamp: `${i + 1}h ago`,
      content:
        i % 4 === 0
          ? 'Just finished this new piece for the upcoming gallery exhibition! #ArtLife #Process'
          : null,
      previewImg:
        i % 2 === 0 ? `https://picsum.photos/seed/${i + 50}/600/400` : null,
      stats: { likes: 124 + i, comments: 12 + i, shares: 5 + i },
    }))
  }, [])

  // Custom Scrollbar Logic
  const updateScrollThumb = (): void => {
    const container = scrollContainerRef.current
    if (container) {
      const ratio = container.clientHeight / container.scrollHeight
      const top =
        (container.scrollTop / container.scrollHeight) * container.clientHeight
      setThumbHeight(ratio * container.clientHeight)
      setThumbTop(top)
    }
  }

  useEffect(() => {
    updateScrollThumb()
    window.addEventListener('resize', updateScrollThumb)
    return () => window.removeEventListener('resize', updateScrollThumb)
  }, [])

  const handleScroll = (): void => {
    updateScrollThumb()
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
    setIsDragging(true)
    setStartY(e.pageY - thumbTop)
    document.body.style.userSelect = 'none'
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent): void => {
      if (!isDragging || !scrollContainerRef.current) return

      const container = scrollContainerRef.current
      const trackHeight = container.clientHeight
      const scrollHeight = container.scrollHeight

      let newThumbTop = e.pageY - startY
      newThumbTop = Math.max(
        0,
        Math.min(newThumbTop, trackHeight - thumbHeight),
      )

      const scrollRatio = newThumbTop / trackHeight
      container.scrollTop = scrollRatio * scrollHeight
    }

    const handleMouseUp = (): void => {
      setIsDragging(false)
      document.body.style.userSelect = ''
    }

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, startY, thumbHeight])

  return (
    <div className="bg-background text-foreground flex min-h-screen justify-center p-4 font-sans md:p-8">
      <div className="flex h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 shadow-xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 p-4">
          <div>
            <h1 className="text-xl font-bold">Activity Feed</h1>
            <p className="text-xs">Updates from your art network</p>
          </div>
          <button className="rounded-full p-2 transition-colors">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>

        {/* Main Content Area with Custom Scrollbar */}
        <div className="group relative flex-1 overflow-hidden">
          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="no-scrollbar h-full overflow-y-scroll"
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            <div className="space-y-6 p-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="rounded-xl border border-slate-100 transition-all duration-300 hover:border-indigo-100"
                >
                  {/* Activity Header */}
                  <div className="flex items-start gap-3 p-4">
                    <img
                      src={activity.user.avatar}
                      alt={activity.user.name}
                      className="h-10 w-10 rounded-full border border-slate-200"
                    />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="cursor-pointer font-bold">
                          {activity.user.name}
                        </span>
                        <span className="text-sm">
                          {activity.type === 'posted_artwork' &&
                            'uploaded new artwork'}
                          {activity.type === 'started_following' &&
                            'started following a new artist'}
                          {activity.type === 'liked_artwork' &&
                            'liked an artwork'}
                          {activity.type === 'commented' &&
                            'commented on a post'}
                        </span>
                      </div>
                      <span className="block text-xs">
                        {activity.timestamp}
                      </span>
                    </div>
                  </div>

                  {/* Activity Body */}
                  <div className="px-4 pb-2">
                    {activity.content && (
                      <p className="mb-3 text-sm leading-relaxed">
                        {activity.content}
                      </p>
                    )}

                    {activity.previewImg ? (
                      <div className="group/img relative cursor-pointer overflow-hidden rounded-lg border border-slate-200">
                        <img
                          src={activity.previewImg}
                          alt="Art Preview"
                          className="h-64 w-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 transition-colors group-hover/img:bg-black/10" />
                      </div>
                    ) : activity.type === 'started_following' ? (
                      <div className="flex items-center justify-between rounded-lg border border-dashed border-slate-300 p-4">
                        <div className="flex items-center gap-2">
                          <UserPlus className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            New Connection
                          </span>
                        </div>
                        <button className="border-accent-blue rounded-full border px-3 py-1 text-xs font-bold">
                          View Profile
                        </button>
                      </div>
                    ) : null}
                  </div>

                  {/* Activity Footer */}
                  <div className="flex items-center gap-4 border-t border-slate-50 p-3">
                    <button className="flex items-center gap-1.5 text-sm transition-colors hover:text-rose-500">
                      <Heart className="h-4 w-4" />
                      <span>{activity.stats.likes}</span>
                    </button>
                    <button className="hover:text-accent-blue flex items-center gap-1.5 text-sm transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      <span>{activity.stats.comments}</span>
                    </button>
                    <button className="ml-auto flex items-center gap-1.5 text-sm transition-colors hover:text-emerald-500">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Scrollbar Track */}
          <div
            className={`absolute top-1 right-1 bottom-1 w-2 rounded-full transition-opacity duration-300 ${isDragging ? 'bg-slate-200/50 opacity-100' : 'bg-transparent opacity-0 group-hover:opacity-100 hover:bg-slate-200/30'}`}
          >
            {/* Custom Scrollbar Thumb */}
            <div
              ref={thumbRef}
              onMouseDown={handleMouseDown}
              className="absolute w-full cursor-grab rounded-full bg-slate-400/60 transition-colors hover:bg-indigo-400/80 active:cursor-grabbing"
              style={{
                height: `${thumbHeight}px`,
                top: `${thumbTop}px`,
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default ProfileActivities
