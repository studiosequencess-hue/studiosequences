'use server'

import { createClient } from '@/lib/supabase.server'
import { ServerResponse, SignInData, SignUpData, User } from '@/lib/models'
import { DEFAULT_USER } from '@/lib/defaults'
import deepmerge from 'deepmerge'

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

    return getUser()
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

    const { error } = await supabase.auth.signUp({
      email: signUpData.email,
      password: signUpData.password,
    })

    if (error) {
      return {
        status: 'error',
        message: error.message,
      }
    }

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
