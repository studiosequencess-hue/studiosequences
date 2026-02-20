'use client'

import React from 'react'
import Head from 'next/head'
import {
  Plus,
  X,
  Heart,
  Send,
  MoreHorizontal,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'

// --- Types ---

type User = {
  id: string
  name: string
  handle: string
  avatar: string
}

type Story = {
  id: string
  userId: string
  imageUrl: string
  timestamp: string
  viewed: boolean
}

// --- Mock Data ---

const CURRENT_USER: User = {
  id: 'me',
  name: 'You',
  handle: '@current_user',
  avatar:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
}

const USERS: User[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    handle: '@sarahj',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&h=256&q=80',
  },
  {
    id: '2',
    name: 'David Chen',
    handle: '@dchen',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    handle: '@elena_r',
    avatar:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=256&h=256&q=80',
  },
  {
    id: '4',
    name: 'Marcus Johnson',
    handle: '@mjohnson',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
  },
  {
    id: '5',
    name: 'Tech Insider',
    handle: '@tech_daily',
    avatar:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=256&h=256&q=80',
  },
]

const INITIAL_STORIES: Story[] = [
  {
    id: 's1',
    userId: '1',
    imageUrl:
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80',
    timestamp: '2h',
    viewed: false,
  },
  {
    id: 's2',
    userId: '2',
    imageUrl:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    timestamp: '4h',
    viewed: false,
  },
  {
    id: 's3',
    userId: '1',
    imageUrl:
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
    timestamp: '5h',
    viewed: false,
  }, // Sarah has 2 stories
  {
    id: 's4',
    userId: '3',
    imageUrl:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    timestamp: '8h',
    viewed: true,
  },
  {
    id: 's5',
    userId: '4',
    imageUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    timestamp: '12h',
    viewed: false,
  },
]

// --- Helper Components ---

const StoryRing = ({
  user,
  hasUnseen,
  onClick,
  isUser,
}: {
  user: User
  hasUnseen: boolean
  onClick: () => void
  isUser?: boolean
}) => {
  return (
    <div
      className="flex min-w-[72px] cursor-pointer flex-col items-center space-y-1"
      onClick={onClick}
    >
      <div
        className={`relative rounded-full p-[2px] ${hasUnseen ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500' : 'bg-gray-200 dark:bg-gray-800'}`}
      >
        <div className="rounded-full bg-white p-[2px] dark:bg-black">
          <Avatar className="h-16 w-16 border-2 border-white dark:border-black">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
        </div>
        {isUser && (
          <div className="absolute right-0 bottom-0 rounded-full border-2 border-white bg-blue-500 p-1 text-white dark:border-black">
            <Plus size={12} strokeWidth={3} />
          </div>
        )}
      </div>
      <span className="w-16 truncate text-center text-xs font-medium text-gray-900 dark:text-gray-100">
        {isUser ? 'Your Story' : user.name}
      </span>
    </div>
  )
}

// --- Main Application ---

