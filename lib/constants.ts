export enum UserRole {
  User = 'user',
  Company = 'company',
  Admin = 'admin',
}

export const AUTH_CHECK_EVENT_ID = 'custom:auth-check'

export enum StoragePath {
  User = 'users/{id}',
}

export enum StorageBucketType {
  Images = 'images',
  Videos = 'videos',
  Files = 'files',
}
