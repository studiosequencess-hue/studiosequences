'use client'

import { useEffect, useState } from 'react'
import { getStoriesFeed, getMyStories } from '@/lib/actions.stories'
import StoryViewerDialog from '@/components/partials/stories/story.viewer'
import StoryCreator from '@/components/partials/stories/story.creator'
import { Plus } from 'lucide-react'
import { Story, StoryWithUser } from '@/lib/models'
import UserAvatar from '@/components/partials/user-avatar'
import { FaUser } from 'react-icons/fa6'
import { getUserInitials } from '@/lib/utils'
import { useAuthStore } from '@/store'

export function StoryRing() {
  const { user } = useAuthStore()
  const [stories, setStories] = useState<StoryWithUser[]>([])
  const [myStories, setMyStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreator, setShowCreator] = useState(false)

  // Dialog state
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)

  const loadStories = async () => {
    try {
      const [feed, mine] = await Promise.all([getStoriesFeed(), getMyStories()])
      if (feed.status === 'success') setStories(feed.data || [])
      if (mine.status === 'success') setMyStories(mine.data || [])
    } catch (error) {
      console.error('Failed to load stories:', error)
    } finally {
      setLoading(false)
    }
  }

  const openViewer = (userId: string, index: number) => {
    setSelectedUserId(userId)
    setSelectedIndex(index)
    setIsViewerOpen(true)
  }

  const handleCloseViewer = () => {
    setIsViewerOpen(false)
    setSelectedUserId(null)
    setSelectedIndex(-1)
    // Refresh to update seen status
    loadStories()
  }

  const handleNextUser = () => {
    if (selectedIndex < stories.length - 1) {
      const nextIndex = selectedIndex + 1
      const nextUser = stories[nextIndex]
      setSelectedIndex(nextIndex)
      setSelectedUserId(nextUser.user.id)
    } else {
      handleCloseViewer()
    }
  }

  const handlePrevUser = () => {
    if (selectedIndex > 0) {
      const prevIndex = selectedIndex - 1
      const prevUser = stories[prevIndex]
      setSelectedIndex(prevIndex)
      setSelectedUserId(prevUser.user.id)
    }
  }

  useEffect(() => {
    loadStories()
  }, [])

  if (loading) {
    return (
      <div className="scrollbar-hide flex gap-4 overflow-x-auto border-b px-4 py-3">
        {new Array(10).fill(0).map((_, i) => (
          <div
            key={i}
            className="flex min-w-[72px] animate-pulse flex-col items-center gap-1"
          >
            <div className="h-16 w-16 rounded-full bg-gray-200" />
            <div className="h-3 w-12 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="scrollbar-hide flex gap-4 overflow-x-auto border-b px-4 py-3">
        {/* YOUR STORY */}
        <div className="flex min-w-[72px] flex-col items-center gap-1">
          <div
            className="group relative cursor-pointer"
            onClick={() =>
              myStories.length > 0
                ? openViewer(myStories[0].user_id, -1)
                : setShowCreator(true)
            }
          >
            <div
              className={`rounded-full p-0.5 ${myStories.length > 0 ? 'bg-linear-to-tr from-yellow-400 via-red-500 to-purple-500' : ''}`}
            >
              <UserAvatar
                src={user?.avatar}
                rootClassName={'size-16'}
                fallback={<FaUser className={'size-6'} />}
              />
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowCreator(true)
              }}
              className="bg-accent-blue/90 hover:bg-accent-blue absolute right-0 bottom-0 z-10 cursor-pointer rounded-full border-2 border-white p-1.5 text-white transition-colors"
              aria-label="Add new story"
            >
              <Plus size={14} />
            </button>
          </div>

          <span className="text-center text-xs font-medium">
            {myStories.length > 0 ? 'Your Story' : 'Add Story'}
          </span>
        </div>

        {/* FOLLOWING STORIES */}
        {stories.map((story, index) => (
          <button
            key={story.user.id}
            className="group flex min-w-[72px] cursor-pointer flex-col items-center gap-1"
            onClick={() => openViewer(story.user.id, index)}
          >
            <div
              className={`rounded-full p-[2px] ${story.has_unseen ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500' : 'bg-gray-300'}`}
            >
              <div className="rounded-full bg-white p-[2px] transition-transform group-hover:scale-105">
                <UserAvatar
                  src={story.user.avatar}
                  fallback={getUserInitials(
                    story.user.first_name,
                    story.user.last_name,
                    story.user.company_name,
                  )}
                  rootClassName={'size-16'}
                />
              </div>
            </div>
            <span className="w-16 truncate text-center text-xs font-medium">
              {story.user.first_name || story.user.username}
            </span>
          </button>
        ))}
      </div>

      <StoryViewerDialog
        userId={selectedUserId}
        isOpen={isViewerOpen}
        onClose={handleCloseViewer}
        onNextUser={handleNextUser}
        onPrevUser={handlePrevUser}
      />

      <StoryCreator
        open={showCreator}
        onClose={() => setShowCreator(false)}
        onSuccess={() => {
          loadStories()
          setShowCreator(false)
        }}
      />
    </>
  )
}
