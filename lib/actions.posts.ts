'use server'

import { createClient } from '@/lib/supabase.server'
import { Post, PostFile, PostProject, ServerResponse, User } from '@/lib/models'
import { POSTS_LIST_TYPE } from '@/lib/constants'

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
                '*, files:post_files(*), user:users(*), post_projects(project:projects(*,files:project_files(*), files_count:project_files(count)))',
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
              '*, files:post_files(*), user:users(*), post_projects(project:projects(*, files:project_files(*), files_count:project_files(count)))',
            )
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
      data: postsResponse.data,
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

    const postResponse = await supabase
      .from('posts')
      .select(
        '*, files:post_files(*), user:users(*), post_projects(project:projects(*, files:project_files(*), files_count:project_files(count)))',
      )
      .eq('id', props.id)
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
      data: postResponse.data,
    }
  } catch (e) {
    console.log('getPostById', e)
    return {
      status: 'error',
      message: 'Failed to fetch post. Please try again later.',
    }
  }
}

type CreatePostProps = Pick<Post, 'content'> & {
  files: Pick<PostFile, 'name' | 'type' | 'url'>[]
  projects: Pick<PostProject, 'project_id'>[]
}
export async function createPost(
  props: CreatePostProps,
): Promise<ServerResponse<Post>> {
  try {
    const supabase = await createClient()
    const currentUserResponse = await supabase.auth.getUser()

    if (currentUserResponse.error) {
      return {
        status: 'error',
        message: currentUserResponse.error.message,
      }
    }

    const insertPostResponse = await supabase
      .from('posts')
      .insert([
        {
          content: props.content,
          user_id: currentUserResponse.data.user.id,
          comments_count: 0,
          likes_count: 0,
        },
      ])
      .select('*')
      .single()

    if (insertPostResponse.error) {
      return {
        status: 'error',
        message: insertPostResponse.error.message,
      }
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
