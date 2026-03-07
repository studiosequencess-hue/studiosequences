'use server'

import { Post, PostFile, PostProject, ServerResponse, User } from '@/lib/models'
import {
  POST_VISIBILITY,
  POSTS_LIST_TYPE,
  StorageBucketType,
} from '@/lib/constants'
import { getPathFromPublicUrl } from '@/lib/utils'
import { db } from '@/db/client'
import { getUser } from '@/lib/actions.auth'
import {
  posts,
  postLikes,
  postFiles,
  postProjects,
  userPostBookmarks,
} from '@/drizzle/schema'
import { eq, desc, and, inArray, sql } from 'drizzle-orm'
import { createClient } from '@/lib/supabase.server'

type GetPostsProps = {
  type: POSTS_LIST_TYPE
  pageSize: number
  pageIndex: number
  userId?: User['id']
}
export async function getPosts(
  props: GetPostsProps,
): Promise<ServerResponse<Post[]>> {
  try {
    const offset = props.pageIndex * props.pageSize
    const limit = props.pageSize

    const currentUser = await getUser()
    const currentUserId =
      currentUser.status === 'success' ? currentUser.data.id : null

    if (props.type === POSTS_LIST_TYPE.PERSONAL && !props.userId) {
      return {
        status: 'error',
        message: 'Invalid user. Please try again later.',
      }
    }

    // Build where clause
    const whereClause =
      props.type === POSTS_LIST_TYPE.PERSONAL
        ? eq(posts.userId, props.userId!)
        : eq(posts.visibility, POST_VISIBILITY.PUBLIC)

    // Get posts
    const postsData = await db.query.posts.findMany({
      where: whereClause,
      orderBy: [desc(posts.createdAt)],
      limit,
      offset,
      with: {
        files: true,
        user: true,
        projects: {
          with: {
            project: {
              with: {
                files: true,
              },
            },
          },
        },
        bookmarks: true,
      },
    })

    // Get all post IDs to check likes in batch
    const postIds = postsData.map((p) => p.id)

    let likedPostIds = new Set<number>()

    if (currentUserId && postIds.length > 0) {
      const likes = await db
        .select({ postId: postLikes.postId })
        .from(postLikes)
        .where(
          and(
            inArray(postLikes.postId, postIds),
            eq(postLikes.userId, currentUserId),
          ),
        )
      likedPostIds = new Set(likes.map((l) => l.postId))
    }

    // Format response
    const formattedPosts: Post[] = postsData.map((post) => ({
      ...post,
      user_liked: likedPostIds.has(post.id),
      user_bookmarked: post.bookmarks.length > 0,
      projects:
        post.projects?.map((pp) => ({
          ...pp.project,
          files: pp.project?.files,
          files_count: [{ count: pp.project?.files?.length || 0 }],
        })) || [],
    }))

    return {
      status: 'success',
      message: 'Successfully fetched posts.',
      data: formattedPosts as Post[],
    }
  } catch (e) {
    console.log('getPosts', e)
    return {
      status: 'error',
      message: 'Failed to fetch posts. Please try again later.',
    }
  }
}

type GetBookmarksProps = {
  pageSize: number
  pageIndex: number
  userId?: User['id']
}
export async function getBookmarks(
  props: GetBookmarksProps,
): Promise<ServerResponse<Post[]>> {
  try {
    const offset = props.pageIndex * props.pageSize
    const limit = props.pageSize

    const currentUser = await getUser()
    const currentUserId =
      currentUser.status === 'success' ? currentUser.data.id : null

    // Build where clause
    const whereClause = eq(userPostBookmarks.userId, props.userId!)

    // Get posts
    const bookmarksData = await db.query.userPostBookmarks.findMany({
      where: whereClause,
      orderBy: [desc(userPostBookmarks.createdAt)],
      limit,
      offset,
      with: {
        post: {
          with: {
            files: true,
            projects: {
              with: {
                project: {
                  with: {
                    files: true,
                  },
                },
              },
            },
            user: true,
          },
        },
      },
    })

    // Format response
    const formattedPosts = bookmarksData.map((b) => ({
      ...b.post,
      projects:
        b.post.projects?.map((pp) => ({
          ...pp.project,
          files: pp.project?.files,
          files_count: [{ count: pp.project?.files?.length || 0 }],
        })) || [],
    }))

    return {
      status: 'success',
      message: 'Successfully fetched posts.',
      data: formattedPosts,
    }
  } catch (e) {
    console.log('getPosts', e)
    return {
      status: 'error',
      message: 'Failed to fetch posts. Please try again later.',
    }
  }
}

