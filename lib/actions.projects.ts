'use server'

import { createClient } from '@/lib/supabase.server'
import {
  FormProjectFile,
  Project,
  ProjectFile,
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

    const projectsResponse = await supabase
      .from('projects')
      .select('*, files:project_files(*)', { count: 'exact' })
      .eq('user_id', props.userId)
      .order('position', { ascending: true })
      .order('id', { ascending: true })
      .range(from, to)

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

type CreateProjectProps = Pick<
  Project,
  'title' | 'description' | 'is_sensitive'
> & {
  files: Pick<ProjectFile, 'name' | 'type' | 'title' | 'description' | 'url'>[]
}
export async function createProject(
  props: CreateProjectProps,
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
      .from('project_files')
      .insert(
        props.files.map((file) => ({
          title: file.title,
          description: file.description,
          url: file.url,
          project_id: insertProjectResponse.data.id,
          name: file.name,
          type: file.type,
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
        files: insertImagesResponse.data,
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

type UpdateProjectProps = Pick<
  Project,
  'id' | 'title' | 'description' | 'is_sensitive'
> & {
  files: Pick<ProjectFile, 'name' | 'type' | 'title' | 'description' | 'url'>[]
}
export async function updateProject(
  props: UpdateProjectProps,
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

    const updateProjectResponse = await supabase
      .from('projects')
      .update({
        title: props.title,
        description: props.description,
        is_sensitive: props.is_sensitive,
      })
      .eq('id', props.id)
      .select()
      .single()

    if (updateProjectResponse.error) {
      return {
        status: 'error',
        message: updateProjectResponse.error.message,
      }
    }

    const deleteFilesResponse = await supabase
      .from('project_files')
      .delete()
      .eq('project_id', props.id)

    if (deleteFilesResponse.error) {
      return {
        status: 'error',
        message: deleteFilesResponse.error.message,
      }
    }

    const updateImagesResponse = await supabase
      .from('project_files')
      .insert(
        props.files.map((file) => ({
          title: file.title,
          description: file.description,
          url: file.url,
          project_id: updateProjectResponse.data.id,
          name: file.name,
          type: file.type,
        })),
      )
      .select()

    if (updateImagesResponse.error) {
      return {
        status: 'error',
        message: updateImagesResponse.error.message,
      }
    }

    // cleanupProjectOrphanFiles({
    //   folderPath: `projects/${currentUserResponse.data.user.id}`,
    //   existingFiles: props.files.map((file) => file.name),
    // })

    return {
      status: 'success',
      message: 'Successfully updated project.',
      data: {
        ...updateProjectResponse.data,
        files: updateImagesResponse.data,
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

type DeleteProjectProps = Pick<Project, 'id'>
export async function deleteProject(
  props: DeleteProjectProps,
): Promise<ServerResponse<boolean>> {
  try {
    const supabase = await createClient()
    const currentUserResponse = await supabase.auth.getUser()

    if (currentUserResponse.error) {
      return {
        status: 'error',
        message: currentUserResponse.error.message,
      }
    }

    const deleteProjectResponse = await supabase
      .from('projects')
      .delete()
      .eq('id', props.id)

    if (deleteProjectResponse.error) {
      return {
        status: 'error',
        message: deleteProjectResponse.error.message,
      }
    }

    // cleanupProjectOrphanFiles({
    //   folderPath: `projects/${currentUserResponse.data.user.id}`,
    //   existingFiles: props.files.map((file) => file.name),
    // })

    return {
      status: 'success',
      message: 'Successfully deleted project.',
      data: true,
    }
  } catch (e) {
    console.log('getUser', e)
    return {
      status: 'error',
      message: 'Failed to fetch user. Please try again later.',
    }
  }
}

type CleanupProjectOrphanFiles = {
  folderPath: string
  existingFiles: string[]
}
export const cleanupProjectOrphanFiles = async (
  props: CleanupProjectOrphanFiles,
): Promise<ServerResponse<number>> => {
  try {
    const supabase = await createClient()
    const listFilesResponse = await supabase.storage
      .from('files')
      .list(props.folderPath)

    if (listFilesResponse.error) {
      return {
        status: 'error',
        message: listFilesResponse.error.message,
      }
    }

    const storageFiles = listFilesResponse.data
    if (!storageFiles || storageFiles.length === 0) {
      return {
        status: 'error',
        message: 'No files found in storage folder.',
      }
    }

    const filesToDelete = storageFiles
      .filter((file) => !props.existingFiles.includes(file.name))
      .map((file) => `${props.folderPath}/${file.name}`)

    if (filesToDelete.length === 0) {
      return {
        status: 'error',
        message: `No files were deleted from storage folder.`,
      }
    }

    const deleteFilesResponse = await supabase.storage
      .from('files')
      .remove(filesToDelete)

    if (deleteFilesResponse.error) {
      return {
        status: 'error',
        message: deleteFilesResponse.error.message,
      }
    }

    return {
      status: 'success',
      message: `${deleteFilesResponse.data.length} out of ${filesToDelete.length} files were deleted from storage folder.`,
      data: deleteFilesResponse.data.length,
    }
  } catch (error) {
    console.error('Cleanup failed:', error)
    return {
      status: 'error',
      message: 'Failed to cleanup orphaned files. Please try again later.',
    }
  }
}
