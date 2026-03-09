export const MAX_FILE_SIZE = 5 * 1024 * 1024
export const MAX_FILE_SIZE_MB = 5

export enum UserRole {
  User = 'user',
  Company = 'company',
  Admin = 'admin',
}

export const AUTH_CHECK_EVENT_ID = 'custom:auth-check'

export enum StoragePath {
  User = 'users/{id}',
  Events = `/{id}`,
}

export enum StorageBucketType {
  Images = 'images',
  Videos = 'videos',
  Files = 'files',
  Events = 'events',
  Stories = 'stories',
  Messages = 'messages',
  Experiences = 'experiences',
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
  PERSONAL_PROJECTS = 'personal-projects',
  PERSONAL_COLLECTIONS = 'personal-collections',
  PERSONAL_COLLECTION_CREATE = 'personal-collection-create',
  PERSONAL_COLLECTION_DELETE = 'personal-collection-delete',
  FOLLOW_STATUS = 'follow-status',
  FOLLOW_SUGGESTIONS = 'follow-suggestions',
  FOLLOWINGS = 'follow-count-users',
  EVENTS = 'events',
  EVENTS_UPSERT = 'events-upsert',
  EVENTS_DELETE = 'events-delete',
  STORIES_FEED = 'stories-feed',
  STORIES_MY = 'stories-my',
  CONVERSATIONS = 'conversations',
  SEARCH_USERS = 'search-users',
  CONVERSATIONS_START_CHAT = 'conversations-start-chat',
  MESSAGES = 'messages',
  BOOKMARK = 'bookmark',
  BOOKMARKS = 'bookmarks',
  TOGGLE_BOOKMARK_POST = 'toggle-bookmark-post',
  COMMENTS = 'comments',
  COMMENTS_INSERT = 'comments-insert',
  COMMENTS_UPDATE = 'comments-update',
  COMMENTS_DELETE = 'comments-delete',
  EXPERIENCES = 'experiences',
  EXPERIENCES_SAVE = 'experience-save',
  EXPERIENCES_DELETE = 'experience-delete',
}

export enum EMPLOYMENT_TYPE {
  FULL_TIME = 'full-time',
  PART_TIME = 'part-time',
  CONTRACT = 'contract',
  INTERNSHIP = 'internship',
  FREELANCE = 'freelance',
  SELF_EMPLOYED = 'self-employed',
}
