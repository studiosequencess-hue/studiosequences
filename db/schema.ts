import {
  pgTable,
  bigint,
  text,
  timestamp,
  boolean,
  varchar,
  doublePrecision,
  integer,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  role: varchar('role', { length: 255 }).notNull(),
  pronoun: text('pronoun'),
  avatar: text('avatar'),
  background_top: text('background_top'),
  background_bottom: text('background_bottom'),
  occupation: text('occupation'),
  is_open_to_work: boolean('is_open_to_work').notNull(),
  location: text('location'),
  is_verified: boolean('is_verified'),
  first_name: text('first_name'),
  last_name: text('last_name'),
  username: text('username').unique().notNull(),
  email: text('email').unique().notNull(),
  contact: text('contact'),
  instagram: text('instagram'),
  twitter: text('twitter'),
  facebook: text('facebook'),
  linkedin: text('linkedin'),
  company_name: text('company_name'),
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
  experiences: many(userExperiences),
}))

export const stories = pgTable('stories', {
  id: bigint('id', { mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  user_id: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  url: text('url').notNull(),
  type: text('type').notNull(),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
  expires_at: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
})

export const story_views = pgTable(
  'story_views',
  {
    user_id: text('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    story_id: bigint('story_id', { mode: 'number' })
      .references(() => stories.id, { onDelete: 'cascade' })
      .notNull(),
    created_at: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    pk: { columns: [table.user_id, table.story_id] },
  }),
)

export const storiesRelations = relations(stories, ({ one, many }) => ({
  user: one(users, { fields: [stories.user_id], references: [users.id] }),
  views: many(story_views),
}))

export const storyViewsRelations = relations(story_views, ({ one }) => ({
  user: one(users, { fields: [story_views.user_id], references: [users.id] }),
  story: one(stories, {
    fields: [story_views.story_id],
    references: [stories.id],
  }),
}))

export const posts = pgTable('posts', {
  id: bigint('id', { mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  user_id: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  content: text('content').notNull(),
  likes_count: bigint('likes_count', { mode: 'number' }).default(0).notNull(),
  comments_count: bigint('comments_count', { mode: 'number' })
    .default(0)
    .notNull(),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  visibility: text('visibility').default('public'),
})

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, { fields: [posts.user_id], references: [users.id] }),
  comments: many(postComments),
  likes: many(postLikes),
  reposts: many(postReposts),
  files: many(postFiles),
  projects: many(postProjects),
  bookmarks: many(userPostBookmarks),
}))

