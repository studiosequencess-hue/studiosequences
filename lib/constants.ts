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

export enum POST_VISIBILITY {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export enum POSTS_LIST_TYPE {
  DISCOVER = 'discover',
  PERSONAL = 'personal',
}

export enum QUERY_KEYS {
  PERSONAL_POSTS = 'personal-posts',
  DISCOVER_POSTS = 'discover-posts',
  POST = 'post',
  DELETE_POST = 'delete-post',
  TOGGLE_LIKE_POST = 'toggle-like-post',
  EDITOR_SAVE = 'editor-save',
}