type GetPostByIdProps = {
  id: Post['id']
}
export async function getPostById(
  props: GetPostByIdProps,
): Promise<ServerResponse<Post>> {
  try {
    const userResponse = await getUser()
    if (userResponse.status === 'error') {
      return {
        status: 'error',
        message: userResponse.message,
      }
    }

    // Fetch post with relations, verifying ownership
    const post = await db.query.posts.findFirst({
      where: and(
        eq(posts.id, props.id),
        eq(posts.userId, userResponse.data.id),
      ),
      with: {
        files: true,
        user: true,
        projects: {
          with: {
            project: {
              with: {
                files: true,
              },
            },
          },
        },
      },
    })

    if (!post) {
      return {
        status: 'error',
        message: 'Post not found',
      }
    }

    return {
      status: 'success',
      message: 'Successfully fetched post.',
      data: {
        ...post,
        projects:
          post.projects?.map((pp) => ({
            ...pp.project,
            files_count: [{ count: pp.project?.files?.length || 0 }],
          })) || [],
      } as Post,
    }
  } catch (e) {
    console.log('getPostById', e)
    return {
      status: 'error',
      message: 'Failed to fetch post. Please try again later.',
    }
  }
}

type CreatePostProps = Pick<Post, 'id' | 'content' | 'visibility'> & {
  files: Pick<PostFile, 'name' | 'type' | 'url'>[]
  projects: Pick<PostProject, 'projectId'>[]
}
export async function upsertPost(
  props: CreatePostProps,
): Promise<ServerResponse<Post>> {
  try {
    const currentUserResponse = await getUser()
    if (currentUserResponse.status === 'error') {
      return {
        status: 'error',
        message: currentUserResponse.message,
      }
    }

    const supabase = await createClient()
    const userId = currentUserResponse.data.id
    const isUpdate = props.id !== -1 && props.id !== undefined

    // Start transaction
    const result = await db.transaction(async (tx) => {
      let postId: number

      if (isUpdate) {
        // Update existing post
        const [updatedPost] = await tx
          .update(posts)
          .set({
            content: props.content,
            visibility: props.visibility,
          })
          .where(and(eq(posts.id, props.id), eq(posts.userId, userId)))
          .returning({ id: posts.id })

        if (!updatedPost) {
          throw new Error('Post not found')
        }
        postId = updatedPost.id

        // Get existing files for storage cleanup
        const existingFiles = await tx
          .select({ url: postFiles.url })
          .from(postFiles)
          .where(eq(postFiles.postId, postId))

        // Delete old relations
        await tx.delete(postFiles).where(eq(postFiles.postId, postId))
        await tx.delete(postProjects).where(eq(postProjects.postId, postId))

        // Delete files from storage (outside transaction, but after DB delete)
        if (existingFiles.length > 0) {
          const filePaths = existingFiles
            .map((f) => getPathFromPublicUrl(f.url, StorageBucketType.Files))
            .filter((p): p is string => p !== null)

          if (filePaths.length > 0) {
            await supabase.storage
              .from(StorageBucketType.Files)
              .remove(filePaths)
          }
        }
      } else {
        // Insert new post
        const [newPost] = await tx
          .insert(posts)
          .values({
            content: props.content,
            visibility: props.visibility,
            userId: userId,
            commentsCount: 0,
            likesCount: 0,
          })
          .returning({ id: posts.id })

        postId = newPost.id
      }

      // Insert new files
      if (props.files.length > 0) {
        await tx.insert(postFiles).values(
          props.files.map((file) => ({
            name: file.name,
            postId: postId,
            url: file.url,
            type: file.type,
          })),
        )
      }

      // Insert new project relations
      if (props.projects.length > 0) {
        await tx.insert(postProjects).values(
          props.projects.map((project) => ({
            projectId: project.projectId,
            postId: postId,
          })),
        )
      }

      return { postId }
    })

    // Fetch and return the complete post
    return await getPostById({ id: result.postId })
  } catch (e) {
    console.error('upsertPost', e)
    return {
      status: 'error',
      message: e instanceof Error ? e.message : 'Failed to save post',
    }
  }
}

