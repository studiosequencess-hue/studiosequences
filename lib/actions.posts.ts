'use server'

import { createClient } from '@/lib/supabase.server'
import { Post, PostFile, PostProject, ServerResponse, User } from '@/lib/models'
import { POST_VISIBILITY, POSTS_LIST_TYPE } from '@/lib/constants'
import { getPathFromPublicUrl } from '@/lib/utils'
import { getUser } from '@/lib/actions.auth'

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
    const supabase = await createClient()

    const from = props.pageIndex * props.pageSize
    const to = from + props.pageSize - 1

    const postsResponse =
      props.type == POSTS_LIST_TYPE.PERSONAL
        ? props.userId
          ? await supabase
              .from('posts')
              .select(
                '*, files:post_files(*), user:users(*), post_projects(project:projects(*,files:project_files(*), files_count:project_files(count))), user_liked:post_likes!left(id)',
              )
              .eq('user_id', props.userId)
              .order('created_at', { ascending: false })
              .range(from, to)
          : {
              error: { message: 'Invalid user. Please try again later.' },
            }
        : await supabase
            .from('posts')
            .select(
              '*, files:post_files(*), user:users(*), post_projects(project:projects(*, files:project_files(*), files_count:project_files(count))), user_liked:post_likes!left(id)',
            )
            .eq('visibility', POST_VISIBILITY.PUBLIC)
            .order('created_at', { ascending: false })
            .range(from, to)

    if (postsResponse.error) {
      return {
        status: 'error',
        message: postsResponse.error.message,
      }
    }

    return {
      status: 'success',
      message: 'Successfully fetched posts.',
      data: postsResponse.data.map((post) => ({
        ...post,
        user_liked: post.user_liked.length > 0,
        projects: post.post_projects.map((project) => ({ ...project.project })),
      })),
    }
  } catch (e) {
    console.log('getUser', e)
    return {
      status: 'error',
      message: 'Failed to fetch user. Please try again later.',
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
    const supabase = await createClient()
    const userResponse = await supabase.auth.getUser()
    if (userResponse.error) {
      return {
        status: 'error',
        message: userResponse.error.message,
      }
    }

    const postResponse = await supabase
      .from('posts')
      .select(
        '*, files:post_files(*), user:users(*), post_projects(project:projects(*, files:project_files(*), files_count:project_files(count)))',
      )
      .match({ id: props.id, user_id: userResponse.data.user.id })
      .single()

    if (postResponse.error) {
      console.log('getPostById', postResponse.error)
      return {
        status: 'error',
        message: postResponse.error.message,
      }
    }

    return {
      status: 'success',
      message: 'Successfully fetched posts.',
      data: {
        ...postResponse.data,
        projects: postResponse.data.post_projects.map((p) => ({
          ...p.project,
        })),
      },
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
  projects: Pick<PostProject, 'project_id'>[]
}
export async function upsertPost(
  props: CreatePostProps,
): Promise<ServerResponse<Post>> {
  try {
    const supabase = await createClient()
    const currentUserResponse = await getUser()

    if (currentUserResponse.status == 'error') {
      return {
        status: 'error',
        message: currentUserResponse.message,
      }
    }

    const insertPostResponse = await supabase
      .from('posts')
      .upsert({
        id: props.id,
        content: props.content,
        visibility: props.visibility,
        user_id: currentUserResponse.data.id,
        comments_count: 0,
        likes_count: 0,
      })
      .select('*, files:post_files(*)')
      .single()

    if (insertPostResponse.error) {
      return {
        status: 'error',
        message: insertPostResponse.error.message,
      }
    }

    if (props.id != -1) {
      await Promise.all([
        supabase.storage
          .from('files')
          .remove(
            insertPostResponse.data.files
              .map((f) => getPathFromPublicUrl(f.url, 'files'))
              .filter((p) => p != null),
          ),
        supabase.from('post_files').delete().eq('post_id', props.id),
        supabase.from('post_projects').delete().eq('post_id', props.id),
      ])
    }

    const [insertFilesResponse, insertProjectsResponse] = await Promise.all([
      supabase
        .from('post_files')
        .insert(
          props.files.map((file) => ({
            name: file.name,
            post_id: insertPostResponse.data.id,
            url: file.url,
            type: file.type,
          })),
        )
        .select(),
      // .select(
      //   'projects:projects(*, files:project_files(*), files_count:project_files(count))',
      // ),
      supabase
        .from('post_projects')
        .insert(
          props.projects.map((project) => ({
            project_id: project.project_id,
            post_id: insertPostResponse.data.id,
          })),
        )
        .select(
          `projects(*, files:project_files (*), files_count:project_files(count))`,
        ),
    ])

    if (insertFilesResponse.error) {
      return {
        status: 'error',
        message: insertFilesResponse.error.message,
      }
    }

    if (insertProjectsResponse.error) {
      return {
        status: 'error',
        message: insertProjectsResponse.error.message,
      }
    }

    return getPostById({
      id: insertPostResponse.data.id,
    })
  } catch (e) {
    console.log('createPost', e)
    return {
      status: 'error',
      message: 'Failed to fetch user. Please try again later.',
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
    const supabase = await createClient()
    const userResponse = await supabase.auth.getUser()

    if (userResponse.error) {
      return {
        status: 'error',
        message: userResponse.error.message,
      }
    }

    const postResponse = await supabase
      .from('posts')
      .delete()
      .eq('id', props.id)
      .eq('user_id', userResponse.data.user.id)
      .single()

    if (postResponse.error) {
      return {
        status: 'error',
        message: postResponse.error.message,
      }
    }

    return {
      status: 'success',
      message: 'Successfully deleted post.',
      data: postResponse.data,
    }
  } catch (e) {
    console.log('deletePostById', e)
    return {
      status: 'error',
      message: 'Failed to fetch post. Please try again later.',
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
    const supabase = await createClient()
    const userResponse = await supabase.auth.getUser()

    if (userResponse.error) {
      return {
        status: 'error',
        message: userResponse.error.message,
      }
    }

    if (props.isLiked) {
      const [postResponse] = await Promise.all([
        supabase.rpc('handle_post_like', {
          p_post_id: props.id,
          p_user_id: userResponse.data.user.id,
          p_is_liked: true,
        }),
      ])

      if (postResponse.error) {
        return {
          status: 'error',
          message: postResponse.error.message,
        }
      }
    } else {
      const [postResponse] = await Promise.all([
        supabase.rpc('handle_post_like', {
          p_post_id: props.id,
          p_user_id: userResponse.data.user.id,
          p_is_liked: false,
        }),
      ])

      if (postResponse.error) {
        return {
          status: 'error',
          message: postResponse.error.message,
        }
      }
    }

    return {
      status: 'success',
      message: `Successfully ${props.isLiked ? 'liked' : 'unliked'} post.`,
      data: true,
    }
  } catch (e) {
    console.log('deletePostById', e)
    return {
      status: 'error',
      message: 'Failed to fetch post. Please try again later.',
    }
  }
}
