import { Database } from '@/lib/supabase.types'
import { User as SupabaseUser } from '@supabase/auth-js'

export interface UserImage {
  url: string
}

type ServerResponseSuccess<T> = {
  status: 'success'
  message: string
  data: T
}

type ServerResponseError = {
  status: 'error'
  message: string
}

export type ServerResponse<T> = ServerResponseSuccess<T> | ServerResponseError

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type UserInfo = Tables<'users'>

export type User = Pick<
  SupabaseUser,
  | 'id'
  | 'email'
  | 'is_anonymous'
  | 'created_at'
  | 'updated_at'
  | 'deleted_at'
  | 'confirmed_at'
  | 'email_confirmed_at'
  | 'last_sign_in_at'
> &
  UserInfo

export type SignInEmailData = {
  email: string
  password: string
}

export type SignInUsernameData = {
  username: string
  password: string
}

export type PasswordResetRequestData = {
  email: string
}

export type PasswordResetData = {
  password: string
}

export type SignUpData = {
  first_name: string
  last_name: string
  pronoun: string
  username: string
  email: string
  contact: string
  password: string
}

export type Project = Tables<'projects'> & {
  images: ProjectImage[]
  is_revealed?: boolean
}

export type ProjectImage = Tables<'project_images'>

export type FormProjectFile = {
  file: File
  title: string
  description: string
}
