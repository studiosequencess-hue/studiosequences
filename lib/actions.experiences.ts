'use server'

import {
  FormExperience,
  ServerResponse,
  User,
  UserExperience,
} from '@/lib/models'
import { db } from '@/db/client'
import {
  experienceFiles,
  experienceProjects,
  userExperiences,
} from '@/drizzle/schema'
import { eq, desc, and } from 'drizzle-orm'
import { createClient } from '@/lib/supabase.server'
import { getUser } from '@/lib/actions.auth'
import { StorageBucketType } from '@/lib/constants'
import { getPathFromPublicUrl } from '@/lib/utils'

type GetExperiencesProps = {
  userId: User['id']
}
export async function getExperiences(
  props: GetExperiencesProps,
): Promise<ServerResponse<UserExperience[]>> {
  try {
    const experiencesData = await db.query.userExperiences.findMany({
      where: eq(userExperiences.userId, props.userId),
      orderBy: [desc(userExperiences.startDate)],
      with: {
        user: true,
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
      },
    })

    return {
      status: 'success',
      message: 'Successfully fetched experiences.',
      data: experiencesData,
    }
  } catch (e) {
    console.log('getExperiences', e)
    return {
      status: 'error',
      message: 'Failed to fetch experiences. Please try again later.',
    }
  }
}

type UpsertExperienceProps = {
  experience: FormExperience
}
export async function upsertExperience(
  props: UpsertExperienceProps,
): Promise<ServerResponse<UserExperience>> {
  try {
    const userRes = await getUser()
    if (userRes.status === 'error') return userRes

    const userId = userRes.data.id
    const supabase = await createClient()
    const isUpdate = props.experience.id != -1

    if (
      props.experience.endDate &&
      new Date(props.experience.endDate) < new Date(props.experience.startDate)
    ) {
      return { status: 'error', message: 'End date must be after start date' }
    }

    let experienceId = -1

    await db.transaction(async (tx) => {
      if (isUpdate) {
        // Verify ownership
        const existing = await tx.query.userExperiences.findFirst({
          where: and(
            eq(userExperiences.id, props.experience.id),
            eq(userExperiences.userId, userId),
          ),
        })

        if (!existing) {
          return {
            status: 'error',
            message: 'Experience not found or unauthorized',
          }
        }

        // Update experience
        await tx
          .update(userExperiences)
          .set({
            title: props.experience.title,
            companyName: props.experience.companyName,
            employmentType: props.experience.employmentType,
            startDate: props.experience.startDate,
            endDate: props.experience.endDate || null,
            description: props.experience.description || null,
            skills: props.experience.skills || null,
            location: props.experience.location || null,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(userExperiences.id, props.experience.id))

        const mediaToDelete = await tx
          .select({ url: experienceFiles.url })
          .from(experienceFiles)
          .where(eq(experienceFiles.experienceId, props.experience.id))

        await tx
          .delete(experienceFiles)
          .where(eq(experienceFiles.experienceId, props.experience.id))

        const paths = mediaToDelete
          .map((f) =>
            getPathFromPublicUrl(f.url, StorageBucketType.Experiences),
          )
          .filter((p): p is string => p !== null)

        if (paths.length > 0) {
          await supabase.storage
            .from(StorageBucketType.Experiences)
            .remove(paths)
        }

        await tx
          .delete(experienceProjects)
          .where(eq(experienceProjects.experienceId, props.experience.id))

        experienceId = props.experience.id
      } else {
        const [newExperience] = await tx
          .insert(userExperiences)
          .values({
            userId: userId,
            title: props.experience.title,
            companyName: props.experience.companyName,
            employmentType: props.experience.employmentType,
            startDate: props.experience.startDate,
            endDate: props.experience.endDate || null,
            description: props.experience.description || null,
            skills: props.experience.skills || null,
            location: props.experience.location || null,
          })
          .returning({ id: userExperiences.id })

        experienceId = newExperience.id
      }

      if (experienceId != -1) {
        // attach files
        if (props.experience.files.length > 0) {
          await tx.insert(experienceFiles).values(
            props.experience.files.map((item) => ({
              experienceId: experienceId,
              ...item,
            })),
          )
        }

        // link projects
        const existingProjectIds = Array.from(
          new Set(props.experience.projects.map((p) => p.id)),
        )

        const newLinks = existingProjectIds.map((projectId) => ({
          experienceId: experienceId,
          projectId: projectId,
        }))

        if (newLinks.length > 0) {
          await tx.insert(experienceProjects).values(newLinks)
        }
      }
    })

    if (experienceId == -1) {
      return {
        status: 'error',
        message: 'Failed to complete operation. Try again later.',
      }
    }

    const updatedExperience = await db.query.userExperiences.findFirst({
      where: eq(userExperiences.id, experienceId),
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
      },
    })

    if (!updatedExperience) {
      return {
        status: 'error',
        message: 'Failed to complete operation. Try again later.',
      }
    }

    return {
      status: 'success',
      message: isUpdate ? 'Experience updated' : 'Experience created',
      data: updatedExperience,
    }
  } catch (e) {
    console.log('getExperiences', e)
    return {
      status: 'error',
      message: 'Failed to fetch experiences. Please try again later.',
    }
  }
}

type DeleteExperienceProps = {
  experienceId: UserExperience['id']
}
export async function deleteUserExperience(
  props: DeleteExperienceProps,
): Promise<ServerResponse<boolean>> {
  try {
    const userRes = await getUser()
    if (userRes.status === 'error') return userRes

    const userId = userRes.data.id
    const supabase = await createClient()

    const experience = await db.query.userExperiences.findFirst({
      where: and(
        eq(userExperiences.id, props.experienceId),
        eq(userExperiences.userId, userId),
      ),
      with: {
        files: true,
        projects: true,
      },
    })

    if (!experience) {
      return { status: 'error', message: 'Experience not found' }
    }

    const deleted = await db
      .delete(userExperiences)
      .where(
        and(
          eq(userExperiences.id, props.experienceId),
          eq(userExperiences.userId, userId),
        ),
      )
      .returning()

    if (deleted.length === 0) {
      return { status: 'error', message: 'Experience not found' }
    }

    if (experience.files.length > 0) {
      const filePaths = experience.files
        .map((f) => getPathFromPublicUrl(f.url, StorageBucketType.Experiences))
        .filter((p): p is string => p !== null)

      if (filePaths.length > 0) {
        await supabase.storage
          .from(StorageBucketType.Experiences)
          .remove(filePaths)
      }
    }

    return { status: 'success', data: true, message: 'Experience deleted' }
  } catch (e) {
    console.log('deleteUserExperience', e)
    return {
      status: 'error',
      message: 'Failed to delete experience. Please try again later.',
    }
  }
}