type DeletePostByIdProps = {
  id: Post['id']
}
export async function deletePostById(
  props: DeletePostByIdProps,
): Promise<ServerResponse<Post>> {
  try {
    const userResponse = await getUser()
    if (userResponse.status === 'error') {
      return {
        status: 'error',
        message: userResponse.message,
      }
    }

    // Delete post with ownership verification and return deleted data
    const deletedPost = await db
      .delete(posts)
      .where(
        and(eq(posts.id, props.id), eq(posts.userId, userResponse.data.id)),
      )
      .returning()

    if (!deletedPost || deletedPost.length === 0) {
      return {
        status: 'error',
        message: 'Post not found or you do not have permission to delete it',
      }
    }

    return {
      status: 'success',
      message: 'Successfully deleted post.',
      data: deletedPost[0] as Post,
    }
  } catch (e) {
    console.log('deletePostById', e)
    return {
      status: 'error',
      message: 'Failed to delete post. Please try again later.',
    }
  }
}

type ToggleLikePostByIdProps = {
  id: Post['id']
  isLiked: boolean
}
export async function toggleLikePostById(
  props: ToggleLikePostByIdProps,
): Promise<ServerResponse<boolean>> {
  try {
    const userResponse = await getUser()
    if (userResponse.status === 'error') {
      return {
        status: 'error',
        message: userResponse.message,
      }
    }

    const userId = userResponse.data.id
    const postId = props.id

    await db.transaction(async (tx) => {
      if (props.isLiked) {
        // Like: Insert into post_likes and increment counter
        try {
          await tx.insert(postLikes).values({
            postId: postId,
            userId: userId,
          })

          await tx
            .update(posts)
            .set({
              likesCount: sql`${posts.likesCount} + 1`,
            })
            .where(eq(posts.id, postId))
        } catch (e) {
          // Handle unique constraint violation (already liked)
          if (e && typeof e === 'object' && 'code' in e && e.code === '23505') {
            // Already liked, treat as success
            return { status: 'success', message: 'Already liked', data: true }
          }
          console.error('toggleLikePostById', e)
          return { status: 'error', message: 'Failed to mark as liked' }
        }
      } else {
        // Unlike: Delete from post_likes and decrement counter
        const deleteResult = await tx
          .delete(postLikes)
          .where(
            and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)),
          )

        // Only decrement if a row was actually deleted
        if (deleteResult.rowCount && deleteResult.rowCount > 0) {
          await tx
            .update(posts)
            .set({
              likesCount: sql`GREATEST(${posts.likesCount} - 1, 0)`,
            })
            .where(eq(posts.id, postId))
        }
      }
    })

    return {
      status: 'success',
      message: `Successfully ${props.isLiked ? 'liked' : 'unliked'} post.`,
      data: true,
    }
  } catch (e) {
    console.log('toggleLikePostById', e)
    return {
      status: 'error',
      message: 'Failed to toggle like. Please try again later.',
    }
  }
}

type ToggleBookmarkPostByIdProps = {
  id: Post['id']
  isBookmarked: boolean
}
export async function toggleBookmarkPostById(
  props: ToggleBookmarkPostByIdProps,
): Promise<ServerResponse<boolean>> {
  try {
    const userResponse = await getUser()
    if (userResponse.status === 'error') {
      return userResponse
    }

    const userId = userResponse.data.id
    const postId = props.id

    await db.transaction(async (tx) => {
      if (props.isBookmarked) {
        // Like: Insert into userPostBookmarks
        try {
          await tx.insert(userPostBookmarks).values({
            postId: postId,
            userId: userId,
          })
        } catch (e) {
          // Handle unique constraint violation (already liked)
          if (e && typeof e === 'object' && 'code' in e && e.code === '23505') {
            // Already liked, treat as success
            return {
              status: 'success',
              message: 'Already bookmarked',
              data: true,
            }
          }
          console.error('toggleBookmarkPostById', e)
          return { status: 'error', message: 'Failed to bookmark' }
        }
      } else {
        // Unlike: Delete from post_likes and decrement counter
        const deleteResult = await tx
          .delete(postLikes)
          .where(
            and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)),
          )

        // Only decrement if a row was actually deleted
        if (deleteResult.rowCount && deleteResult.rowCount > 0) {
          await tx
            .update(posts)
            .set({
              likesCount: sql`GREATEST(${posts.likesCount} - 1, 0)`,
            })
            .where(eq(posts.id, postId))
        }
      }
    })

    return {
      status: 'success',
      message: `Successfully ${props.isBookmarked ? 'bookmarked' : 'un-bookmarked'} post.`,
      data: true,
    }
  } catch (e) {
    console.log('toggleBookmarkPostById', e)
    return {
      status: 'error',
      message: 'Failed to toggle bookmark. Please try again later.',
    }
  }
}