export const postComments = pgTable('post_comments', {
  id: bigint('id', { mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  user_id: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  post_id: bigint('post_id', { mode: 'number' })
    .references(() => posts.id, { onDelete: 'cascade' })
    .notNull(),
  content: text('content'),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
})

export const postCommentsRelations = relations(postComments, ({ one }) => ({
  user: one(users, { fields: [postComments.user_id], references: [users.id] }),
  post: one(posts, { fields: [postComments.post_id], references: [posts.id] }),
}))

export const postLikes = pgTable('post_likes', {
  id: bigint('id', { mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  user_id: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  post_id: bigint('post_id', { mode: 'number' })
    .references(() => posts.id, { onDelete: 'cascade' })
    .notNull(),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
})

export const postLikesRelations = relations(postLikes, ({ one }) => ({
  user: one(users, { fields: [postLikes.user_id], references: [users.id] }),
  post: one(posts, { fields: [postLikes.post_id], references: [posts.id] }),
}))

export const postFiles = pgTable('post_files', {
  id: bigint('id', { mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  url: text('url').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  type: text('type').default('image').notNull(),
  post_id: bigint('post_id', { mode: 'number' })
    .references(() => posts.id, { onDelete: 'cascade' })
    .notNull(),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
})

export const postFilesRelations = relations(postFiles, ({ one }) => ({
  post: one(posts, { fields: [postFiles.post_id], references: [posts.id] }),
}))

export const postProjects = pgTable('post_projects', {
  id: bigint('id', { mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  project_id: bigint('project_id', { mode: 'number' })
    .references(() => projects.id, { onDelete: 'cascade' })
    .notNull(),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
  post_id: bigint('post_id', { mode: 'number' })
    .references(() => posts.id, { onDelete: 'cascade' })
    .notNull(),
})

export const postProjectsRelations = relations(postProjects, ({ one }) => ({
  project: one(projects, {
    fields: [postProjects.project_id],
    references: [projects.id],
  }),
  post: one(posts, { fields: [postProjects.post_id], references: [posts.id] }),
}))

export const postReposts = pgTable('post_reposts', {
  id: bigint('id', { mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  post_id: bigint('post_id', { mode: 'number' })
    .references(() => posts.id, { onDelete: 'cascade' })
    .notNull(),
  repost_id: bigint('repost_id', { mode: 'number' }).references(
    () => posts.id,
    {
      onDelete: 'set null',
    },
  ),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
})

export const postRepostsRelations = relations(postReposts, ({ one }) => ({
  post: one(posts, { fields: [postReposts.post_id], references: [posts.id] }),
  repost: one(posts, {
    fields: [postReposts.repost_id],
    references: [posts.id],
  }),
}))

export const userPostBookmarks = pgTable('user_post_bookmarks', {
  id: bigint('id', { mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  user_id: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  post_id: bigint('post_id', { mode: 'number' })
    .references(() => posts.id, { onDelete: 'cascade' })
    .notNull(),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
})

export const userPostBookmarksRelations = relations(
  userPostBookmarks,
  ({ one }) => ({
    user: one(users, {
      fields: [userPostBookmarks.user_id],
      references: [users.id],
    }),
    post: one(posts, {
      fields: [userPostBookmarks.post_id],
      references: [posts.id],
    }),
  }),
)

export const projects = pgTable('projects', {
  id: bigint('id', { mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  user_id: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  description: text('description'),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
  is_sensitive: boolean('is_sensitive'),
  position: doublePrecision('position').default(0),
})

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, { fields: [projects.user_id], references: [users.id] }),
  files: many(projectFiles),
  members: many(projectMembers),
  collectionProjects: many(collectionProjects),
  postProjects: many(postProjects),
}))

export const projectFiles = pgTable('project_files', {
  id: bigint('id', { mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  title: text('title'),
  description: text('description'),
  project_id: bigint('project_id', { mode: 'number' })
    .references(() => projects.id, { onDelete: 'cascade' })
    .notNull(),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
  url: text('url').notNull(),
  type: text('type').notNull(),
  name: text('name').notNull(),
})

export const projectFilesRelations = relations(projectFiles, ({ one }) => ({
  project: one(projects, {
    fields: [projectFiles.project_id],
    references: [projects.id],
  }),
}))

export const projectMembers = pgTable('project_members', {
  id: bigint('id', { mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  user_id: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  department: text('department').notNull(),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
  project_id: bigint('project_id', { mode: 'number' })
    .references(() => projects.id, { onDelete: 'cascade' })
    .notNull(),
})

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  user: one(users, {
    fields: [projectMembers.user_id],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [projectMembers.project_id],
    references: [projects.id],
  }),
}))

export const collections = pgTable('collections', {
  id: bigint('id', { mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  name: text('name').notNull(),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
  user_id: text('user_id').references(() => users.id, { onDelete: 'set null' }),
})

export const collectionsRelations = relations(collections, ({ one, many }) => ({
  user: one(users, { fields: [collections.user_id], references: [users.id] }),
  collectionProjects: many(collectionProjects),
}))

export const collectionProjects = pgTable('collection_projects', {
  id: bigint('id', { mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  collection_id: bigint('collection_id', { mode: 'number' }).references(
    () => collections.id,
    { onDelete: 'set null' },
  ),
  project_id: bigint('project_id', { mode: 'number' }).references(
    () => projects.id,
    { onDelete: 'set null' },
  ),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
})

export const collectionProjectsRelations = relations(
  collectionProjects,
  ({ one }) => ({
    collection: one(collections, {
      fields: [collectionProjects.collection_id],
      references: [collections.id],
    }),
    project: one(projects, {
      fields: [collectionProjects.project_id],
      references: [projects.id],
    }),
  }),
)

export const events = pgTable('events', {
  id: bigint('id', { mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  user_id: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  start_date: timestamp('start_date', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
  end_date: timestamp('end_date', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
  location: text('location').notNull(),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
  background_url: text('background_url'),
  tag: text('tag').notNull(),
})

export const eventsRelations = relations(events, ({ one }) => ({
  user: one(users, { fields: [events.user_id], references: [users.id] }),
}))

export const follows = pgTable(
  'follows',
  {
    follower_id: text('follower_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    following_id: text('following_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    created_at: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    pk: { columns: [table.follower_id, table.following_id] },
  }),
)

export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(users, {
    fields: [follows.follower_id],
    references: [users.id],
    relationName: 'follower',
  }),
  following: one(users, {
    fields: [follows.following_id],
    references: [users.id],
    relationName: 'following',
  }),
}))

export const conversations = pgTable('conversations', {
  id: bigint('id', { mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
  is_group: boolean('is_group').default(false),
  name: text('name'),
})

export const conversation_participants = pgTable(
  'conversation_participants',
  {
    id: bigint('id', { mode: 'number' })
      .generatedAlwaysAsIdentity()
      .primaryKey(),
    conversation_id: bigint('conversation_id', { mode: 'number' })
      .references(() => conversations.id, { onDelete: 'cascade' })
      .notNull(),
    user_id: text('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    joined_at: timestamp('joined_at', { withTimezone: true, mode: 'date' })
      .defaultNow()
      .notNull(),
    role: text('role').default('member'), // 'admin', 'member'
  },
  (table) => ({
    unq: { columns: [table.conversation_id, table.user_id] } as const,
  }),
)

export const messages = pgTable('messages', {
  id: bigint('id', { mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  conversation_id: bigint('conversation_id', { mode: 'number' })
    .references(() => conversations.id, { onDelete: 'cascade' })
    .notNull(),
  sender_id: text('sender_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  content: text('content'),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'date' }),
  is_deleted: boolean('is_deleted').default(false),
})

export const message_attachments = pgTable('message_attachments', {
  id: bigint('id', { mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  message_id: bigint('message_id', { mode: 'number' })
    .references(() => messages.id, { onDelete: 'cascade' })
    .notNull(),
  url: text('url').notNull(),
  name: text('name').notNull(),
  type: text('type').notNull(), // 'image', 'video', 'file'
  size: integer('size'),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
})

export const conversation_requests = pgTable('conversation_requests', {
  id: bigint('id', { mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  user_id: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  company_id: text('company_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  status: text('status').default('pending').notNull(), // 'pending', 'approved', 'rejected'
  message: text('message'), // Initial message from user
  created_at: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'date' }),
})

export const conversationsRelations = relations(conversations, ({ many }) => ({
  participants: many(conversation_participants),
  messages: many(messages),
}))

export const conversationParticipantsRelations = relations(
  conversation_participants,
  ({ one }) => ({
    conversation: one(conversations, {
      fields: [conversation_participants.conversation_id],
      references: [conversations.id],
    }),
    user: one(users, {
      fields: [conversation_participants.user_id],
      references: [users.id],
    }),
  }),
)

export const messagesRelations = relations(messages, ({ one, many }) => ({
  conversation: one(conversations, {
    fields: [messages.conversation_id],
    references: [conversations.id],
  }),
  sender: one(users, { fields: [messages.sender_id], references: [users.id] }),
  attachments: many(message_attachments),
}))

export const messageAttachmentsRelations = relations(
  message_attachments,
  ({ one }) => ({
    message: one(messages, {
      fields: [message_attachments.message_id],
      references: [messages.id],
    }),
  }),
)

export const userExperiences = pgTable('user_experiences', {
  id: bigint('id', { mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  user_id: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(),
  company_name: text('company_name').notNull(),
  employment_type: text('employment_type').notNull(),
  start_date: timestamp('start_date', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
  end_date: timestamp('end_date', { withTimezone: true, mode: 'date' }),
  description: text('description'),
  skills: text('skills'),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
})

export const userExperienceMedia = pgTable('experience_media', {
  id: bigint('id', { mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  experience_id: bigint('experience_id', { mode: 'number' })
    .references(() => userExperiences.id, { onDelete: 'cascade' })
    .notNull(),
  url: text('url').notNull(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  size: bigint('size', { mode: 'number' }),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .defaultNow()
    .notNull(),
})

export const userExperiencesRelations = relations(
  userExperiences,
  ({ one }) => ({
    user: one(users, {
      fields: [userExperiences.user_id],
      references: [users.id],
    }),
  }),
)
