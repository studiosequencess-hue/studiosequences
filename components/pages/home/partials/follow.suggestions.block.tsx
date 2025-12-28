'use client'

import React, { useState, ReactNode } from 'react'
import {
  UserPlus,
  UserCheck,
  ExternalLink,
  Palette,
  Brush,
  Camera,
  PenTool,
} from 'lucide-react'

interface Artist {
  id: number
  name: string
  specialty: string
  avatar: string
  works: number
  isFollowing: boolean
  icon: ReactNode
}

const FollowSuggestionsBlock: React.FC = () => {
  // Mock data for art specialists
  const [suggestions, setSuggestions] = useState<Artist[]>([
    {
      id: 1,
      name: 'Elena Rostova',
      specialty: 'Oil Painter',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      works: 124,
      isFollowing: false,
      icon: <Brush size={14} />,
    },
    {
      id: 2,
      name: 'Marcus Thorne',
      specialty: 'Digital Sculptor',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      works: 89,
      isFollowing: false,
      icon: <PenTool size={14} />,
    },
    {
      id: 3,
      name: 'Sienna Chen',
      specialty: 'Fine Art Photographer',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      works: 215,
      isFollowing: false,
      icon: <Camera size={14} />,
    },
    {
      id: 4,
      name: 'Julian Vane',
      specialty: 'Abstract Muralist',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      works: 56,
      isFollowing: false,
      icon: <Palette size={14} />,
    },
  ])

  const toggleFollow = (id: number): void => {
    setSuggestions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFollowing: !item.isFollowing } : item,
      ),
    )
  }

  /**
   * Layout Logic:
   * To show exactly 2.5 items, we calculate the height based on the item padding/content.
   * Standard item height with these Tailwind classes is ~80px.
   * 80px * 2.5 = 200px.
   */

  return (
    <div className="mx-auto max-w-sm overflow-hidden rounded-sm border border-zinc-200 bg-white font-sans shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {/* List Container with fixed height to show 2.5 items */}
      <div
        className="divide-y divide-zinc-100 overflow-y-auto dark:divide-zinc-800"
        style={{ height: '200px' }}
      >
        {suggestions.map((artist) => (
          <div
            key={artist.id}
            className="group flex h-[80px] items-center justify-between p-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
          >
            <div className="flex items-center gap-3">
              {/* Avatar with status ring */}
              <div className="relative flex-shrink-0">
                <img
                  src={artist.avatar}
                  alt={artist.name}
                  className="h-11 w-11 rounded-full object-cover grayscale-[30%] transition-all duration-300 group-hover:grayscale-0"
                />
                <div className="absolute -right-1 -bottom-1 rounded-full border border-zinc-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-900">
                  <div className="text-zinc-500 dark:text-zinc-400">
                    {artist.icon}
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="min-w-0">
                <h3 className="flex items-center gap-1 truncate text-sm leading-tight font-bold text-zinc-900 dark:text-zinc-100">
                  {artist.name}
                  <ExternalLink
                    size={12}
                    className="flex-shrink-0 cursor-pointer opacity-0 transition-opacity group-hover:opacity-40"
                  />
                </h3>
                <p className="mb-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {artist.specialty}
                </p>
                <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 uppercase dark:bg-zinc-800 dark:text-zinc-500">
                  {artist.works} Works
                </span>
              </div>
            </div>

            {/* Follow Button */}
            <button
              onClick={() => toggleFollow(artist.id)}
              className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
                artist.isFollowing
                  ? 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'
                  : 'bg-zinc-900 text-white hover:scale-105 active:scale-95 dark:bg-zinc-100 dark:text-zinc-900'
              }`}
              aria-label={artist.isFollowing ? 'Unfollow' : 'Follow'}
            >
              {artist.isFollowing ? (
                <UserCheck size={16} />
              ) : (
                <UserPlus size={16} />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FollowSuggestionsBlock
