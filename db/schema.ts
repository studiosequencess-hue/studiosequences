import {
  pgTable,
  bigint,
  text,
  timestamp,
  boolean,
  varchar,
  doublePrecision,
} from 'drizzle-orm/pg-core'

import { relations } from 'drizzle-orm'

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  role: varchar('role', { length: 255 }).notNull(),
  pronoun: text('pronoun'),
  avatar: text('avatar'),
  backgroundTop: text('background_top'),
  backgroundBottom: text('background_bottom'),
  occupation: text('occupation'),
  isOpenToWork: boolean('is_open_to_work').notNull(),
  location: text('location'),
  isVerified: boolean('is_verified'),
  firstName: text('first_name'),
  lastName: text('last_name'),
  username: text('username').unique().notNull(),
  email: text('email').unique().notNull(),
  contact: text('contact'),
  instagram: text('instagram'),
  twitter: text('twitter'),
  facebook: text('facebook'),
  linkedin: text('linkedin'),
  companyName: text('company_name'),
  about: text('about').default('<p></p>').notNull(),
})

export const usersRelations = relations(users, ({ many }) => ({
  stories: many(stories),
  posts: many(posts),
  postComments: many(postComments),
  postLikes: many(postLikes),
  postBookmarks: many(userPostBookmarks),
  projectMembers: many(projectMembers),
  projects: many(projects),
  collections: many(collections),
  events: many(events),
  followers: many(follows, { relationName: 'following' }),
  following: many(follows, { relationName: 'follower' }),
}))

