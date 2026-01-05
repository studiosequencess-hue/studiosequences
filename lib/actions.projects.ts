'use server'

import { createClient } from '@/lib/supabase.server'
import {
  FormProjectFile,
  Project,
  ProjectImage,
  ServerResponse,
  User,
} from '@/lib/models'

type GetAllProjectsProps = {
  pageSize: number
  pageIndex: number
  userId: User['id']
}
export async function getAllProjectsByUserId(
  props: GetAllProjectsProps,
): Promise<ServerResponse<{ projects: Project[]; total: number }>> {
  try {
    const supabase = await createClient()

    const from = props.pageIndex * props.pageSize
    const to = from + props.pageSize - 1

    console.log(from, to)

    const projectsResponse = await supabase
      .from('projects')
      .select('*, images:project_images(*)', { count: 'exact' })
      .eq('user_id', props.userId)
      .order('position', { ascending: true })
      // .range(from, to)
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
      data: {
        projects: projectsResponse.data,
        total: projectsResponse.count || 0,
      },
    }
  } catch (e) {
    console.log('getUser', e)
    return {
      status: 'error',
      message: 'Failed to fetch user. Please try again later.',
    }
  }
}

type CreateProjectsProps = Pick<
  Project,
  'title' | 'description' | 'is_sensitive'
> & {
  files: Pick<ProjectImage, 'title' | 'description' | 'url'>[]
}
export async function createProject(
  props: CreateProjectsProps,
): Promise<ServerResponse<Project>> {
  try {
    const supabase = await createClient()
    const currentUserResponse = await supabase.auth.getUser()

    if (currentUserResponse.error) {
      return {
        status: 'error',
        message: currentUserResponse.error.message,
      }
    }

    const insertProjectResponse = await supabase
      .from('projects')
      .insert([
        {
          title: props.title,
          description: props.description,
          is_sensitive: props.is_sensitive,
          position: -1,
          user_id: currentUserResponse.data.user.id,
        },
      ])
      .select()
      .single()

    if (insertProjectResponse.error) {
      return {
        status: 'error',
        message: insertProjectResponse.error.message,
      }
    }

    const insertImagesResponse = await supabase
      .from('project_images')
      .insert(
        props.files.map((file) => ({
          title: file.title,
          description: file.description,
          url: file.url,
          project_id: insertProjectResponse.data.id,
        })),
      )
      .select()

    if (insertImagesResponse.error) {
      return {
        status: 'error',
        message: insertImagesResponse.error.message,
      }
    }

    return {
      status: 'success',
      message: 'Successfully fetched projects.',
      data: {
        ...insertProjectResponse.data,
        images: insertImagesResponse.data,
      },
    }
  } catch (e) {
    console.log('getUser', e)
    return {
      status: 'error',
      message: 'Failed to fetch user. Please try again later.',
    }
  }
}
