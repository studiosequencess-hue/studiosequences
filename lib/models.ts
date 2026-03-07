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
  postLikes,
  posts,
  postFiles,
  postComments,
  postProjects,
  userPostBookmarks,
  conversations,
  messages,
  userExperiences,
  experienceMedia,
  experienceProjects,
} from '@/drizzle/schema'
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

export type DBUser = InferSelectModel<typeof users>

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

export type UserGeneralInfo = Pick<
  DBUser,
  | 'id'
  | 'username'
  | 'firstName'
  | 'lastName'
  | 'avatar'
  | 'role'
  | 'companyName'
  | 'email'
>

export type UserGeneralInfoSearchResult = UserGeneralInfo & {
  has_pending_request: boolean
  has_conversation: boolean
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
  firstName: string
  lastName: string
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

export type Post = InferSelectModel<typeof posts> & {
  user: DBUser
  likes?: PostLike[]
  comments?: PostComment[]
  files?: PostFile[]
  projects?: Project[]
  user_liked?: boolean
  user_bookmarked?: boolean
}
export type PostLike = InferSelectModel<typeof postLikes>
export type PostComment = InferSelectModel<typeof postComments> & {
  user: UserGeneralInfo
}
export type PostFile = InferSelectModel<typeof postFiles>
export type PostProject = InferSelectModel<typeof postProjects>
export type UserPostBookmarks = InferSelectModel<typeof userPostBookmarks>

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
  'id' | 'createdAt' | 'userId' | 'user' | 'updatedAt'
>

export type Story = InferSelectModel<typeof stories>

export type StoryWithUser = Story & {
  user: Pick<
    DBUser,
    'id' | 'firstName' | 'lastName' | 'username' | 'avatar' | 'companyName'
  >
  has_unseen: boolean
}

export type Conversation = InferSelectModel<typeof conversations> & {
  participants: Array<{
    userId: string
    user: Pick<
      DBUser,
      | 'id'
      | 'username'
      | 'firstName'
      | 'lastName'
      | 'companyName'
      | 'avatar'
      | 'role'
      | 'email'
    >
  }>
  last_message?: Pick<Message, 'content' | 'createdAt' | 'senderId'>
  unread_count?: number
}

export type Message = InferSelectModel<typeof messages> & {
  attachments: MessageAttachment[]
  sender: UserGeneralInfo
}

export type MessageAttachment = {
  url: string
  name: string
  type: string
  size: number | null
}

export type UserExperience = InferSelectModel<typeof userExperiences>

export type UserExperienceMedia = InferSelectModel<typeof experienceMedia>

export type UserExperienceProjects = InferSelectModel<typeof experienceProjects>
