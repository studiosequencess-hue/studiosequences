'use server'

import { createClient } from '@/lib/supabase.server'
import {
  ProjectFormFile,
  Project,
  ProjectFile,
  ProjectMember,
  ServerResponse,
  User,
} from '@/lib/models'
import { getUser } from '@/lib/actions.auth'

export async function getPersonalProjects(): Promise<
  ServerResponse<{ projects: Project[]; total: number }>
> {
  try {
    const supabase = await createClient()
    const userResponse = await getUser()

    if (userResponse.status === 'error') {
      return userResponse
    }

    const projectsResponse = await supabase
      .from('projects')
      .select('*, files:project_files(*), files_count:project_files(count)', {
        count: 'exact',
      })
      .eq('user_id', userResponse.data.id)
      .order('position', { ascending: true })
      .order('id', { ascending: true })

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
    console.log('getPersonalProjects', e)
    return {
      status: 'error',
      message: 'Failed to fetch user. Please try again later.',
    }
  }
}

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
      .select(
        '*, files:project_files(*), files_count:project_files(count), members:project_members(*), members_count:project_members(count)',
        {
          count: 'exact',
        },
      )
      .eq('user_id', props.userId)
      .order('position', { ascending: true })
      .order('id', { ascending: true })
      .range(from, to)
      .limit(1, { foreignTable: 'project_files' })

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

type GetProjectFilesByIdProps = {
  id: Project['id']
}
export async function getProjectFilesById(
  props: GetProjectFilesByIdProps,
): Promise<ServerResponse<ProjectFile[]>> {
  try {
    const supabase = await createClient()

    const projectFilesResponse = await supabase
      .from('project_files')
      .select('*')
      .eq('project_id', props.id)

    if (projectFilesResponse.error) {
      return {
        status: 'error',
        message: projectFilesResponse.error.message,
      }
    }

    return {
      status: 'success',
      message: 'Successfully fetched projects.',
      data: projectFilesResponse.data,
    }
  } catch (e) {
    console.log('getUser', e)
    return {
      status: 'error',
      message: 'Failed to fetch project files. Please try again later.',
    }
  }
}

type GetProjectMembersByIdProps = {
  id: Project['id']
}
export async function getProjectMembersById(
  props: GetProjectMembersByIdProps,
): Promise<ServerResponse<ProjectMember[]>> {
  try {
    const supabase = await createClient()

    const projectMembersResponse = await supabase
      .from('project_members')
      .select('*, user:users(*)')
      .eq('project_id', props.id)

    if (projectMembersResponse.error) {
      return {
        status: 'error',
        message: projectMembersResponse.error.message,
      }
    }

    return {
      status: 'success',
      message: 'Successfully fetched projects.',
      data: projectMembersResponse.data,
    }
  } catch (e) {
    console.log('getProjectMembersById', e)
    return {
      status: 'error',
      message: 'Failed to fetch project members. Please try again later.',
    }
  }
}

type CreateProjectProps = Pick<
  Project,
  'title' | 'description' | 'is_sensitive'
> & {
  files: Pick<ProjectFile, 'name' | 'type' | 'title' | 'description' | 'url'>[]
  members: Pick<ProjectMember, 'department' | 'user_id'>[]
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
      .select(
        '*, files_count:project_files(count), members_count:project_members(count)',
      )
      .single()

    if (insertProjectResponse.error) {
      return {
        status: 'error',
        message: insertProjectResponse.error.message,
      }
    }

    const [insertFilesResponse, insertMembersResponse] = await Promise.all([
      supabase
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
        .select(),
      supabase
        .from('project_members')
        .insert(
          props.members.map((member) => ({
            department: member.department,
            user_id: member.user_id,
            project_id: insertProjectResponse.data.id,
          })),
        )
        .select(),
    ])

    if (insertFilesResponse.error) {
      return {
        status: 'error',
        message: insertFilesResponse.error.message,
      }
    }

    if (insertMembersResponse.error) {
      return {
        status: 'error',
        message: insertMembersResponse.error.message,
      }
    }

    return {
      status: 'success',
      message: 'Successfully created project.',
      data: {
        ...insertProjectResponse.data,
        files: insertFilesResponse.data,
        members: insertMembersResponse.data,
        files_count: [
          {
            count: insertFilesResponse.data.length,
          },
        ],
        members_count: [
          {
            count: insertMembersResponse.data.length,
          },
        ],
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
  members: Pick<ProjectMember, 'department' | 'user_id'>[]
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
      .select(
        '*, files_count:project_files(count), members_count:project_members(count)',
      )
      .single()

    if (updateProjectResponse.error) {
      return {
        status: 'error',
        message: updateProjectResponse.error.message,
      }
    }

    const [deleteFilesResponse, deleteMembersResponse] = await Promise.all([
      supabase.from('project_files').delete().eq('project_id', props.id),
      supabase.from('project_members').delete().eq('project_id', props.id),
    ])

    if (deleteFilesResponse.error) {
      return {
        status: 'error',
        message: deleteFilesResponse.error.message,
      }
    }

    if (deleteMembersResponse.error) {
      return {
        status: 'error',
        message: deleteMembersResponse.error.message,
      }
    }

    const [updateFilesResponse, updateMembersResponse] = await Promise.all([
      supabase
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
        .select(),
      supabase
        .from('project_members')
        .insert(
          props.members.map((member) => ({
            department: member.department,
            user_id: member.user_id,
            project_id: updateProjectResponse.data.id,
          })),
        )
        .select(),
    ])

    if (updateFilesResponse.error) {
      return {
        status: 'error',
        message: updateFilesResponse.error.message,
      }
    }

    if (updateMembersResponse.error) {
      return {
        status: 'error',
        message: updateMembersResponse.error.message,
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
        files: updateFilesResponse.data,
        members: updateMembersResponse.data,
        files_count: [
          {
            count: updateFilesResponse.data.length,
          },
        ],
        members_count: [
          {
            count: updateMembersResponse.data.length,
          },
        ],
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
