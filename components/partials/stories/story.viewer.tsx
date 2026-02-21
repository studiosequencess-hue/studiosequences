'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  deleteStory,
  getUserStories,
  markStoryAsViewed,
} from '@/lib/actions.stories'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import Image from 'next/image'
import { StoryWithUser } from '@/lib/models'
import UserAvatar from '@/components/partials/user-avatar'
import { getUserInitials } from '@/lib/utils'
import ReactPlayer from 'react-player'
import { ArrowLeft, ArrowRight, Trash2 } from 'lucide-react'
import { useAuthStore } from '@/store'

interface StoryViewerDialogProps {
  userId: string | null
  isOpen: boolean
  onClose: () => void
  onNextUser?: () => void
  onPrevUser?: () => void
}

const StoryViewerDialog = ({
  userId,
  isOpen,
  onClose,
  onNextUser,
  onPrevUser,
}: StoryViewerDialogProps) => {
  const { user } = useAuthStore()
  const [stories, setStories] = useState<StoryWithUser[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const progressInterval = useRef<NodeJS.Timeout | null>(null)
  const STORY_DURATION = 5000

  const currentStory = stories[currentIndex]
  const isOwner = user && user.id === currentStory?.user.id

  const loadUserStories = async () => {
    if (!userId) return

    setLoading(true)
    setError(null)

    try {
      const result = await getUserStories(userId)
      if (
        result.status === 'success' &&
        result.data &&
        result.data.length > 0
      ) {
        setStories(result.data)
        setCurrentIndex(0)
        setProgress(0)
      } else {
        setError('No stories found')
      }
    } catch (e) {
      console.error('Failed to load stories:', e)
      setError('Failed to load stories')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!currentStory || !isOwner) return

    setIsDeleting(true)
    setIsPaused(true) // Pause while deleting

    try {
      const result = await deleteStory(currentStory.id)
      if (result.status === 'success') {
        // Remove from local state
        const newStories = stories.filter((_, idx) => idx !== currentIndex)

        if (newStories.length === 0) {
          // No more stories, close dialog
          handleClose()
        } else {
          // Move to next or prev
          setStories(newStories)
          if (currentIndex >= newStories.length) {
            setCurrentIndex(newStories.length - 1)
          }
          setProgress(0)
        }
      } else {
        alert(result.message || 'Failed to delete')
      }
    } catch (e) {
      console.error('Delete error:', e)
    } finally {
      setIsDeleting(false)
      setIsPaused(false)
    }
  }

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [])

  // Load stories when userId changes
  useEffect(() => {
    if (userId && isOpen) {
      loadUserStories()
    } else {
      // Reset state when closed
      setStories([])
      setCurrentIndex(0)
      setProgress(0)
      setError(null)
    }
  }, [userId, isOpen])

  // Auto progress
  useEffect(() => {
    if (!isOpen || loading || isPaused || !currentStory || error) {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
      return
    }

    progressInterval.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext()
          return 0
        }
        return prev + 100 / (STORY_DURATION / 100)
      })
    }, 100)

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [isOpen, loading, isPaused, currentIndex, stories.length, error])

  // Mark as viewed when story changes
  useEffect(() => {
    if (currentStory && !loading && isOpen) {
      markStoryAsViewed(currentStory.id).catch(console.error)
    }
  }, [currentIndex, loading, isOpen])

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setProgress(0)
    } else if (onNextUser) {
      onNextUser()
    } else {
      handleClose()
    }
  }, [currentIndex, stories.length, onNextUser])

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
      setProgress(0)
    } else if (onPrevUser) {
      onPrevUser()
    }
  }

  const handleClose = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current)
    }
    setStories([])
    setCurrentIndex(0)
    setProgress(0)
    setError(null)
    onClose()
  }

  const handlePauseToggle = () => {
    setIsPaused((prev) => !prev)
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="h-full w-full border-none p-0 sm:rounded-none">
        <DialogTitle className={'hidden'} />
        <DialogDescription className={'hidden'} />
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        ) : error ? (
          <div className="flex h-full flex-col items-center justify-center text-white">
            <p className="mb-4 text-lg">{error}</p>
            <button
              onClick={handleClose}
              className="rounded-full bg-white/20 px-4 py-2 transition hover:bg-white/30"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="flex h-full w-full flex-col">
            {/* Progress Bars */}
            <div className="flex gap-1 p-2 pt-12">
              {stories.map((_, idx) => (
                <div
                  key={idx}
                  className="h-1 flex-1 overflow-hidden rounded-full bg-white/30"
                >
                  <div
                    className="h-full bg-white transition-all duration-100 ease-linear"
                    style={{
                      width:
                        idx < currentIndex
                          ? '100%'
                          : idx === currentIndex
                            ? `${progress}%`
                            : '0%',
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Header */}
            <div className="flex items-center justify-between p-4 pt-14 text-white">
              <div className="flex items-center gap-3">
                <UserAvatar
                  src={currentStory?.user.avatar}
                  rootClassName={'size-8'}
                  fallback={getUserInitials(
                    currentStory?.user.first_name,
                    currentStory?.user.last_name,
                    currentStory?.user.company_name,
                  )}
                  fallbackClassName={'text-xs/none'}
                />
                <div className="flex flex-col">
                  <div className="text-sm leading-tight font-semibold">
                    {currentStory?.user?.first_name ||
                      currentStory?.user?.username}
                  </div>
                  <div className="text-xs text-gray-400">
                    {currentStory?.created_at &&
                      new Date(currentStory.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div
              className="relative flex flex-1 touch-none items-center justify-center"
              onMouseDown={() => setIsPaused(true)}
              onMouseUp={() => setIsPaused(false)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
            >
              {/* Click Zones */}
              <div className="absolute inset-0 z-30 flex">
                <button
                  className="hover:bg-muted/10 flex h-full w-fit cursor-pointer items-center justify-start px-4 opacity-0 hover:opacity-100 focus:outline-none"
                  onClick={handlePrev}
                  aria-label="Previous story"
                >
                  <ArrowLeft />
                </button>
                <button
                  className="h-full grow cursor-pointer focus:outline-none"
                  onClick={handlePauseToggle}
                  aria-label={isPaused ? 'Play' : 'Pause'}
                />
                <button
                  className="hover:bg-muted/10 flex h-full w-fit cursor-pointer items-center justify-end px-4 opacity-0 hover:opacity-100 focus:outline-none"
                  onClick={handleNext}
                  aria-label="Next story"
                >
                  <ArrowRight />
                </button>
              </div>

              {/* Story Image */}
              {currentStory &&
                (currentStory.type == 'video' ? (
                  <ReactPlayer
                    playing={!isPaused}
                    src={currentStory.url}
                    width={'100%'}
                    height={'100%'}
                    autoPlay
                  />
                ) : (
                  <Image
                    src={currentStory.url}
                    alt="Story"
                    fill
                    className="object-contain"
                    priority
                    sizes="100vw"
                  />
                ))}

              {/* Pause Indicator */}
              {isPaused && (
                <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center bg-black/20">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/50">
                    <svg
                      className="h-8 w-8 fill-current text-white"
                      viewBox="0 0 24 24"
                    >
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center p-4 pb-8">
              {isOwner && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-2 rounded-full bg-red-500/80 px-6 py-2 text-white backdrop-blur-sm transition-colors hover:bg-red-600 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Trash2 size={20} />
                  )}
                  <span className="text-sm/none font-medium">Delete Story</span>
                </button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default StoryViewerDialog
