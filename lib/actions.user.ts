'use server'

import { db } from '@/db/client'
import { users } from '@/db/schema'
import { eq, or, and, sql } from 'drizzle-orm'
import { ServerResponse, User, DBUser } from '@/lib/models'
import { DEFAULT_USER_INFO } from '@/lib/defaults'
import deepmerge from 'deepmerge'
import { UserRole } from '@/lib/constants'
import { getUser } from '@/lib/actions.auth'
import { prepareData } from '@/lib/utils'

export async function getOnlyCompanies(): Promise<ServerResponse<DBUser[]>> {
  try {
    const data = await db.select().from(users).where(eq(users.role, 'company'))

    return {
      status: 'success',
      message: 'Successfully fetched companies.',
      data: data,
    }
  } catch (e) {
    console.log('getOnlyCompanies', e)
    return {
      status: 'error',
      message: 'Failed to fetch companies. Please try again later.',
    }
  }
}

export async function getUserById(
  id: User['id'],
): Promise<ServerResponse<DBUser>> {
  try {
    const data = await db.select().from(users).where(eq(users.id, id)).limit(1)

    if (!data || data.length === 0) {
      return {
        status: 'error',
        message: 'No such user found.',
      }
    }

    return {
      status: 'success',
      message: 'Successfully fetched user.',
      data: deepmerge(DEFAULT_USER_INFO, data[0] as DBUser),
    }
  } catch (e) {
    console.log('getUserById', e)
    return {
      status: 'error',
      message: 'Failed to fetch user. Please try again later.',
    }
  }
}

export async function getUserByUsername(
  username: User['username'],
): Promise<ServerResponse<DBUser>> {
  try {
    const data = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1)

    if (!data || data.length === 0) {
      return {
        status: 'error',
        message: 'No such user found.',
      }
    }

    return {
      status: 'success',
      message: 'Successfully fetched user.',
      data: deepmerge(DEFAULT_USER_INFO, data[0] as DBUser),
    }
  } catch (e) {
    console.log('getUserByUsername', e)
    return {
      status: 'error',
      message: 'Failed to fetch user. Please try again later.',
    }
  }
}

export async function searchAllUsers(
  value: string,
): Promise<ServerResponse<DBUser[]>> {
  try {
    const searchPattern = `%${value}%`

    const data = await db
      .select()
      .from(users)
      .where(
        or(
          sql`lower(${users.email}) like lower(${searchPattern})`,
          sql`lower(${users.username}) like lower(${searchPattern})`,
          sql`lower(${users.company_name}) like lower(${searchPattern})`,
          sql`lower(${users.first_name}) like lower(${searchPattern})`,
          sql`lower(${users.last_name}) like lower(${searchPattern})`,
        ),
      )
      .limit(10)

    if (!data || data.length === 0) {
      return {
        status: 'error',
        message: 'No user or companies found.',
      }
    }

    return {
      status: 'success',
      message: 'Successfully found users.',
      data: data as DBUser[],
    }
  } catch (e) {
    console.log('searchAllUsers', e)
    return {
      status: 'error',
      message: 'Failed to fetch user. Please try again later.',
    }
  }
}

export async function searchOnlyUsers(
  value: string,
): Promise<ServerResponse<DBUser[]>> {
  try {
    const searchPattern = `%${value}%`

    const data = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.role, 'user'),
          or(
            sql`lower(${users.email}) like lower(${searchPattern})`,
            sql`lower(${users.username}) like lower(${searchPattern})`,
          ),
        ),
      )
      .limit(10)

    if (!data || data.length === 0) {
      return {
        status: 'error',
        message: 'No user or companies found.',
      }
    }

    return {
      status: 'success',
      message: 'Successfully found users.',
      data: data as DBUser[],
    }
  } catch (e) {
    console.log('searchOnlyUsers', e)
    return {
      status: 'error',
      message: 'Failed to fetch users. Please try again later.',
    }
  }
}

type UpdateUserInfoProps = Partial<DBUser> & {
  user_id: User['id']
}

export async function updateUserInfo(
  props: UpdateUserInfoProps,
): Promise<ServerResponse<boolean>> {
  try {
    const { user_id, ...newUserInfo } = props

    const userResponse = await getUser()
    if (userResponse.status == 'error') {
      return userResponse
    }
    const currentUser = userResponse.data

    const userByIdResponse = await getUserById(user_id)
    if (userByIdResponse.status === 'error') {
      return {
        status: 'error',
        message: userByIdResponse.message,
      }
    }
    const user = userByIdResponse.data

    if (currentUser.id != user.id) {
      return {
        status: 'error',
        message: 'Not authorized. Try again.',
      }
    }

    if (
      user.role !== UserRole.Admin.toString() &&
      user.id !== userByIdResponse.data.id
    ) {
      return {
        status: 'error',
        message: 'Invalid access permission. Please try again later.',
      }
    }

    // Update user
    await db
      .update(users)
      .set(prepareData(newUserInfo))
      .where(eq(users.id, user_id))

    return {
      status: 'success',
      message: 'Successfully updated user info.',
      data: true,
    }
  } catch (e) {
    console.log('updateUserInfo', e)
    return {
      status: 'error',
      message: 'Failed to update user. Please try again later.',
    }
  }
}
