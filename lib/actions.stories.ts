'use server'

import { db } from '@/db/client'
import { stories, story_views, follows } from '@/db/schema'
import { eq, and, desc, inArray, gt } from 'drizzle-orm'
import { getUser } from '@/lib/actions.auth'
import type { ServerResponse, StoryWithUser } from '@/lib/models'

export async function createStory(
  url: string,
  type: 'image' | 'video' = 'image',
): Promise<ServerResponse<{ id: number }>> {
  try {
    const userResponse = await getUser()
    if (userResponse.status === 'error') {
      return userResponse
    }

    const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    const result = await db
      .insert(stories)
      .values({
        user_id: userResponse.data.id,
        url,
        type,
        expires_at,
      })
      .returning({ id: stories.id })

    if (!result[0]) {
      return { status: 'error', message: 'Failed to create story' }
    }

    return {
      status: 'success',
      message: 'Story created',
      data: result[0],
    }
  } catch (e) {
    console.error('createStory', e)
    return { status: 'error', message: 'Failed to create story' }
  }
}

// 2. Get Stories Feed (from people user follows)
export async function getStoriesFeed(): Promise<
  ServerResponse<StoryWithUser[]>
> {
  try {
    const userResponse = await getUser()
    if (userResponse.status === 'error') {
      return userResponse
    }

    const current_user_id = userResponse.data.id
    const now = new Date()

    // Get IDs of users that current user follows
    const following = await db
      .select({ following_id: follows.following_id })
      .from(follows)
      .where(eq(follows.follower_id, current_user_id))

    const followingIds = following.map((f) => f.following_id)

    if (followingIds.length === 0) {
      return { status: 'success', message: 'No stories', data: [] }
    }

    // Get active stories from followed users
    const activeStories = await db.query.stories.findMany({
      where: and(
        inArray(stories.user_id, followingIds),
        gt(stories.expires_at, now),
      ),
      orderBy: [desc(stories.created_at)],
      with: {
        user: {
          columns: {
            id: true,
            username: true,
            avatar: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    })

    if (activeStories.length === 0) {
      return { status: 'success', message: 'No stories', data: [] }
    }

    // Get which stories current user has viewed
    const storyIds = activeStories.map((s) => s.id)
    const views = await db
      .select({ story_id: story_views.story_id })
      .from(story_views)
      .where(
        and(
          inArray(story_views.story_id, storyIds),
          eq(story_views.user_id, current_user_id),
        ),
      )

    const viewedSet = new Set(views.map((v) => v.story_id))

    // Group by user and check unseen status
    const userMap = new Map<string, StoryWithUser>()

    for (const story of activeStories) {
      const userId = story.user_id
      const has_unseen = !viewedSet.has(story.id)

      if (!userMap.has(userId)) {
        userMap.set(userId, {
          ...story,
          has_unseen,
        } as StoryWithUser)
      } else if (has_unseen && !userMap.get(userId)!.has_unseen) {
        const existing = userMap.get(userId)!
        existing.has_unseen = true
      }
    }

    return {
      status: 'success',
      message: 'Fetched stories',
      data: Array.from(userMap.values()),
    }
  } catch (e) {
    console.error('getStoriesFeed', e)
    return { status: 'error', message: 'Failed to fetch stories' }
  }
}

// 3. Get User's Stories (for viewer modal)
export async function getUserStories(
  userId: string,
): Promise<ServerResponse<Array<StoryWithUser>>> {
  try {
    const now = new Date()

    const userStories = await db.query.stories.findMany({
      where: and(eq(stories.user_id, userId), gt(stories.expires_at, now)),
      orderBy: [desc(stories.created_at)],
      with: {
        user: true,
      },
    })

    return {
      status: 'success',
      message: 'Fetched user stories',
      data: userStories.map((s) => ({ ...s, has_unseen: false })),
    }
  } catch (e) {
    console.error('getUserStories', e)
    return { status: 'error', message: 'Failed to fetch stories' }
  }
}

// 4. Mark Story as Viewed
export async function markStoryAsViewed(
  storyId: number,
): Promise<ServerResponse<boolean>> {
  try {
    const userResponse = await getUser()
    if (userResponse.status === 'error') {
      return userResponse
    }

    await db.insert(story_views).values({
      story_id: storyId,
      user_id: userResponse.data.id,
    })

    return { status: 'success', message: 'Marked as viewed', data: true }
  } catch (e) {
    if (e && typeof e === 'object' && 'code' in e && e.code === '23505') {
      return { status: 'success', message: 'Already viewed', data: true }
    }
    console.error('markStoryAsViewed', e)
    return { status: 'error', message: 'Failed to mark as viewed' }
  }
}

// 5. Get My Stories (for "Your Story" button)
export async function getMyStories(): Promise<
  ServerResponse<(typeof stories.$inferSelect)[]>
> {
  try {
    const userResponse = await getUser()
    if (userResponse.status === 'error') {
      return userResponse
    }

    const now = new Date()

    const myStories = await db.query.stories.findMany({
      where: and(
        eq(stories.user_id, userResponse.data.id),
        gt(stories.expires_at, now),
      ),
      orderBy: [desc(stories.created_at)],
    })

    return {
      status: 'success',
      message: 'Fetched my stories',
      data: myStories,
    }
  } catch (e) {
    console.error('getMyStories', e)
    return { status: 'error', message: 'Failed to fetch stories' }
  }
}

// 6. Delete Story
export async function deleteStory(
  storyId: number,
): Promise<ServerResponse<boolean>> {
  try {
    const userResponse = await getUser()
    if (userResponse.status === 'error') {
      return userResponse
    }

    // Verify ownership before deleting (optional but recommended)
    const story = await db.query.stories.findFirst({
      where: eq(stories.id, storyId),
    })

    if (!story) {
      return { status: 'error', message: 'Story not found' }
    }

    if (story.user_id !== userResponse.data.id) {
      return { status: 'error', message: 'Not authorized to delete this story' }
    }

    await db.delete(stories).where(eq(stories.id, storyId))

    return { status: 'success', message: 'Story deleted', data: true }
  } catch (e) {
    console.error('deleteStory', e)
    return { status: 'error', message: 'Failed to delete story' }
  }
}
