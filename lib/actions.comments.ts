'use server'

import { db } from '@/db/client'
import { posts, postComments } from '@/drizzle/schema'
import { eq, and, desc, sql } from 'drizzle-orm'
import { getUser } from '@/lib/actions.auth'
import type { PostComment, ServerResponse } from '@/lib/models'
import { getUserGeneralInfo } from '@/lib/utils'

// 1. Add Comment
export async function addComment(
  postId: number,
  content: string,
): Promise<ServerResponse<PostComment>> {
  try {
    const userResponse = await getUser()
    if (userResponse.status === 'error') return userResponse

    const userId = userResponse.data.id

    // Insert comment and update count in transaction
    const result = await db.transaction(async (tx) => {
      // Insert comment
      const [comment] = await tx
        .insert(postComments)
        .values({
          postId: postId,
          userId: userId,
          content,
        })
        .returning()

      // Increment post comments count
      await tx
        .update(posts)
        .set({
          commentsCount: sql`${posts.commentsCount} + 1`,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(posts.id, postId))

      return {
        ...comment,
        user: userResponse.data,
      }
    })

    return {
      status: 'success',
      message: 'Comment added',
      data: {
        ...result,
        user: getUserGeneralInfo(result.user),
      },
    }
  } catch (e) {
    console.error('addComment', e)
    return { status: 'error', message: 'Failed to add comment' }
  }
}

// 2. Get Comments for Post
type GetCommentsProps = {
  pageIndex: number
  pageSize: number
  postId: PostComment['id']
}
export async function getComments({
  postId,
  pageSize,
  pageIndex,
}: GetCommentsProps): Promise<ServerResponse<PostComment[]>> {
  try {
    const comments = await db.query.postComments.findMany({
      where: eq(postComments.postId, postId),
      orderBy: [desc(postComments.createdAt)],
      limit: pageSize,
      offset: pageIndex * pageSize,
      with: {
        user: {
          columns: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            companyName: true,
            avatar: true,
            email: true,
            role: true,
          },
        },
      },
    })

    return {
      status: 'success',
      message: 'Successfully fetched comments.',
      data: comments,
    }
  } catch (e) {
    console.error('getComments', e)
    return {
      status: 'error',
      message: 'Failed to load comments',
    }
  }
}

// 3. Delete Comment
export async function deleteComment(
  commentId: number,
  postId: number,
): Promise<ServerResponse<boolean>> {
  try {
    const userRes = await getUser()
    if (userRes.status === 'error') return userRes

    const userId = userRes.data.id

    // Delete and decrement count in transaction
    await db.transaction(async (tx) => {
      // Verify ownership and delete
      const deleted = await tx
        .delete(postComments)
        .where(
          and(
            eq(postComments.id, commentId),
            eq(postComments.userId, userId),
            eq(postComments.postId, postId),
          ),
        )
        .returning()

      if (deleted.length === 0) {
        throw new Error('Comment not found or unauthorized')
      }

      // Decrement post comments count
      await tx
        .update(posts)
        .set({
          commentsCount: sql`GREATEST(${posts.commentsCount} - 1, 0)`,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(posts.id, postId))
    })

    return { status: 'success', message: 'Comment deleted', data: true }
  } catch (e) {
    console.error('deleteComment', e)
    return { status: 'error', message: 'Failed to delete comment' }
  }
}

// 4. Edit Comment
export async function updateComment(
  commentId: number,
  content: string,
): Promise<ServerResponse<PostComment>> {
  try {
    const userRes = await getUser()
    if (userRes.status === 'error') return userRes

    const userId = userRes.data.id

    const updated = await db
      .update(postComments)
      .set({
        content,
        updatedAt: new Date().toISOString(),
      })
      .where(
        and(eq(postComments.id, commentId), eq(postComments.userId, userId)),
      )
      .returning()

    if (updated.length === 0) {
      return { status: 'error', message: 'Comment not found' }
    }

    return {
      status: 'success',
      message: 'Successfully updated comment.',
      data: {
        ...updated[0],
        user: userRes.data,
      },
    }
  } catch (e) {
    console.error('updateComment', e)
    return { status: 'error', message: 'Failed to update comment' }
  }
}
