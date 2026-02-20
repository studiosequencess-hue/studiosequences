'use server'

import {
  Project,
  ProjectFile,
  ProjectMember,
  ServerResponse,
  User,
} from '@/lib/models'
import { db } from '@/db/client'
import { eq, sql, asc } from 'drizzle-orm'
import { projects, projectFiles, projectMembers } from '@/db/schema'
import { getUser } from '@/lib/actions.auth'

export async function getPersonalProjects(): Promise<
  ServerResponse<{ projects: Project[]; total: number }>
> {
  try {
    const userResponse = await getUser()
    if (userResponse.status === 'error') {
      return userResponse
    }

    // Fetch projects with files relation
    const projectsData = await db.query.projects.findMany({
      where: eq(projects.user_id, userResponse.data.id),
      orderBy: [asc(projects.position), asc(projects.id)],
      with: {
        files: true,
        members: {
          with: {
            user: true,
          },
        },
      },
    })

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(projects)
      .where(eq(projects.user_id, userResponse.data.id))

    const total = countResult[0]?.count || 0

    const formattedProjects = projectsData.map((project) => ({
      ...project,
      files_count: [{ count: project.files?.length || 0 }],
    }))

    return {
      status: 'success',
      message: 'Successfully fetched projects.',
      data: {
        projects: formattedProjects,
        total,
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
    const offset = props.pageIndex * props.pageSize

    const projectsData = await db.query.projects.findMany({
      where: eq(projects.user_id, props.userId),
      orderBy: [asc(projects.position), asc(projects.id)],
      limit: props.pageSize,
      offset: offset,
      with: {
        files: true,
        members: {
          with: {
            user: true,
          },
        },
      },
    })

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(projects)
      .where(eq(projects.user_id, props.userId))

    const total = countResult[0]?.count || 0

    // Format to match original shape with counts and limit files to 1
    const formattedProjects = projectsData.map((project) => ({
      ...project,
      files: project.files?.slice(0, 1) || [], // Limit to 1 file as per original
      files_count: [{ count: project.files?.length || 0 }],
      members_count: [{ count: project.members?.length || 0 }],
    }))

    return {
      status: 'success',
      message: 'Successfully fetched projects.',
      data: {
        projects: formattedProjects as Project[],
        total,
      },
    }
  } catch (e) {
    console.log('getAllProjectsByUserId', e)
    return {
      status: 'error',
      message: 'Failed to fetch all projects for user. Please try again later.',
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
    const files = await db
      .select()
      .from(projectFiles)
      .where(eq(projectFiles.project_id, props.id))

    return {
      status: 'success',
      message: 'Successfully fetched projects files.',
      data: files as ProjectFile[],
    }
  } catch (e) {
    console.log('getProjectFilesById', e)
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
    const members = await db.query.projectMembers.findMany({
      where: eq(projectMembers.project_id, props.id),
      with: {
        user: true,
      },
    })

    return {
      status: 'success',
      message: 'Successfully fetched project members.',
      data: members as ProjectMember[],
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
    const currentUserResponse = await getUser()
    if (currentUserResponse.status == 'error') {
      return {
        status: 'error',
        message: currentUserResponse.message,
      }
    }

    // Insert project
    const insertProjectResponse = await db
      .insert(projects)
      .values({
        title: props.title,
        description: props.description,
        is_sensitive: props.is_sensitive,
        position: -1,
        user_id: currentUserResponse.data.id,
      })
      .returning()

    if (!insertProjectResponse[0]) {
      return {
        status: 'error',
        message: 'Failed to create project',
      }
    }

    const projectId = insertProjectResponse[0].id

    // Insert files and members in parallel
    const [insertFilesResponse, insertMembersResponse] = await Promise.all([
      db
        .insert(projectFiles)
        .values(
          props.files.map((file) => ({
            title: file.title,
            description: file.description,
            url: file.url,
            project_id: projectId,
            name: file.name,
            type: file.type,
          })),
        )
        .returning(),
      db
        .insert(projectMembers)
        .values(
          props.members.map((member) => ({
            department: member.department,
            user_id: member.user_id,
            project_id: projectId,
          })),
        )
        .returning(),
    ])

    return {
      status: 'success',
      message: 'Successfully created project.',
      data: {
        ...insertProjectResponse[0],
        files: insertFilesResponse,
        members: insertMembersResponse,
        files_count: [
          {
            count: insertFilesResponse.length,
          },
        ],
        members_count: [
          {
            count: insertMembersResponse.length,
          },
        ],
      } as Project,
    }
  } catch (e) {
    console.log('createProject', e)
    return {
      status: 'error',
      message: 'Failed to create project. Please try again later.',
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
    const currentUserResponse = await getUser()
    if (currentUserResponse.status == 'error') {
      return currentUserResponse
    }

    // Update project
    const updateProjectResponse = await db
      .update(projects)
      .set({
        title: props.title,
        description: props.description,
        is_sensitive: props.is_sensitive,
      })
      .where(eq(projects.id, props.id))
      .returning()

    if (!updateProjectResponse[0]) {
      return {
        status: 'error',
        message: 'Project not found',
      }
    }

    // Delete old files and members (manual cleanup before re-inserting)
    await Promise.all([
      db.delete(projectFiles).where(eq(projectFiles.project_id, props.id)),
      db.delete(projectMembers).where(eq(projectMembers.project_id, props.id)),
    ])

    // Insert new files and members
    const [updateFilesResponse, updateMembersResponse] = await Promise.all([
      db
        .insert(projectFiles)
        .values(
          props.files.map((file) => ({
            title: file.title,
            description: file.description,
            url: file.url,
            project_id: props.id,
            name: file.name,
            type: file.type,
          })),
        )
        .returning(),
      db
        .insert(projectMembers)
        .values(
          props.members.map((member) => ({
            department: member.department,
            user_id: member.user_id,
            project_id: props.id,
          })),
        )
        .returning(),
    ])

    return {
      status: 'success',
      message: 'Successfully updated project.',
      data: {
        ...updateProjectResponse[0],
        files: updateFilesResponse,
        members: updateMembersResponse,
        files_count: [
          {
            count: updateFilesResponse.length,
          },
        ],
        members_count: [
          {
            count: updateMembersResponse.length,
          },
        ],
      } as Project,
    }
  } catch (e) {
    console.log('updateProject', e)
    return {
      status: 'error',
      message: 'Failed to update project. Please try again later.',
    }
  }
}

type DeleteProjectProps = Pick<Project, 'id'>
export async function deleteProject(
  props: DeleteProjectProps,
): Promise<ServerResponse<boolean>> {
  try {
    const currentUserResponse = await getUser()
    if (currentUserResponse.status == 'error') {
      return currentUserResponse
    }

    // Delete project - files and members delete automatically via cascade
    await db.delete(projects).where(eq(projects.id, props.id))

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
