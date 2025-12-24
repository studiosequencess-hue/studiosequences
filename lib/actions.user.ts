'use server'

import { createClient } from '@/lib/supabase.server'
import { ServerResponse, User, UserInfo } from '@/lib/models'
import { DEFAULT_USER_INFO } from '@/lib/defaults'
import deepmerge from 'deepmerge'
import { UserRole } from '@/lib/constants'

export async function getUserById(
  id: User['id'],
): Promise<ServerResponse<UserInfo>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)

    if (error || !data || data.length == 0) {
      return {
        status: 'error',
        message: 'No such user found.',
      }
    }

    return {
      status: 'success',
      message: 'Successfully fetched user.',
      data: deepmerge(DEFAULT_USER_INFO, data[0]),
    }
  } catch (e) {
    console.log('getUser', e)
    return {
      status: 'error',
      message: 'Failed to fetch user. Please try again later.',
    }
  }
}

export async function getUserByUsername(
  username: User['username'],
): Promise<ServerResponse<UserInfo>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)

    if (error || !data || data.length == 0) {
      return {
        status: 'error',
        message: 'No such user found.',
      }
    }

    return {
      status: 'success',
      message: 'Successfully fetched user.',
      data: deepmerge(DEFAULT_USER_INFO, data[0]),
    }
  } catch (e) {
    console.log('getUser', e)
    return {
      status: 'error',
      message: 'Failed to fetch user. Please try again later.',
    }
  }
}

type UpdateUserInfoProps = Partial<UserInfo> & {
  user_id: User['id']
}
export async function updateUserInfo(
  props: UpdateUserInfoProps,
): Promise<ServerResponse<boolean>> {
  try {
    const { user_id, ...newUserInfo } = props

    const supabase = await createClient()
    const [currentUserResponse, userByIdResponse] = await Promise.all([
      supabase.auth.getUser(),
      getUserById(user_id),
    ])

    if (currentUserResponse.error) {
      return {
        status: 'error',
        message: currentUserResponse.error.message,
      }
    }

    if (userByIdResponse.status == 'error') {
      return {
        status: 'error',
        message: userByIdResponse.message,
      }
    }

    if (
      currentUserResponse.data.user.role != UserRole.Admin.toString() &&
      currentUserResponse.data.user.id != userByIdResponse.data.id
    ) {
      return {
        status: 'error',
        message: 'Invalid access permission. Please try again later.',
      }
    }

    const updateResponse = await supabase
      .from('users')
      .update(newUserInfo)
      .eq('id', user_id)

    if (updateResponse.error) {
      return {
        status: 'error',
        message: updateResponse.error.message,
      }
    }

    return {
      status: 'success',
      message: 'Successfully updated user info.',
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
