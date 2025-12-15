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
  | 'phone'
  | 'is_anonymous'
  | 'created_at'
  | 'updated_at'
  | 'deleted_at'
  | 'confirmed_at'
  | 'email_confirmed_at'
  | 'last_sign_in_at'
> &
  UserInfo

// export type User = {
//   id: string
//   email: string
//   role: 'user' | 'company' | 'admin'
//   email_confirmed_at: Date | null
//   phone: string
//   phone_confirmed_at: Date | null
//   confirmed_at: Date | null
//   last_sign_in_at: Date | null
//   created_at: Date | null
//   updated_at: Date | null
//   is_anonymous: boolean
//   avatar: string
//   pronoun: string
//   background_top: string
//   background_bottom: string
//   occupation: string
//   is_open_to_work: boolean
//   location: string
//   socials: UserSocial[]
// }
//
// export type UserSocial = {
//   id: string
//   name: string
//   url: string
//   user_id: string
// }

export type SignInData = {
  email: string
  password: string
}

export type SignUpData = {
  first_name: string
  last_name: string
  pronoun: string
  username: string
  email: string
  phone: string
  password: string
}
