import {
  pgTable,
  index,
  foreignKey,
  unique,
  bigint,
  text,
  timestamp,
  check,
  integer,
  boolean,
  doublePrecision,
  varchar,
} from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'

export const users = pgTable(
  'users',
  {
    id: text().primaryKey().notNull(),
    role: varchar({ length: 50 }).default('user').notNull(),
    pronoun: text(),
    avatar: text(),
    backgroundTop: text('background_top'),
    backgroundBottom: text('background_bottom'),
    occupation: text(),
    isOpenToWork: boolean('is_open_to_work').default(false),
    location: text(),
    isVerified: boolean('is_verified').default(false),
    firstName: text('first_name'),
    lastName: text('last_name'),
    username: text().notNull(),
    email: text().notNull(),
    contact: text(),
    instagram: text(),
    twitter: text(),
    facebook: text(),
    linkedin: text(),
    companyName: text('company_name'),
    about: text(),
  },
  (table) => [
    index('users_email_idx').using(
      'btree',
      table.email.asc().nullsLast().op('text_ops'),
    ),
    index('users_username_idx').using(
      'btree',
      table.username.asc().nullsLast().op('text_ops'),
    ),
    unique('users_username_unique').on(table.username),
    unique('users_email_unique').on(table.email),
  ],
)

export const follows = pgTable(
  'follows',
  {
    followerId: text('follower_id').notNull(),
    followingId: text('following_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('follows_follower_id_idx').using(
      'btree',
      table.followerId.asc().nullsLast().op('text_ops'),
    ),
    index('follows_following_id_idx').using(
      'btree',
      table.followingId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.followerId],
      foreignColumns: [users.id],
      name: 'follows_follower_id_users_id_fk',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.followingId],
      foreignColumns: [users.id],
      name: 'follows_following_id_users_id_fk',
    }).onDelete('cascade'),
    unique('unique_follow').on(table.followerId, table.followingId),
  ],
)

export const collections = pgTable(
  'collections',
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity({
      name: 'collections_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 9223372036854775807,
      cache: 1,
    }),
    name: text().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    userId: text('user_id'),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('collections_name_idx').using(
      'btree',
      table.name.asc().nullsLast().op('text_ops'),
    ),
    index('collections_user_id_idx').using(
      'btree',
      table.userId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'collections_user_id_users_id_fk',
    }).onDelete('set null'),
  ],
)

export const collectionProjects = pgTable(
  'collection_projects',
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity({
      name: 'collection_projects_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 9223372036854775807,
      cache: 1,
    }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    collectionId: bigint('collection_id', { mode: 'number' }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    projectId: bigint('project_id', { mode: 'number' }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('collection_projects_collection_id_idx').using(
      'btree',
      table.collectionId.asc().nullsLast().op('int8_ops'),
    ),
    index('collection_projects_project_id_idx').using(
      'btree',
      table.projectId.asc().nullsLast().op('int8_ops'),
    ),
    foreignKey({
      columns: [table.collectionId],
      foreignColumns: [collections.id],
      name: 'collection_projects_collection_id_collections_id_fk',
    }).onDelete('set null'),
    foreignKey({
      columns: [table.projectId],
      foreignColumns: [projects.id],
      name: 'collection_projects_project_id_projects_id_fk',
    }).onDelete('set null'),
    unique('unique_collection_project').on(table.collectionId, table.projectId),
  ],
)

export const userExperiences = pgTable(
  'user_experiences',
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity({
      name: 'user_experiences_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 9223372036854775807,
      cache: 1,
    }),
    userId: text('user_id').notNull(),
    title: text().notNull(),
    lastName: text('company_name').notNull(),
    employmentType: text('employment_type').notNull(),
    startDate: timestamp('start_date', {
      withTimezone: true,
      mode: 'string',
    }).notNull(),
    endDate: timestamp('end_date', { withTimezone: true, mode: 'string' }),
    description: text(),
    skills: text(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('user_experiences_start_date_idx').using(
      'btree',
      table.startDate.asc().nullsLast().op('timestamptz_ops'),
    ),
    index('user_experiences_user_id_idx').using(
      'btree',
      table.userId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'user_experiences_user_id_users_id_fk',
    }).onDelete('cascade'),
    check(
      'valid_date_range',
      sql`(end_date IS NULL) OR (end_date >= start_date)`,
    ),
  ],
)

export const postProjects = pgTable(
  'post_projects',
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity({
      name: 'post_projects_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 9223372036854775807,
      cache: 1,
    }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    projectId: bigint('project_id', { mode: 'number' }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    postId: bigint('post_id', { mode: 'number' }).notNull(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('post_projects_post_id_idx').using(
      'btree',
      table.postId.asc().nullsLast().op('int8_ops'),
    ),
    index('post_projects_project_id_idx').using(
      'btree',
      table.projectId.asc().nullsLast().op('int8_ops'),
    ),
    foreignKey({
      columns: [table.postId],
      foreignColumns: [posts.id],
      name: 'post_projects_post_id_posts_id_fk',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.projectId],
      foreignColumns: [projects.id],
      name: 'post_projects_project_id_projects_id_fk',
    }).onDelete('cascade'),
    unique('unique_post_project').on(table.projectId, table.postId),
  ],
)

export const conversations = pgTable(
  'conversations',
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity({
      name: 'conversations_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 9223372036854775807,
      cache: 1,
    }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    isGroup: boolean('is_group').default(false),
    name: text(),
  },
  (table) => [
    index('conversations_updated_at_idx').using(
      'btree',
      table.updatedAt.asc().nullsLast().op('timestamptz_ops'),
    ),
  ],
)

export const conversationParticipants = pgTable(
  'conversation_participants',
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity({
      name: 'conversation_participants_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 9223372036854775807,
      cache: 1,
    }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    conversationId: bigint('conversation_id', { mode: 'number' }).notNull(),
    userId: text('user_id').notNull(),
    joinedAt: timestamp('joined_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    role: text().default('member'),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('conversation_participants_conversation_id_idx').using(
      'btree',
      table.conversationId.asc().nullsLast().op('int8_ops'),
    ),
    index('conversation_participants_user_id_idx').using(
      'btree',
      table.userId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.conversationId],
      foreignColumns: [conversations.id],
      name: 'conversation_participants_conversation_id_conversations_id_fk',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'conversation_participants_user_id_users_id_fk',
    }).onDelete('cascade'),
    unique('unique_conversation_participant').on(
      table.conversationId,
      table.userId,
    ),
  ],
)

