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

export type User = {
  id: string
  email: string
  email_confirmed_at: Date | null
  phone: string
  phone_confirmed_at: Date | null
  confirmed_at: Date | null
  last_sign_in_at: Date | null
  created_at: Date | null
  updated_at: Date | null
  is_anonymous: boolean
}

export type SignInData = {
  email: User['email']
  password: string
}

export type SignUpData = {
  email: User['email']
  phone: User['phone']
  password: string
}
