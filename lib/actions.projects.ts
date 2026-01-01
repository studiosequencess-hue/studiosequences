'use server'

import { createClient } from '@/lib/supabase.server'
import { Project, ServerResponse } from '@/lib/models'

type GetAllProjectsProps = {
  pageSize: number
  pageIndex: number
}
export async function getAllProjects(
  props: GetAllProjectsProps,
): Promise<ServerResponse<Project[]>> {
  try {
    const supabase = await createClient()
    const currentUserResponse = await supabase.auth.getUser()

    if (currentUserResponse.error) {
      return {
        status: 'error',
        message: currentUserResponse.error.message,
      }
    }

    const from = props.pageIndex * props.pageSize
    const to = from + props.pageSize - 1

    const projectsResponse = await supabase
      .from('projects')
      .select('*, images:project_images(*)', { count: 'exact' })
      .order('position', { ascending: true })
      .range(from, to)
      .limit(1, { foreignTable: 'project_images' })

    if (projectsResponse.error) {
      return {
        status: 'error',
        message: projectsResponse.error.message,
      }
    }

    return {
      status: 'success',
      message: 'Successfully fetched projects.',
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