export const messageAttachments = pgTable(
  'message_attachments',
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity({
      name: 'message_attachments_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 9223372036854775807,
      cache: 1,
    }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    messageId: bigint('message_id', { mode: 'number' }).notNull(),
    url: text().notNull(),
    name: text().notNull(),
    type: text().notNull(),
    size: integer(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('message_attachments_message_id_idx').using(
      'btree',
      table.messageId.asc().nullsLast().op('int8_ops'),
    ),
    foreignKey({
      columns: [table.messageId],
      foreignColumns: [messages.id],
      name: 'message_attachments_message_id_messages_id_fk',
    }).onDelete('cascade'),
  ],
)

export const messages = pgTable(
  'messages',
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity({
      name: 'messages_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 9223372036854775807,
      cache: 1,
    }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    conversationId: bigint('conversation_id', { mode: 'number' }).notNull(),
    senderId: text('sender_id').notNull(),
    content: text(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    isDeleted: boolean('is_deleted').default(false),
  },
  (table) => [
    index('messages_conversation_id_idx').using(
      'btree',
      table.conversationId.asc().nullsLast().op('int8_ops'),
    ),
    index('messages_created_at_idx').using(
      'btree',
      table.createdAt.asc().nullsLast().op('timestamptz_ops'),
    ),
    index('messages_sender_id_idx').using(
      'btree',
      table.senderId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.conversationId],
      foreignColumns: [conversations.id],
      name: 'messages_conversation_id_conversations_id_fk',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.senderId],
      foreignColumns: [users.id],
      name: 'messages_sender_id_users_id_fk',
    }).onDelete('cascade'),
  ],
)

export const events = pgTable(
  'events',
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity({
      name: 'events_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 9223372036854775807,
      cache: 1,
    }),
    title: text().notNull(),
    description: text().notNull(),
    userId: text('user_id').notNull(),
    startDate: timestamp('start_date', {
      withTimezone: true,
      mode: 'string',
    }).notNull(),
    endDate: timestamp('end_date', {
      withTimezone: true,
      mode: 'string',
    }).notNull(),
    location: text().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    backgroundUrl: text('background_url'),
    tag: text(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('events_start_date_idx').using(
      'btree',
      table.startDate.asc().nullsLast().op('timestamptz_ops'),
    ),
    index('events_tag_idx').using(
      'btree',
      table.tag.asc().nullsLast().op('text_ops'),
    ),
    index('events_user_id_idx').using(
      'btree',
      table.userId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'events_user_id_users_id_fk',
    }).onDelete('cascade'),
  ],
)

