import { Database } from '@/lib/supabase.types'
import { User as SupabaseUser } from '@supabase/auth-js'

export interface UserImage {
  url: string
}

export type FileMedia = {
  uploadType: 'file'
  file: File
}

export type URLMedia = {
  uploadType: 'url'
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
  role: string
  first_name: string
  last_name: string
  pronoun: string
  username: string
  email: string
  contact: string
  password: string
  company_name: string
}

export type Project = Tables<'projects'> & {
  files: ProjectFile[]
  files_count: {
    count: number
  }[]
  members?: ProjectMember[]
  members_count?: {
    count: number
  }[]
  is_revealed?: boolean
}

export type ProjectFile = Tables<'project_files'>

export type ProjectMember = Tables<'project_members'> & {
  user?: UserInfo | null
}

type ProjectBaseMedia = Pick<
  ProjectFile,
  'name' | 'title' | 'description' | 'type'
>
export type ProjectFormFile = ProjectBaseMedia & (FileMedia | URLMedia)

export type Post = Tables<'posts'> & {
  user: UserInfo
  likes?: PostLike[]
  comments?: PostComment[]
  files?: PostFile[]
  projects?: Project[]
}
export type PostLike = Tables<'post_likes'>
export type PostComment = Tables<'post_comments'>
export type PostFile = Tables<'post_files'>
export type PostProject = Tables<'post_projects'>
export type UserPostBookmarks = Tables<'user_post_bookmarks'>

type PostBaseMedia = Pick<PostFile, 'name' | 'type'>

export type PostFormFile = PostBaseMedia & (FileMedia | URLMedia)
