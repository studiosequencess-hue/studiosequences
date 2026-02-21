'use server'

import { db } from '@/db/client'
import { follows } from '@/db/schema'
import { eq, sql, and, ne, not } from 'drizzle-orm'
import { ServerResponse, DBUser } from '@/lib/models'
import { ServerRequest } from '@/lib/actions'
import { users } from '@/db/schema'
import { getUser } from '@/lib/actions.auth'

type GetFollowingsProps = {
  followerId: DBUser['id']
}
export async function getFollowings(props: GetFollowingsProps) {
  return ServerRequest<DBUser[], GetFollowingsProps>(
    'getFollowings',
    async (): Promise<ServerResponse<DBUser[]>> => {
      const fetchResponse = await db.query.follows.findMany({
        where: eq(follows.follower_id, props.followerId),
        with: {
          following: true,
        },
      })

      const followings = fetchResponse.map((f) => f.following)

      return {
        status: 'success',
        message: 'Successfully fetched user followings.',
        data: followings as DBUser[],
      }
    },
  )
}

type GetFollowSuggestionsProps = {
  count: number
}
export async function getFollowSuggestions(props: GetFollowSuggestionsProps) {
  return ServerRequest<DBUser[], GetFollowSuggestionsProps>(
    'getFollowSuggestions',
    async (): Promise<ServerResponse<DBUser[]>> => {
      try {
        // Get current user
        const userResponse = await getUser()
        if (userResponse.status === 'error') {
          return userResponse
        }

        const currentUserId = userResponse.data.id

        // Get random users that are NOT in the following list and not the current user
        const suggestions = await db
          .select()
          .from(users)
          .where(
            and(
              ne(users.id, currentUserId),
              not(
                sql`EXISTS (
                  SELECT 1 FROM ${follows} 
                  WHERE ${follows.follower_id} = ${currentUserId} 
                  AND ${follows.following_id} = ${users.id}
                )`,
              ),
            ),
          )
          .orderBy(sql`RANDOM()`)
          .limit(props.count)

        return {
          status: 'success',
          message: 'Successfully fetched follow suggestions.',
          data: suggestions as DBUser[],
        }
      } catch (error) {
        console.error('getFollowSuggestions', error)
        return {
          status: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'Failed to fetch follow suggestions',
        }
      }
    },
  )
}

type ToggleFollowProps = {
  followingId: DBUser['id']
}
export async function toggleFollow(props: ToggleFollowProps) {
  return ServerRequest<boolean, ToggleFollowProps>(
    'toggleFollowUser',
    async (): Promise<ServerResponse<boolean>> => {
      try {
        // Get current user
        const currentUserResponse = await getUser()
        if (currentUserResponse.status === 'error') {
          return {
            status: 'error',
            message: currentUserResponse.message,
          }
        }

        const followerId = currentUserResponse.data.id
        const followingId = props.followingId

        // Prevent self-follow
        if (followerId === followingId) {
          return {
            status: 'error',
            message: 'Cannot follow yourself',
          }
        }

        // Check if already following
        const existingFollow = await db.query.follows.findFirst({
          where: and(
            eq(follows.follower_id, followerId),
            eq(follows.following_id, followingId),
          ),
        })

        if (existingFollow) {
          // Unfollow: Delete the relationship
          await db
            .delete(follows)
            .where(
              and(
                eq(follows.follower_id, followerId),
                eq(follows.following_id, followingId),
              ),
            )

          return {
            status: 'success',
            message: 'Successfully unfollowed user',
            data: false, // false = not following anymore
          }
        } else {
          // Follow: Insert new relationship
          await db.insert(follows).values({
            follower_id: followerId,
            following_id: followingId,
          })

          return {
            status: 'success',
            message: 'Successfully followed user',
            data: true, // true = now following
          }
        }
      } catch (error) {
        console.error('toggleFollow', error)
        return {
          status: 'error',
          message:
            error instanceof Error ? error.message : 'Failed to toggle follow',
        }
      }
    },
  )
}