export const postReposts = pgTable(
  'post_reposts',
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity({
      name: 'post_reposts_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 9223372036854775807,
      cache: 1,
    }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    postId: bigint('post_id', { mode: 'number' }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    repostId: bigint('repost_id', { mode: 'number' }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('post_reposts_post_id_idx').using(
      'btree',
      table.postId.asc().nullsLast().op('int8_ops'),
    ),
    foreignKey({
      columns: [table.postId],
      foreignColumns: [posts.id],
      name: 'post_reposts_post_id_posts_id_fk',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.repostId],
      foreignColumns: [posts.id],
      name: 'post_reposts_repost_id_posts_id_fk',
    }).onDelete('set null'),
    unique('unique_repost').on(table.postId, table.repostId),
  ],
)

export const conversationRequests = pgTable(
  'conversation_requests',
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity({
      name: 'conversation_requests_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 9223372036854775807,
      cache: 1,
    }),
    userId: text('user_id').notNull(),
    companyId: text('company_id').notNull(),
    status: text().default('pending').notNull(),
    message: text(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('conversation_requests_company_id_idx').using(
      'btree',
      table.companyId.asc().nullsLast().op('text_ops'),
    ),
    index('conversation_requests_status_idx').using(
      'btree',
      table.status.asc().nullsLast().op('text_ops'),
    ),
    index('conversation_requests_user_id_idx').using(
      'btree',
      table.userId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.companyId],
      foreignColumns: [users.id],
      name: 'conversation_requests_company_id_users_id_fk',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'conversation_requests_user_id_users_id_fk',
    }).onDelete('cascade'),
    unique('unique_conversation_request').on(table.userId, table.companyId),
  ],
)

export const posts = pgTable(
  'posts',
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity({
      name: 'posts_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 9223372036854775807,
      cache: 1,
    }),
    userId: text('user_id').notNull(),
    content: text().notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    likesCount: bigint('likes_count', { mode: 'number' }).default(0).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    commentsCount: bigint('comments_count', { mode: 'number' })
      .default(0)
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    visibility: text().default('public'),
  },
  (table) => [
    index('posts_created_at_idx').using(
      'btree',
      table.createdAt.asc().nullsLast().op('timestamptz_ops'),
    ),
    index('posts_user_id_idx').using(
      'btree',
      table.userId.asc().nullsLast().op('text_ops'),
    ),
    index('posts_visibility_idx').using(
      'btree',
      table.visibility.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'posts_user_id_users_id_fk',
    }).onDelete('cascade'),
  ],
)

export const userPostBookmarks = pgTable(
  'user_post_bookmarks',
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity({
      name: 'user_post_bookmarks_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 9223372036854775807,
      cache: 1,
    }),
    userId: text('user_id').notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    postId: bigint('post_id', { mode: 'number' }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('post_bookmarks_post_id_idx').using(
      'btree',
      table.postId.asc().nullsLast().op('int8_ops'),
    ),
    index('post_bookmarks_user_id_idx').using(
      'btree',
      table.userId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.postId],
      foreignColumns: [posts.id],
      name: 'user_post_bookmarks_post_id_posts_id_fk',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'user_post_bookmarks_user_id_users_id_fk',
    }).onDelete('cascade'),
    unique('unique_post_bookmark').on(table.userId, table.postId),
  ],
)

export const experienceProjects = pgTable(
  'experience_projects',
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity({
      name: 'experience_projects_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 9223372036854775807,
      cache: 1,
    }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    experienceId: bigint('experience_id', { mode: 'number' }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    projectId: bigint('project_id', { mode: 'number' }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.experienceId],
      foreignColumns: [userExperiences.id],
      name: 'experience_projects_experience_id_user_experiences_id_fk',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.projectId],
      foreignColumns: [projects.id],
      name: 'experience_projects_project_id_projects_id_fk',
    }).onDelete('cascade'),
    unique('experience_projects_experience_id_project_id_unique').on(
      table.experienceId,
      table.projectId,
    ),
  ],
)

export const stories = pgTable(
  'stories',
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity({
      name: 'stories_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 9223372036854775807,
      cache: 1,
    }),
    userId: text('user_id').notNull(),
    url: text().notNull(),
    type: text().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    expiresAt: timestamp('expires_at', {
      withTimezone: true,
      mode: 'string',
    }).notNull(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('stories_expires_at_idx').using(
      'btree',
      table.expiresAt.asc().nullsLast().op('timestamptz_ops'),
    ),
    index('stories_user_id_idx').using(
      'btree',
      table.userId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'stories_user_id_users_id_fk',
    }).onDelete('cascade'),
  ],
)