export const stories = pgTable('stories', {
  id: bigint('id', { mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  url: text('url').notNull(),
  type: text('type').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
})

export const storiesRelations = relations(stories, ({ one, many }) => ({
  user: one(users, { fields: [stories.userId], references: [users.id] }),
  views: many(storyViews),
}))

export const storyViews = pgTable(
  'story_views',
  {
    userId: text('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    storyId: bigint('story_id', { mode: 'number' })
      .references(() => stories.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    pk: { columns: [table.userId, table.storyId] },
  }),
)

export const storyViewsRelations = relations(storyViews, ({ one }) => ({
  user: one(users, { fields: [storyViews.userId], references: [users.id] }),
  story: one(stories, {
    fields: [storyViews.storyId],
    references: [stories.id],
  }),
}))

export const posts = pgTable('posts', {
  id: bigint('id', { mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  content: text('content').notNull(),
  likesCount: bigint('likes_count', { mode: 'number' }).default(0).notNull(),
  commentsCount: bigint('comments_count', { mode: 'number' })
    .default(0)
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  visibility: text('visibility').default('public'),
})

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, { fields: [posts.userId], references: [users.id] }),
  comments: many(postComments),
  likes: many(postLikes),
  reposts: many(postReposts),
  files: many(postFiles),
  projects: many(postProjects),
  bookmarks: many(userPostBookmarks),
}))

export const postComments = pgTable('post_comments', {
  id: bigint('id', { mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  postId: bigint('post_id', { mode: 'number' })
    .references(() => posts.id, { onDelete: 'cascade' })
    .notNull(),
  content: text('content'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
})

export const postCommentsRelations = relations(postComments, ({ one }) => ({
  user: one(users, { fields: [postComments.userId], references: [users.id] }),
  post: one(posts, { fields: [postComments.postId], references: [posts.id] }),
}))

export const postLikes = pgTable('post_likes', {
  id: bigint('id', { mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  postId: bigint('post_id', { mode: 'number' })
    .references(() => posts.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
})

export const postLikesRelations = relations(postLikes, ({ one }) => ({
  user: one(users, { fields: [postLikes.userId], references: [users.id] }),
  post: one(posts, { fields: [postLikes.postId], references: [posts.id] }),
}))

export const postFiles = pgTable('post_files', {
  id: bigint('id', { mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  url: text('url').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  type: text('type').default('image').notNull(),
  postId: bigint('post_id', { mode: 'number' })
    .references(() => posts.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
})

export const postFilesRelations = relations(postFiles, ({ one }) => ({
  post: one(posts, { fields: [postFiles.postId], references: [posts.id] }),
}))

export const postProjects = pgTable('post_projects', {
  id: bigint('id', { mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  projectId: bigint('project_id', { mode: 'number' })
    .references(() => projects.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
  postId: bigint('post_id', { mode: 'number' })
    .references(() => posts.id, { onDelete: 'cascade' })
    .notNull(),
})

export const postProjectsRelations = relations(postProjects, ({ one }) => ({
  project: one(projects, {
    fields: [postProjects.projectId],
    references: [projects.id],
  }),
  post: one(posts, { fields: [postProjects.postId], references: [posts.id] }),
}))

export const postReposts = pgTable('post_reposts', {
  id: bigint('id', { mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  postId: bigint('post_id', { mode: 'number' })
    .references(() => posts.id, { onDelete: 'cascade' })
    .notNull(),
  repostId: bigint('repost_id', { mode: 'number' }).references(() => posts.id, {
    onDelete: 'set null',
  }),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
})

export const postRepostsRelations = relations(postReposts, ({ one }) => ({
  post: one(posts, { fields: [postReposts.postId], references: [posts.id] }),
  repost: one(posts, {
    fields: [postReposts.repostId],
    references: [posts.id],
  }),
}))

export const userPostBookmarks = pgTable('user_post_bookmarks', {
  id: bigint('id', { mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  postId: bigint('post_id', { mode: 'number' })
    .references(() => posts.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
})

export const userPostBookmarksRelations = relations(
  userPostBookmarks,
  ({ one }) => ({
    user: one(users, {
      fields: [userPostBookmarks.userId],
      references: [users.id],
    }),
    post: one(posts, {
      fields: [userPostBookmarks.postId],
      references: [posts.id],
    }),
  }),
)

export const projects = pgTable('projects', {
  id: bigint('id', { mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
  isSensitive: boolean('is_sensitive'),
  position: doublePrecision('position').default(0),
})

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, { fields: [projects.userId], references: [users.id] }),
  files: many(projectFiles),
  members: many(projectMembers),
  collectionProjects: many(collectionProjects),
  postProjects: many(postProjects),
}))

export const projectFiles = pgTable('project_files', {
  id: bigint('id', { mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  title: text('title'),
  description: text('description'),
  projectId: bigint('project_id', { mode: 'number' })
    .references(() => projects.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
  url: text('url').notNull(),
  type: text('type').notNull(),
  name: text('name').notNull(),
})

export const projectFilesRelations = relations(projectFiles, ({ one }) => ({
  project: one(projects, {
    fields: [projectFiles.projectId],
    references: [projects.id],
  }),
}))

export const projectMembers = pgTable('project_members', {
  id: bigint('id', { mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  department: text('department').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
  projectId: bigint('project_id', { mode: 'number' })
    .references(() => projects.id, { onDelete: 'cascade' })
    .notNull(),
})

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  user: one(users, { fields: [projectMembers.userId], references: [users.id] }),
  project: one(projects, {
    fields: [projectMembers.projectId],
    references: [projects.id],
  }),
}))

export const collections = pgTable('collections', {
  id: bigint('id', { mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
})

export const collectionsRelations = relations(collections, ({ one, many }) => ({
  user: one(users, { fields: [collections.userId], references: [users.id] }),
  collectionProjects: many(collectionProjects),
}))

export const collectionProjects = pgTable('collection_projects', {
  id: bigint('id', { mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  collectionId: bigint('collection_id', { mode: 'number' }).references(
    () => collections.id,
    { onDelete: 'set null' },
  ),
  projectId: bigint('project_id', { mode: 'number' }).references(
    () => projects.id,
    { onDelete: 'set null' },
  ),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
})

export const collectionProjectsRelations = relations(
  collectionProjects,
  ({ one }) => ({
    collection: one(collections, {
      fields: [collectionProjects.collectionId],
      references: [collections.id],
    }),
    project: one(projects, {
      fields: [collectionProjects.projectId],
      references: [projects.id],
    }),
  }),
)

export const events = pgTable('events', {
  id: bigint('id', { mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  startDate: timestamp('start_date', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
  endDate: timestamp('end_date', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
  location: text('location').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
  backgroundUrl: text('background_url'),
  tag: text('tag').notNull(),
})

export const eventsRelations = relations(events, ({ one }) => ({
  user: one(users, { fields: [events.userId], references: [users.id] }),
}))

export const follows = pgTable(
  'follows',
  {
    followerId: text('follower_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    followingId: text('following_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    pk: { columns: [table.followerId, table.followingId] },
  }),
)

export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(users, {
    fields: [follows.followerId],
    references: [users.id],
    relationName: 'follower',
  }),
  following: one(users, {
    fields: [follows.followingId],
    references: [users.id],
    relationName: 'following',
  }),
}))
