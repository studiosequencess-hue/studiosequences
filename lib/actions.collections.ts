'use server'

import { Project, ServerResponse, Collection } from '@/lib/models'
import { getUser } from '@/lib/actions.auth'
import { db } from '@/db/client'
import { collections, collectionProjects } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'

export async function getPersonalCollections(): Promise<
  ServerResponse<Collection[]>
> {
  try {
    const userResponse = await getUser()
    if (userResponse.status === 'error') {
      return userResponse
    }

    // Fetch collections with nested relations
    const collectionsData = await db.query.collections.findMany({
      where: eq(collections.user_id, userResponse.data.id),
      orderBy: [asc(collections.created_at)],
      with: {
        collectionProjects: {
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

    const formattedCollections: Collection[] = collectionsData.map(
      (collection) => ({
        ...collection,
        projects:
          collection.collectionProjects
            ?.map((cp) => cp.project)
            .filter((p): p is Project => !!p) || [],
      }),
    )

    return {
      status: 'success',
      message: 'Successfully fetched collections.',
      data: formattedCollections,
    }
  } catch (e) {
    console.log('getPersonalCollections', e)
    return {
      status: 'error',
      message: 'Failed to fetch user. Please try again later.',
    }
  }
}

type CreateCollectionProps = Pick<Collection, 'name'>
export async function createCollection(
  props: CreateCollectionProps,
): Promise<ServerResponse<Collection>> {
  try {
    const userResponse = await getUser()
    if (userResponse.status === 'error') {
      return userResponse
    }

    // Insert collection
    const insertResponse = await db
      .insert(collections)
      .values({
        name: props.name,
        user_id: userResponse.data.id,
      })
      .returning()

    const newCollection = insertResponse[0]

    if (!newCollection) {
      return {
        status: 'error',
        message: 'Failed to create collection',
      }
    }

    return {
      status: 'success',
      message: 'Successfully created collection.',
      data: {
        ...newCollection,
        projects: [],
      },
    }
  } catch (e) {
    console.log('createCollection', e)
    return {
      status: 'error',
      message: 'Failed to create collection. Please try again later.',
    }
  }
}

type AddProjectsToCollectionProps = {
  projectIds: Project['id'][]
  collectionId: Collection['id']
}
export async function addProjectsToCollection(
  props: AddProjectsToCollectionProps,
): Promise<ServerResponse<boolean>> {
  try {
    const userResponse = await getUser()
    if (userResponse.status === 'error') {
      return userResponse
    }

    await db.transaction(async (tx) => {
      await tx
        .delete(collectionProjects)
        .where(eq(collectionProjects.collection_id, props.collectionId))

      if (props.projectIds.length > 0) {
        await tx.insert(collectionProjects).values(
          props.projectIds.map((projectId) => ({
            project_id: projectId,
            collection_id: props.collectionId,
          })),
        )
      }
    })

    return {
      status: 'success',
      message: 'Successfully added projects to collection.',
      data: true,
    }
  } catch (e) {
    console.log('addProjectsToCollection', e)
    return {
      status: 'error',
      message: 'Failed to add projects to collection. Please try again later.',
    }
  }
}

type DeleteCollectionProps = {
  id: Collection['id']
}
export async function deleteCollection(
  props: DeleteCollectionProps,
): Promise<ServerResponse<boolean>> {
  try {
    const userResponse = await getUser()
    if (userResponse.status === 'error') {
      return userResponse
    }

    await db.delete(collections).where(eq(collections.id, props.id))

    return {
      status: 'success',
      message: 'Successfully deleted collection.',
      data: true,
    }
  } catch (e) {
    console.log('deleteCollection', e)
    return {
      status: 'error',
      message: 'Failed to delete collection. Please try again later.',
    }
  }
}