export const experienceMedia = pgTable(
  'experience_media',
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity({
      name: 'experience_media_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 9223372036854775807,
      cache: 1,
    }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    experienceId: bigint('experience_id', { mode: 'number' }).notNull(),
    url: text().notNull(),
    name: text().notNull(),
    type: text().notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    size: bigint({ mode: 'number' }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('experience_media_experience_id_idx').using(
      'btree',
      table.experienceId.asc().nullsLast().op('int8_ops'),
    ),
    foreignKey({
      columns: [table.experienceId],
      foreignColumns: [userExperiences.id],
      name: 'experience_media_experience_id_user_experiences_id_fk',
    }).onDelete('cascade'),
  ],
)

export const postLikes = pgTable(
  'post_likes',
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity({
      name: 'post_likes_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 9223372036854775807,
      cache: 1,
    }),
    userId: text('user_id').notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    postId: bigint('post_id', { mode: 'number' }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('post_likes_post_id_idx').using(
      'btree',
      table.postId.asc().nullsLast().op('int8_ops'),
    ),
    index('post_likes_user_id_idx').using(
      'btree',
      table.userId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.postId],
      foreignColumns: [posts.id],
      name: 'post_likes_post_id_posts_id_fk',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'post_likes_user_id_users_id_fk',
    }).onDelete('cascade'),
    unique('unique_post_like').on(table.userId, table.postId),
  ],
)

export const postComments = pgTable(
  'post_comments',
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity({
      name: 'post_comments_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 9223372036854775807,
      cache: 1,
    }),
    userId: text('user_id').notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    postId: bigint('post_id', { mode: 'number' }).notNull(),
    content: text(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('post_comments_post_id_idx').using(
      'btree',
      table.postId.asc().nullsLast().op('int8_ops'),
    ),
    index('post_comments_user_id_idx').using(
      'btree',
      table.userId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.postId],
      foreignColumns: [posts.id],
      name: 'post_comments_post_id_posts_id_fk',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'post_comments_user_id_users_id_fk',
    }).onDelete('cascade'),
  ],
)

export const projects = pgTable(
  'projects',
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity({
      name: 'projects_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 9223372036854775807,
      cache: 1,
    }),
    userId: text('user_id'),
    title: text().notNull(),
    description: text(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    isSensitive: boolean('is_sensitive').default(false),
    position: doublePrecision().default(0),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('projects_position_idx').using(
      'btree',
      table.position.asc().nullsLast().op('float8_ops'),
    ),
    index('projects_user_id_idx').using(
      'btree',
      table.userId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'projects_user_id_users_id_fk',
    }).onDelete('set null'),
  ],
)

export const projectMembers = pgTable(
  'project_members',
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity({
      name: 'project_members_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 9223372036854775807,
      cache: 1,
    }),
    userId: text('user_id').notNull(),
    department: text(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    projectId: bigint('project_id', { mode: 'number' }).notNull(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('project_members_project_id_idx').using(
      'btree',
      table.projectId.asc().nullsLast().op('int8_ops'),
    ),
    index('project_members_user_id_idx').using(
      'btree',
      table.userId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.projectId],
      foreignColumns: [projects.id],
      name: 'project_members_project_id_projects_id_fk',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'project_members_user_id_users_id_fk',
    }).onDelete('cascade'),
    unique('unique_project_member').on(table.userId, table.projectId),
  ],
)

