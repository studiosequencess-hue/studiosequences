'use server'

import { createClient } from '@/lib/supabase.server'
import {
  ServerResponse,
  SignInData,
  SignUpData,
  User,
  UserInfo,
} from '@/lib/models'
import { DEFAULT_USER, DEFAULT_USER_INFO } from '@/lib/defaults'
import deepmerge from 'deepmerge'
import { QueryData } from '@supabase/supabase-js'

export async function getUser(): Promise<ServerResponse<User>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      return {
        status: 'error',
        message: error.message,
      }
    }

    return {
      status: 'success',
      message: 'Successfully fetched user.',
      data: deepmerge(DEFAULT_USER, data.user),
    }
  } catch (e) {
    console.log('getUser', e)
    return {
      status: 'error',
      message: 'Failed to fetch user. Please try again later.',
    }
  }
}

export async function signInWithEmailPassword(
  signInData: SignInData,
): Promise<ServerResponse<User>> {
  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email: signInData.email,
      password: signInData.password,
    })

    if (error) {
      return {
        status: 'error',
        message: error.message,
      }
    }

    const response = await getUser()

    return {
      ...response,
      message: 'Successfully signed in.',
    }
  } catch (e) {
    console.log('signInWithEmailPassword', e)
    return {
      status: 'error',
      message: 'Failed to sign in user. Please try again later.',
    }
  }
}

export async function signUpWithEmailPassword(
  signUpData: SignUpData,
): Promise<ServerResponse<boolean>> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signUp({
      email: signUpData.email,
      password: signUpData.password,
    })

    if (error) {
      return {
        status: 'error',
        message: error.message,
      }
    }

    await saveUserInfo(
      deepmerge(DEFAULT_USER_INFO, {
        id: data.user?.id || '',
        email: data.user?.email || '',
        username: signUpData.username,
        first_name: signUpData.first_name,
        last_name: signUpData.last_name,
        pronoun: signUpData.pronoun,
      }),
    )

    return {
      status: 'success',
      message: 'Verification email sent. Please check your inbox.',
      data: true,
    }
  } catch (e) {
    console.log('signUpWithEmailPassword', e)
    return {
      status: 'error',
      message: 'Failed to sign up user. Please try again later.',
    }
  }
}

export async function signOut(): Promise<ServerResponse<boolean>> {
  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
      return {
        status: 'error',
        message: error.message,
      }
    }

    return {
      status: 'success',
      message: 'Successfully signed out.',
      data: true,
    }
  } catch (e) {
    console.log('signOut', e)
    return {
      status: 'error',
      message: 'Failed to sign in user. Please try again later.',
    }
  }
}

export async function saveUserInfo(
  userInfo: UserInfo,
): Promise<ServerResponse<UserInfo>> {
  try {
    const supabase = await createClient()

    const { error } = await supabase.from('users').insert({
      ...userInfo,
    })

    if (error) {
      console.log('saveUserInfo error', error)
      return {
        status: 'error',
        message: 'Failed to save user info.',
      }
    }

    return {
      status: 'success',
      message: 'Successfully signed out.',
      data: userInfo,
    }
  } catch (e) {
    console.log('signOut', e)
    return {
      status: 'error',
      message: 'Failed to sign in user. Please try again later.',
    }
  }
}
