import { Database } from '@/lib/supabase.types'
import { User as SupabaseUser } from '@supabase/auth-js'
import {
  projects,
  projectFiles,
  projectMembers,
  users,
  collections,
  collectionProjects,
  events,
  stories,
} from '@/db/schema'
import { InferSelectModel } from 'drizzle-orm'

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

export type DBUser = typeof users.$inferSelect

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
  DBUser

export type DBUserWithFollowStatus = DBUser & {
  is_following: boolean
}

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

export type Project = InferSelectModel<typeof projects> & {
  files: ProjectFile[]
  files_count?: { count: number }[]
  members?: ProjectMember[]
  members_count?: {
    count: number
  }[]
  is_revealed?: boolean
}

export type ProjectFile = InferSelectModel<typeof projectFiles>

export type ProjectMember = typeof projectMembers.$inferSelect & {
  user?: DBUser | null
}

type ProjectBaseMedia = Pick<
  ProjectFile,
  'name' | 'title' | 'description' | 'type'
>
export type ProjectFormFile = ProjectBaseMedia & (FileMedia | URLMedia)

export type Post = Tables<'posts'> & {
  user: DBUser
  likes?: PostLike[]
  comments?: PostComment[]
  files?: PostFile[]
  projects?: Project[]
  user_liked?: boolean
}
export type PostLike = Tables<'post_likes'>
export type PostComment = Tables<'post_comments'>
export type PostFile = Tables<'post_files'>
export type PostProject = Tables<'post_projects'>
export type UserPostBookmarks = Tables<'user_post_bookmarks'>

type PostBaseMedia = Pick<PostFile, 'name' | 'type'>

export type PostFormFile = PostBaseMedia & (FileMedia | URLMedia)

export type Collection = InferSelectModel<typeof collections> & {
  projects: Project[]
}

export type CollectionProject = InferSelectModel<typeof collectionProjects>

export type CompanyEvent = InferSelectModel<typeof events> & {
  user: DBUser | null
}
export type FormCompanyEvent = Omit<
  CompanyEvent,
  'id' | 'created_at' | 'user_id' | 'user'
>

export type Story = InferSelectModel<typeof stories>

export type StoryWithUser = Story & {
  user: Pick<
    DBUser,
    'id' | 'first_name' | 'last_name' | 'username' | 'avatar' | 'company_name'
  >
  has_unseen: boolean
}