export default function InstagramStories() {
  const [stories, setStories] = React.useState<Story[]>(INITIAL_STORIES)
  const [activeUserId, setActiveUserId] = React.useState<string | null>(null)
  const [activeStoryIndex, setActiveStoryIndex] = React.useState(0)
  const [isPaused, setIsPaused] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [isUploadOpen, setIsUploadOpen] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)

  // Filter users who have stories
  const usersWithStories = USERS.filter((u) =>
    stories.some((s) => s.userId === u.id),
  )
  const hasCurrentUserStory = stories.some((s) => s.userId === 'me')

  // Group stories by user
  const groupedStories = usersWithStories.map((user) => ({
    user,
    items: stories.filter((s) => s.userId === user.id),
  }))

  // Active Story Data
  const activeGroup = activeUserId
    ? groupedStories.find((g) => g.user.id === activeUserId)
    : null
  const currentStory = activeGroup ? activeGroup.items[activeStoryIndex] : null

  // --- Story Viewer Logic ---

  const STORY_DURATION = 5000 // 5 seconds per story

  const closeViewer = () => {
    setActiveUserId(null)
    setActiveStoryIndex(0)
    setProgress(0)
    // Mark as viewed (Simulation)
    if (currentStory) {
      setStories((prev) =>
        prev.map((s) =>
          s.id === currentStory.id ? { ...s, viewed: true } : s,
        ),
      )
    }
  }

  const handleNext = React.useCallback(() => {
    if (!activeGroup) return

    if (activeStoryIndex < activeGroup.items.length - 1) {
      setActiveStoryIndex((prev) => prev + 1)
      setProgress(0)
    } else {
      // Move to next user or close
      const currentGroupIndex = groupedStories.findIndex(
        (g) => g.user.id === activeUserId,
      )
      if (currentGroupIndex < groupedStories.length - 1) {
        setActiveUserId(groupedStories[currentGroupIndex + 1].user.id)
        setActiveStoryIndex(0)
        setProgress(0)
      } else {
        closeViewer()
      }
    }
  }, [activeGroup, activeStoryIndex, activeUserId, groupedStories, closeViewer])

  const handlePrev = () => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex((prev) => prev - 1)
      setProgress(0)
    } else {
      // Move to prev user
      const currentGroupIndex = groupedStories.findIndex(
        (g) => g.user.id === activeUserId,
      )
      if (currentGroupIndex > 0) {
        const prevGroup = groupedStories[currentGroupIndex - 1]
        setActiveUserId(prevGroup.user.id)
        setActiveStoryIndex(prevGroup.items.length - 1)
        setProgress(0)
      }
    }
  }

  const handleUpload = () => {
    setIsUploading(true)
    setTimeout(() => {
      const newStory: Story = {
        id: `new-${Date.now()}`,
        userId: 'me',
        imageUrl:
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80', // Random abstract art for demo
        timestamp: 'Just now',
        viewed: false,
      }
      setStories([newStory, ...stories])
      setIsUploading(false)
      setIsUploadOpen(false)
    }, 1500)
  }

  React.useEffect(() => {
    if (!activeUserId || isPaused) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext()
          return 0
        }
        return prev + 100 / (STORY_DURATION / 100) // Update every 100ms
      })
    }, 100)

    return () => clearInterval(interval)
  }, [activeUserId, activeStoryIndex, isPaused])

  // --- Render ---

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-pink-500 selection:text-white dark:bg-black dark:text-white">
      <Head>
        <title>InstaStories Clone</title>
      </Head>

      {/* Mobile Container Simulation */}
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col overflow-hidden bg-white shadow-2xl dark:bg-black">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-white/80 px-4 py-3 backdrop-blur-md dark:border-gray-800 dark:bg-black/80">
          <h1 className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-xl font-bold text-transparent">
            Storygram
          </h1>
          <div className="flex space-x-4">
            <Send className="h-6 w-6 rotate-12" />
          </div>
        </header>

        {/* Stories Rail */}
        <div className="border-b py-4 dark:border-gray-800">
          <div className="scrollbar-hide flex space-x-4 overflow-x-auto px-4 pb-2">
            {/* My Story (Add/Create) */}
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <div>
                  <StoryRing
                    user={CURRENT_USER}
                    hasUnseen={!hasCurrentUserStory}
                    isUser={true}
                    onClick={() =>
                      !hasCurrentUserStory
                        ? setIsUploadOpen(true)
                        : setActiveUserId('me')
                    }
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="border-none bg-white sm:max-w-md dark:bg-zinc-900">
                <DialogHeader>
                  <DialogTitle className="text-center text-lg font-semibold">
                    Create Story
                  </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center space-y-4 py-8">
                  <div className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-100 dark:border-zinc-600 dark:bg-zinc-800">
                    <ImageIcon className="h-10 w-10 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">
                    Drag photos here or click to upload
                  </p>
                  <div className="flex w-full gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsUploadOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 bg-blue-500 text-white hover:bg-blue-600"
                      onClick={handleUpload}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Share Story'
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Other Stories */}
            {groupedStories.map((group) => (
              <StoryRing
                key={group.user.id}
                user={group.user}
                hasUnseen={group.items.some((s) => !s.viewed)}
                onClick={() => {
                  setActiveUserId(group.user.id)
                  setActiveStoryIndex(0)
                  setProgress(0)
                }}
              />
            ))}
          </div>
        </div>

        {/* Feed Placeholder (To give context) */}
        <div className="flex-1 space-y-6 p-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                <div className="h-3 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              </div>
              <div className="h-64 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
            </div>
          ))}
        </div>

        {/* --- FULL SCREEN STORY VIEWER OVERLAY --- */}
        <AnimatePresence>
          {activeUserId && currentStory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex flex-col bg-black"
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <img
                  src={currentStory.imageUrl}
                  alt="Story"
                  className="h-full w-full object-cover opacity-90"
                />
                {/* Dark Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40" />
              </div>

              {/* Header / Progress Bars */}
              <div className="relative z-10 flex w-full flex-col px-2 pt-12">
                {/* Progress Segments */}
                <div className="mb-4 flex w-full space-x-1">
                  {activeGroup?.items.map((story, idx) => (
                    <div
                      key={story.id}
                      className="h-1 flex-1 overflow-hidden rounded-full bg-gray-600/50"
                    >
                      <div
                        className="h-full bg-white transition-all duration-100 ease-linear"
                        style={{
                          width: `${idx < activeStoryIndex ? 100 : idx === activeStoryIndex ? progress : 0}%`,
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* User Info & Close */}
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8 border border-white/50">
                      <AvatarImage src={activeGroup?.user.avatar} />
                      <AvatarFallback>
                        {activeGroup?.user.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white drop-shadow-md">
                        {activeGroup?.user.name}
                      </span>
                      <span className="text-xs text-white/80 drop-shadow-md">
                        {currentStory.timestamp}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MoreHorizontal className="h-6 w-6 text-white drop-shadow-md" />
                    <button
                      onClick={closeViewer}
                      className="rounded-full bg-black/20 p-1 text-white drop-shadow-md"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Interaction Zones (Invisible Click Areas) */}
              <div
                className="absolute inset-0 z-20 flex"
                onMouseDown={() => setIsPaused(true)}
                onMouseUp={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
              >
                <div
                  className="h-full w-1/3"
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePrev()
                  }}
                />
                <div className="h-full w-1/3" /> {/* Middle pause zone */}
                <div
                  className="h-full w-1/3"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNext()
                  }}
                />
              </div>

              {/* Footer / Input */}
              <div className="relative z-30 mt-auto flex items-center space-x-4 px-4 pb-8">
                <div className="relative flex-1">
                  <Input
                    placeholder="Send message..."
                    className="rounded-full border-white/30 bg-transparent pr-10 text-white placeholder:text-white/60 focus-visible:ring-white/50"
                  />
                  <Heart className="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 cursor-pointer text-white/80 transition-colors hover:fill-red-500 hover:text-red-500" />
                </div>
                <button className="p-2 text-white">
                  <Send className="h-6 w-6 -rotate-45" />
                </button>
              </div>

              {/* Pause Indicator */}
              {isPaused && (
                <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                  <div className="rounded-full bg-black/50 p-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
