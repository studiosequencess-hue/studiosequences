'use server'

import { createClient } from '@/lib/supabase.server'
import { ServerResponse, Post } from '@/lib/models'

type GetPostsProps = {
  pageSize: number
  pageIndex: number
}
export async function getPosts(
  props: GetPostsProps,
): Promise<ServerResponse<Post[]>> {
  try {
    const supabase = await createClient()

    const from = props.pageIndex * props.pageSize
    const to = from + props.pageSize - 1

    const postsResponse = await supabase
      .from('posts')
      .select(
        '*, files:post_files(*), user:users(*), projects:post_projects(*)',
      )
      .order('created_at', { ascending: false })
      .range(from, to)

    if (postsResponse.error) {
      return {
        status: 'error',
        message: projectsResponse.error.message,
      }
    }

    return {
      status: 'success',
      message: 'Successfully fetched posts.',
      data: projectsResponse.data,
    }
  } catch (e) {
    console.log('getUser', e)
    return {
      status: 'error',
      message: 'Failed to fetch user. Please try again later.',
    }
  }
}
