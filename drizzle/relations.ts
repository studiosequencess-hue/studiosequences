import { relations } from 'drizzle-orm/relations'
import {
  projects,
  projectMembers,
  users,
  collections,
  collectionProjects,
  userExperiences,
  posts,
  postProjects,
  conversations,
  conversationParticipants,
  messages,
  messageAttachments,
  events,
  postReposts,
  follows,
  conversationRequests,
  userPostBookmarks,
  experienceProjects,
  stories,
  experienceFiles,
  postLikes,
  postComments,
  projectFiles,
  postFiles,
  storyViews,
} from './schema'

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  project: one(projects, {
    fields: [projectMembers.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [projectMembers.userId],
    references: [users.id],
  }),
}))

export const projectsRelations = relations(projects, ({ one, many }) => ({
  projectMembers: many(projectMembers),
  collectionProjects: many(collectionProjects),
  postProjects: many(postProjects),
  experienceProjects: many(experienceProjects),
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  projectFiles: many(projectFiles),
}))

export const usersRelations = relations(users, ({ many }) => ({
  projectMembers: many(projectMembers),
  collections: many(collections),
  userExperiences: many(userExperiences),
  conversationParticipants: many(conversationParticipants),
  events: many(events),
  follows_followerId: many(follows, {
    relationName: 'follows_followerId_users_id',
  }),
  follows_followingId: many(follows, {
    relationName: 'follows_followingId_users_id',
  }),
  conversationRequests_companyId: many(conversationRequests, {
    relationName: 'conversationRequests_companyId_users_id',
  }),
  conversationRequests_userId: many(conversationRequests, {
    relationName: 'conversationRequests_userId_users_id',
  }),
  messages: many(messages),
  posts: many(posts),
  userPostBookmarks: many(userPostBookmarks),
  stories: many(stories),
  postLikes: many(postLikes),
  postComments: many(postComments),
  projects: many(projects),
  storyViews: many(storyViews),
}))

export const collectionsRelations = relations(collections, ({ one, many }) => ({
  user: one(users, {
    fields: [collections.userId],
    references: [users.id],
  }),
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

export const userExperiencesRelations = relations(
  userExperiences,
  ({ one, many }) => ({
    user: one(users, {
      fields: [userExperiences.userId],
      references: [users.id],
    }),
    experienceProjects: many(experienceProjects),
    experienceMedias: many(experienceFiles),
  }),
)

export const postProjectsRelations = relations(postProjects, ({ one }) => ({
  post: one(posts, {
    fields: [postProjects.postId],
    references: [posts.id],
  }),
  project: one(projects, {
    fields: [postProjects.projectId],
    references: [projects.id],
  }),
}))

export const postsRelations = relations(posts, ({ one, many }) => ({
  postProjects: many(postProjects),
  postReposts_postId: many(postReposts, {
    relationName: 'postReposts_postId_posts_id',
  }),
  postReposts_repostId: many(postReposts, {
    relationName: 'postReposts_repostId_posts_id',
  }),
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  userPostBookmarks: many(userPostBookmarks),
  postLikes: many(postLikes),
  postComments: many(postComments),
  postFiles: many(postFiles),
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

export const conversationsRelations = relations(conversations, ({ many }) => ({
  conversationParticipants: many(conversationParticipants),
  messages: many(messages),
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

export const messagesRelations = relations(messages, ({ one, many }) => ({
  messageAttachments: many(messageAttachments),
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  user: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}))

export const eventsRelations = relations(events, ({ one }) => ({
  user: one(users, {
    fields: [events.userId],
    references: [users.id],
  }),
}))

export const postRepostsRelations = relations(postReposts, ({ one }) => ({
  post_postId: one(posts, {
    fields: [postReposts.postId],
    references: [posts.id],
    relationName: 'postReposts_postId_posts_id',
  }),
  post_repostId: one(posts, {
    fields: [postReposts.repostId],
    references: [posts.id],
    relationName: 'postReposts_repostId_posts_id',
  }),
}))

export const followsRelations = relations(follows, ({ one }) => ({
  user_followerId: one(users, {
    fields: [follows.followerId],
    references: [users.id],
    relationName: 'follows_followerId_users_id',
  }),
  user_followingId: one(users, {
    fields: [follows.followingId],
    references: [users.id],
    relationName: 'follows_followingId_users_id',
  }),
}))

export const conversationRequestsRelations = relations(
  conversationRequests,
  ({ one }) => ({
    user_companyId: one(users, {
      fields: [conversationRequests.companyId],
      references: [users.id],
      relationName: 'conversationRequests_companyId_users_id',
    }),
    user_userId: one(users, {
      fields: [conversationRequests.userId],
      references: [users.id],
      relationName: 'conversationRequests_userId_users_id',
    }),
  }),
)

export const userPostBookmarksRelations = relations(
  userPostBookmarks,
  ({ one }) => ({
    post: one(posts, {
      fields: [userPostBookmarks.postId],
      references: [posts.id],
    }),
    user: one(users, {
      fields: [userPostBookmarks.userId],
      references: [users.id],
    }),
  }),
)

export const experienceProjectsRelations = relations(
  experienceProjects,
  ({ one }) => ({
    userExperience: one(userExperiences, {
      fields: [experienceProjects.experienceId],
      references: [userExperiences.id],
    }),
    project: one(projects, {
      fields: [experienceProjects.projectId],
      references: [projects.id],
    }),
  }),
)

export const storiesRelations = relations(stories, ({ one, many }) => ({
  user: one(users, {
    fields: [stories.userId],
    references: [users.id],
  }),
  storyViews: many(storyViews),
}))

export const experienceMediaRelations = relations(
  experienceFiles,
  ({ one }) => ({
    userExperience: one(userExperiences, {
      fields: [experienceFiles.experienceId],
      references: [userExperiences.id],
    }),
  }),
)

export const postLikesRelations = relations(postLikes, ({ one }) => ({
  post: one(posts, {
    fields: [postLikes.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [postLikes.userId],
    references: [users.id],
  }),
}))

export const postCommentsRelations = relations(postComments, ({ one }) => ({
  post: one(posts, {
    fields: [postComments.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [postComments.userId],
    references: [users.id],
  }),
}))

export const projectFilesRelations = relations(projectFiles, ({ one }) => ({
  project: one(projects, {
    fields: [projectFiles.projectId],
    references: [projects.id],
  }),
}))

export const postFilesRelations = relations(postFiles, ({ one }) => ({
  post: one(posts, {
    fields: [postFiles.postId],
    references: [posts.id],
  }),
}))

export const storyViewsRelations = relations(storyViews, ({ one }) => ({
  story: one(stories, {
    fields: [storyViews.storyId],
    references: [stories.id],
  }),
  user: one(users, {
    fields: [storyViews.userId],
    references: [users.id],
  }),
}))
