import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import {
  DBUser,
  Project,
  ProjectFile,
  UserExperience,
  UserGeneralInfo,
} from '@/lib/models'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getUserGeneralInfo(user: DBUser): UserGeneralInfo {
  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    company_name: user.company_name,
    role: user.role,
    email: user.email,
    avatar: user.avatar,
    username: user.username,
  }
}

export function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function shuffleArray<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

export function getBaseURL() {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ??
    process?.env?.NEXT_PUBLIC_VERCEL_URL ??
    'http://localhost:3000/'

  url = url.startsWith('http') ? url : `https://${url}`
  url = url.endsWith('/') ? url : `${url}/`
  return url.slice(0, -1)
}

export function getPathFromPublicUrl(
  url: string,
  bucketName: string,
): string | null {
  const parts = url.split(`${bucketName}/`)
  return parts.length > 1 ? parts[1] : null
}

export function getProjectPreviewURL(files: ProjectFile[]): string {
  if (files.length == 0) return '/public/images/placeholder.svg'

  const file = files[0]

  if (file.type == 'image') {
    return file.url
  } else {
    return `${file.url}?t=0.1`
  }
}

export function getProjectFilesCount(project: Project): number {
  if (project.files_count && project.files_count.length > 0) {
    return project.files_count[0].count
  }

  return project.files.length || 0
}

export function getProjectMembersCount(project: Project): number {
  if (!project.members_count) return 0
  if (project.members_count.length > 0) {
    return project.members_count[0].count
  }

  return 0
}

export function getUserFullName(user: UserGeneralInfo): string {
  return (
    [user.first_name, user.last_name]
      .filter((i) => i)
      .join(' ')
      .trim() ||
    user.username ||
    user.email
  )
}

export function getUserInitials(...args: (string | null)[]): string {
  return args
    .filter((i) => i != null)
    .filter((i) => i.length > 0)
    .map((i) => i[0])
    .join('')
    .trim()
    .toUpperCase()
}

export function getTimeForInput(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')

  return `${hours}:${minutes}:${seconds}`
}

export function prepareData<T extends Record<string, unknown>>(
  obj: T,
): { [K in keyof T]: Exclude<T[K], null> } {
  const result = {} as Record<string, unknown>

  for (const [key, value] of Object.entries(obj)) {
    if (value !== null) {
      result[key] = value
    }
  }

  return result as { [K in keyof T]: Exclude<T[K], null> }
}

export function prepareFileType(type: string | null): 'image' | 'video' {
  if (!type) return 'image'

  if (['image', 'video'].includes(type)) {
    return type as 'image' | 'video'
  }

  return 'image'
}

export function calculateDuration(start: string, end: string | null): string {
  const startDate = new Date(start)
  const endDate = end ? new Date(end) : new Date()

  const months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth())

  const years = Math.floor(months / 12)
  const remainingMonths = months % 12

  if (years === 0) return `${remainingMonths} mos`
  if (remainingMonths === 0) return `${years} yr${years > 1 ? 's' : ''}`
  return `${years} yr ${remainingMonths} mos`
}

export function sortExperiences(
  experiences: UserExperience[],
): UserExperience[] {
  return experiences.sort((a, b) => {
    return new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  })
}
