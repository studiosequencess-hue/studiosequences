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
import { UserInfo } from '@/lib/models'
import { getUserFullName } from '@/lib/utils'

const FollowSuggestionsBlock: React.FC = () => {
  const [suggestions, setSuggestions] = useState<UserInfo[]>([])

  const toggleFollow = (id: number): void => {
    // setSuggestions((prev) =>
    //   prev.map((item) =>
    //     item.id === id ? { ...item, isFollowing: !item.isFollowing } : item,
    //   ),
    // )
  }

  return (
    <div className="max-w-sm overflow-hidden rounded-lg border border-zinc-200 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div
        className="divide-y divide-zinc-100 overflow-y-auto dark:divide-zinc-800"
        style={{ height: '200px' }}
      >
        {suggestions.map((user) => (
          <div
            key={user.id}
            className="group flex h-[80px] items-center justify-between p-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
          >
            <div className="flex items-center gap-3">
              {/* Avatar with status ring */}
              <div className="relative flex-shrink-0">
                <img
                  src={user.avatar}
                  alt={getUserFullName(user)}
                  className="h-11 w-11 rounded-full object-cover grayscale-[30%] transition-all duration-300 group-hover:grayscale-0"
                />
                <div className="absolute -right-1 -bottom-1 rounded-full border border-zinc-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-900">
                  <div className="text-zinc-500 dark:text-zinc-400">
                    {user.icon}
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="min-w-0">
                <h3 className="flex items-center gap-1 truncate text-sm leading-tight font-bold text-zinc-900 dark:text-zinc-100">
                  {user.name}
                  <ExternalLink
                    size={12}
                    className="flex-shrink-0 cursor-pointer opacity-0 transition-opacity group-hover:opacity-40"
                  />
                </h3>
                <p className="mb-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {user.specialty}
                </p>
                <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 uppercase dark:bg-zinc-800 dark:text-zinc-500">
                  {user.works} Works
                </span>
              </div>
            </div>

            {/* Follow Button */}
            <button
              onClick={() => toggleFollow(user.id)}
              className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
                user.isFollowing
                  ? 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'
                  : 'bg-zinc-900 text-white hover:scale-105 active:scale-95 dark:bg-zinc-100 dark:text-zinc-900'
              }`}
              aria-label={user.isFollowing ? 'Unfollow' : 'Follow'}
            >
              {user.isFollowing ? (
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