export const projectFiles = pgTable(
  'project_files',
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity({
      name: 'project_images_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 9223372036854775807,
      cache: 1,
    }),
    title: text(),
    description: text(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    projectId: bigint('project_id', { mode: 'number' }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    url: text().notNull(),
    type: text().notNull(),
    name: text().notNull(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('project_files_project_id_idx').using(
      'btree',
      table.projectId.asc().nullsLast().op('int8_ops'),
    ),
    foreignKey({
      columns: [table.projectId],
      foreignColumns: [projects.id],
      name: 'project_files_project_id_projects_id_fk',
    }).onDelete('cascade'),
  ],
)

export const postFiles = pgTable(
  'post_files',
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity({
      name: 'post_files_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 9223372036854775807,
      cache: 1,
    }),
    url: text().notNull(),
    name: text().notNull(),
    type: text().notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    postId: bigint('post_id', { mode: 'number' }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('post_files_post_id_idx').using(
      'btree',
      table.postId.asc().nullsLast().op('int8_ops'),
    ),
    foreignKey({
      columns: [table.postId],
      foreignColumns: [posts.id],
      name: 'post_files_post_id_posts_id_fk',
    }).onDelete('cascade'),
  ],
)

export const storyViews = pgTable(
  'story_views',
  {
    userId: text('user_id').notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    storyId: bigint('story_id', { mode: 'number' }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('story_views_story_id_idx').using(
      'btree',
      table.storyId.asc().nullsLast().op('int8_ops'),
    ),
    index('story_views_user_id_idx').using(
      'btree',
      table.userId.asc().nullsLast().op('text_ops'),
    ),
    foreignKey({
      columns: [table.storyId],
      foreignColumns: [stories.id],
      name: 'story_views_story_id_stories_id_fk',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'story_views_user_id_users_id_fk',
    }).onDelete('cascade'),
    unique('unique_story_view').on(table.userId, table.storyId),
  ],
)

//////////// RELATIONS ////////////

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

export const storiesRelations = relations(stories, ({ one, many }) => ({
  user: one(users, { fields: [stories.userId], references: [users.id] }),
  views: many(storyViews),
}))

export const storyViewsRelations = relations(storyViews, ({ one }) => ({
  user: one(users, { fields: [storyViews.userId], references: [users.id] }),
  story: one(stories, {
    fields: [storyViews.storyId],
    references: [stories.id],
  }),
}))

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

export const collectionsRelations = relations(collections, ({ one, many }) => ({
  user: one(users, { fields: [collections.userId], references: [users.id] }),
  collectionProjects: many(collectionProjects),
}))

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

export const conversationsRelations = relations(conversations, ({ many }) => ({
  participants: many(conversationParticipants),
  messages: many(messages),
}))

export const conversationParticipantsRelations = relations(
  conversationParticipants,
  ({ one }) => ({
    conversation: one(conversations, {
      fields: [conversationParticipants.conversationId],
      references: [conversations.id],
    }),
    user: one(users, {
      fields: [conversationParticipants.userId],
      references: [users.id],
    }),
  }),
)

export const messagesRelations = relations(messages, ({ one, many }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(users, { fields: [messages.senderId], references: [users.id] }),
  attachments: many(messageAttachments),
}))

export const messageAttachmentsRelations = relations(
  messageAttachments,
  ({ one }) => ({
    message: one(messages, {
      fields: [messageAttachments.messageId],
      references: [messages.id],
    }),
  }),
)

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, { fields: [posts.userId], references: [users.id] }),
  comments: many(postComments),
  likes: many(postLikes),
  reposts: many(postReposts),
  files: many(postFiles),
  projects: many(postProjects),
  bookmarks: many(userPostBookmarks),
}))

export const postCommentsRelations = relations(postComments, ({ one }) => ({
  user: one(users, { fields: [postComments.userId], references: [users.id] }),
  post: one(posts, { fields: [postComments.postId], references: [posts.id] }),
}))

export const postLikesRelations = relations(postLikes, ({ one }) => ({
  user: one(users, { fields: [postLikes.userId], references: [users.id] }),
  post: one(posts, { fields: [postLikes.postId], references: [posts.id] }),
}))

export const postFilesRelations = relations(postFiles, ({ one }) => ({
  post: one(posts, { fields: [postFiles.postId], references: [posts.id] }),
}))

export const postProjectsRelations = relations(postProjects, ({ one }) => ({
  project: one(projects, {
    fields: [postProjects.projectId],
    references: [projects.id],
  }),
  post: one(posts, { fields: [postProjects.postId], references: [posts.id] }),
}))

export const postRepostsRelations = relations(postReposts, ({ one }) => ({
  post: one(posts, { fields: [postReposts.postId], references: [posts.id] }),
  repost: one(posts, {
    fields: [postReposts.repostId],
    references: [posts.id],
  }),
}))

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

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, { fields: [projects.userId], references: [users.id] }),
  files: many(projectFiles),
  members: many(projectMembers),
  collectionProjects: many(collectionProjects),
  postProjects: many(postProjects),
}))

export const projectFilesRelations = relations(projectFiles, ({ one }) => ({
  project: one(projects, {
    fields: [projectFiles.projectId],
    references: [projects.id],
  }),
}))

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  user: one(users, {
    fields: [projectMembers.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [projectMembers.projectId],
    references: [projects.id],
  }),
}))
