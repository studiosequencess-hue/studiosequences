'use server'

import { createClient } from '@/lib/supabase.server'
import {
  ProjectFormFile,
  Project,
  ProjectFile,
  ProjectMember,
  ServerResponse,
  User,
  Collection,
} from '@/lib/models'
import { getUser } from '@/lib/actions.auth'

export async function getPersonalCollections(): Promise<
  ServerResponse<Collection[]>
> {
  try {
    const supabase = await createClient()
    const userResponse = await getUser()

    if (userResponse.status === 'error') {
      return userResponse
    }

    const collectionsResponse = await supabase
      .from('collections')
      .select(
        '*, collection_projects(*, project:projects(*, files:project_files(*), files_count:project_files(count)))',
        { count: 'exact' },
      )
      .eq('user_id', userResponse.data.id)
      .order('created_at', { ascending: true })

    if (collectionsResponse.error) {
      return {
        status: 'error',
        message: collectionsResponse.error.message,
      }
    }

    return {
      status: 'success',
      message: 'Successfully fetched collections.',
      data: collectionsResponse.data.map((collection) => ({
        ...collection,
        projects: collection.collection_projects
          .map((item) => item.project)
          .filter((item) => !!item),
      })),
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
    const supabase = await createClient()
    const userResponse = await getUser()

    if (userResponse.status === 'error') {
      return userResponse
    }

    const collectionsResponse = await supabase
      .from('collections')
      .insert([
        {
          name: props.name,
          user_id: userResponse.data.id,
        },
      ])
      .select(
        '*, collection_projects(*, project:projects(*, files:project_files(*), files_count:project_files(count)))',
      )
      .single()

    if (collectionsResponse.error) {
      console.log('createCollection', collectionsResponse.error)
      return {
        status: 'error',
        message: collectionsResponse.error.message,
      }
    }

    return {
      status: 'success',
      message: 'Successfully created collection.',
      data: {
        ...collectionsResponse.data,
        projects: collectionsResponse.data.collection_projects
          .map((item) => item.project)
          .filter((item) => !!item),
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
    const supabase = await createClient()
    const userResponse = await getUser()

    if (userResponse.status === 'error') {
      return userResponse
    }

    await supabase.from('collection_projects').delete().match({
      collection_id: props.collectionId,
    })
    const addProjectsToCollectionsResponse = await supabase
      .from('collection_projects')
      .insert(
        props.projectIds.map((projectId) => ({
          project_id: projectId,
          collection_id: props.collectionId,
        })),
      )

    if (addProjectsToCollectionsResponse.error) {
      console.log('createCollection', addProjectsToCollectionsResponse.error)
      return {
        status: 'error',
        message: addProjectsToCollectionsResponse.error.message,
      }
    }

    return {
      status: 'success',
      message: 'Successfully added projects to collection.',
      data: true,
    }
  } catch (e) {
    console.log('createCollection', e)
    return {
      status: 'error',
      message: 'Failed to create collection. Please try again later.',
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
    const supabase = await createClient()
    const userResponse = await getUser()

    if (userResponse.status === 'error') {
      return userResponse
    }

    await supabase.from('collections').delete().match({
      id: props.id,
    })

    return {
      status: 'success',
      message: 'Successfully deleted collection.',
      data: true,
    }
  } catch (e) {
    console.log('createCollection', e)
    return {
      status: 'error',
      message: 'Failed to create collection. Please try again later.',
    }
  }
}
