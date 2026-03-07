'use server'

import { db } from '@/db/client'
import {
  conversations,
  conversationParticipants,
  messages,
  messageAttachments,
  conversationRequests,
  users,
} from '@/drizzle/schema'
import { eq, and, or, desc, asc, inArray, ne, like } from 'drizzle-orm'
import { createClient } from '@/lib/supabase.server'
import { getUser } from '@/lib/actions.auth'
import { MAX_FILE_SIZE, StorageBucketType, UserRole } from '@/lib/constants'
import {
  Conversation,
  Message,
  MessageAttachment,
  ServerResponse,
  UserGeneralInfoSearchResult,
} from '@/lib/models'
import { unstable_cache } from 'next/cache'

// 1. Get or Create Conversation
export async function getOrCreateConversation(
  otherUserId: string,
): Promise<ServerResponse<Conversation>> {
  const userRes = await getUser()
  if (userRes.status === 'error') return userRes

  const currentUserId = userRes.data.id

  // Check if conversation exists
  const existingConv = await db.query.conversations.findFirst({
    where: and(
      eq(conversations.isGroup, false),
      inArray(
        conversations.id,
        db
          .select({ id: conversationParticipants.conversationId })
          .from(conversationParticipants)
          .where(eq(conversationParticipants.userId, currentUserId)),
      ),
      inArray(
        conversations.id,
        db
          .select({ id: conversationParticipants.conversationId })
          .from(conversationParticipants)
          .where(eq(conversationParticipants.userId, otherUserId)),
      ),
    ),
    with: {
      participants: {
        with: {
          user: {
            columns: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              companyName: true,
              avatar: true,
              role: true,
              email: true,
            },
          },
        },
      },
    },
  })

  if (existingConv) {
    return {
      status: 'success',
      message: 'Successfully fetched conversation.',
      data: existingConv,
    }
  }

  // Create new conversation
  const newConv = await db
    .insert(conversations)
    .values({
      isGroup: false,
      name: null,
    })
    .returning()

  if (!newConv[0]) {
    return { status: 'error', message: 'Failed to create conversation' }
  }

  // Add participants
  await db.insert(conversationParticipants).values([
    { conversationId: newConv[0].id, userId: currentUserId, role: 'admin' },
    { conversationId: newConv[0].id, userId: otherUserId, role: 'member' },
  ])

  const fullConv = await db.query.conversations.findFirst({
    where: eq(conversations.id, newConv[0].id),
    with: {
      participants: {
        with: {
          user: {
            columns: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              companyName: true,
              avatar: true,
              role: true,
              email: true,
            },
          },
        },
      },
    },
  })

  if (!fullConv) {
    return {
      status: 'error',
      message: 'Failed to fetch conversation.',
    }
  }

  return {
    status: 'success',
    message: 'Successfully fetched conversation.',
    data: fullConv,
  }
}

// 2. Send Message
export async function sendMessage(
  conversationId: number,
  content: string,
  attachments: Array<MessageAttachment> = [],
): Promise<ServerResponse<Message>> {
  const userRes = await getUser()
  if (userRes.status === 'error') return userRes

  const senderId = userRes.data.id

  // Verify participant
  const participant = await db.query.conversationParticipants.findFirst({
    where: and(
      eq(conversationParticipants.conversationId, conversationId),
      eq(conversationParticipants.userId, senderId),
    ),
  })

  if (!participant) {
    return { status: 'error', message: 'Not authorized to send message' }
  }

  // Insert message
  const message = await db
    .insert(messages)
    .values({
      conversationId: conversationId,
      senderId: senderId,
      content,
    })
    .returning()

  if (!message[0]) {
    return { status: 'error', message: 'Failed to send message' }
  }

  // Insert attachments
  if (attachments.length > 0) {
    await db.insert(messageAttachments).values(
      attachments.map((att) => ({
        messageId: message[0].id,
        url: att.url,
        name: att.name,
        type: att.type,
        size: att.size,
      })),
    )
  }

  // Update conversation timestamp
  await db
    .update(conversations)
    .set({ updatedAt: new Date().toISOString() })
    .where(eq(conversations.id, conversationId))

  return {
    status: 'success',
    message: 'Successfully sent message.',
    data: {
      ...message[0],
      attachments,
      sender: userRes.data,
    },
  }
}

// 3. Get Messages
export async function getMessages(
  conversationId: number,
  limit = 50,
  offset = 0,
): Promise<ServerResponse<Message[]>> {
  const userRes = await getUser()
  if (userRes.status === 'error') return userRes

  const currentUserId = userRes.data.id

  // Verify access
  const access = await db.query.conversationParticipants.findFirst({
    where: and(
      eq(conversationParticipants.conversationId, conversationId),
      eq(conversationParticipants.userId, currentUserId),
    ),
  })

  if (!access) {
    return { status: 'error', message: 'Access denied' }
  }

  const msgs = await db.query.messages.findMany({
    where: and(
      eq(messages.conversationId, conversationId),
      eq(messages.isDeleted, false),
    ),
    orderBy: [asc(messages.createdAt)],
    limit,
    offset,
    with: {
      sender: {
        columns: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          avatar: true,
          email: true,
          companyName: true,
          role: true,
        },
      },
      attachments: true,
    },
  })

  return {
    status: 'success',
    message: 'Successfully fetched messages',
    data: msgs,
  }
}

export async function getMessageById(
  messageId: number,
): Promise<ServerResponse<Message>> {
  const userRes = await getUser()
  if (userRes.status === 'error') return userRes

  const message = await db.query.messages.findFirst({
    where: eq(messages.id, messageId),
    with: {
      sender: {
        columns: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          companyName: true,
          avatar: true,
          email: true,
          role: true,
        },
      },
      attachments: true,
    },
  })

  if (!message) {
    return { status: 'error', message: 'Message not found' }
  }

  // Verify user has access to this conversation
  const participant = await db.query.conversationParticipants.findFirst({
    where: and(
      eq(conversationParticipants.conversationId, message.conversationId),
      eq(conversationParticipants.userId, userRes.data.id),
    ),
  })

  if (!participant) {
    return { status: 'error', message: 'Access denied' }
  }

  return {
    status: 'success',
    message: 'Successfully fetched message',
    data: message,
  }
}

export const getMessagesCached = unstable_cache(
  async (conversationId: number) => {
    return getMessages(conversationId)
  },
  ['messages'],
  { revalidate: 1 },
)

// 4. Get User Conversations
export async function getUserConversations(): Promise<
  ServerResponse<Conversation[]>
> {
  const userRes = await getUser()
  if (userRes.status === 'error') return userRes

  const userId = userRes.data.id

  const participants = await db.query.conversationParticipants.findMany({
    where: eq(conversationParticipants.userId, userId),
    with: {
      conversation: {
        with: {
          participants: {
            with: {
              user: {
                columns: {
                  id: true,
                  username: true,
                  firstName: true,
                  lastName: true,
                  companyName: true,
                  avatar: true,
                  role: true,
                  email: true,
                },
              },
            },
          },
          messages: {
            where: eq(messages.isDeleted, false),
            orderBy: [desc(messages.createdAt)],
            limit: 1,
            with: {
              sender: {
                columns: { id: true, username: true },
              },
            },
          },
        },
      },
    },
    orderBy: [desc(conversationParticipants.joinedAt)],
  })

  const formatted = participants.map((p) => ({
    ...p.conversation,
    participants: p.conversation.participants,
    last_message: p.conversation.messages[0] || null,
  }))

  return {
    status: 'success',
    message: 'Successfully fetched conversations.',
    data: formatted,
  }
}

// 5. Search Users/Companies
export async function searchUsers(
  query: string,
  type?: UserRole,
): Promise<ServerResponse<UserGeneralInfoSearchResult[]>> {
  const userRes = await getUser()
  if (userRes.status === 'error') return userRes

  const currentUserId = userRes.data.id
  const searchPattern = `%${query}%`

  const whereConditions = [
    ne(users.id, currentUserId), // Exclude self
    or(
      like(users.username, searchPattern),
      like(users.email, searchPattern),
      like(users.firstName, searchPattern),
      like(users.lastName, searchPattern),
      like(users.companyName, searchPattern),
    ),
  ]

  if (type) {
    whereConditions.push(eq(users.role, type))
  }

  const results = await db
    .select({
      id: users.id,
      username: users.username,
      firstName: users.firstName,
      lastName: users.lastName,
      avatar: users.avatar,
      role: users.role,
      companyName: users.companyName,
      email: users.email,
    })
    .from(users)
    .where(and(...whereConditions))
    .limit(20)

  const userIds = results.map((u) => u.id)

  // Check for pending requests (user -> company)
  const requests = await db
    .select({
      companyId: conversationRequests.companyId,
      status: conversationRequests.status,
    })
    .from(conversationRequests)
    .where(
      and(
        eq(conversationRequests.userId, currentUserId),
        inArray(conversationRequests.companyId, userIds),
        eq(conversationRequests.status, 'pending'),
      ),
    )

  const existingConvs = await db.query.conversationParticipants.findMany({
    where: and(eq(conversationParticipants.userId, currentUserId)),
    with: {
      conversation: {
        with: {
          participants: true,
        },
      },
    },
  })

  const userHasConversationWith = new Set(
    existingConvs.flatMap((cp) =>
      cp.conversation.participants
        .filter((p) => p.userId !== currentUserId)
        .map((p) => p.userId),
    ),
  )

  // Map results
  const mappedResults = results.map((user) => {
    const pendingRequest = requests.find((r) => r.companyId === user.id)

    return {
      ...user,
      has_pending_request: !!pendingRequest,
      has_conversation: userHasConversationWith.has(user.id),
    }
  })

  return {
    status: 'success',
    message: 'Successfully searched users.',
    data: mappedResults,
  }
}

// 6. Request Conversation (User to Company)
export async function requestConversation(
  companyId: string,
  initialMessage?: string,
) {
  const userRes = await getUser()
  if (userRes.status === 'error') return userRes

  const userId = userRes.data.id

  // Check if already exists
  const existing = await db.query.conversationRequests.findFirst({
    where: and(
      eq(conversationRequests.userId, userId),
      eq(conversationRequests.companyId, companyId),
      eq(conversationRequests.status, 'pending'),
    ),
  })

  if (existing) {
    return { status: 'error', message: 'Request already pending' }
  }

  await db.insert(conversationRequests).values({
    userId: userId,
    companyId: companyId,
    message: initialMessage,
    status: 'pending',
  })

  return { status: 'success', message: 'Request sent' }
}

// 7. Handle Request (Company approves/rejects)
export async function handleRequest(
  requestId: number,
  action: 'approve' | 'reject',
) {
  const userRes = await getUser()
  if (userRes.status === 'error') return userRes

  const companyId = userRes.data.id

  const request = await db.query.conversationRequests.findFirst({
    where: and(
      eq(conversationRequests.id, requestId),
      eq(conversationRequests.companyId, companyId),
    ),
  })

  if (!request) {
    return { status: 'error', message: 'Request not found' }
  }

  await db
    .update(conversationRequests)
    .set({
      status: action === 'approve' ? 'approved' : 'rejected',
      updatedAt: new Date().toISOString(),
    })
    .where(eq(conversationRequests.id, requestId))

  if (action === 'approve') {
    // Create conversation
    const result = await getOrCreateConversation(request.userId)
    return result
  }

  return { status: 'success', message: `Request ${action}ed` }
}

// 8. Get Pending Requests (for companies)
export async function getPendingRequests() {
  const userRes = await getUser()
  if (userRes.status === 'error') return userRes

  const companyId = userRes.data.id

  // Verify user is a company
  if (userRes.data.role !== 'company') {
    return { status: 'success', data: [] }
  }

  const requests = await db.query.conversationRequests.findMany({
    where: and(
      eq(conversationRequests.companyId, companyId),
      eq(conversationRequests.status, 'pending'),
    ),
    with: {
      user: {
        columns: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          avatar: true,
          companyName: true,
          role: true,
          email: true,
        },
      },
    },
    orderBy: [desc(conversationRequests.createdAt)],
  })

  return { status: 'success', data: requests }
}

// 9. Upload File
export async function uploadMessageFile(file: File) {
  if (file.size > MAX_FILE_SIZE) {
    return {
      status: 'error',
      message: `File size exceeds 5MB limit (current: ${(file.size / 1024 / 1024).toFixed(2)}MB)`,
    }
  }

  const supabase = await createClient()
  const userRes = await getUser()
  if (userRes.status === 'error') return userRes

  const fileExt = file.name.split('.').pop()
  const fileName = `${userRes.data.id}/${Date.now()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from(StorageBucketType.Messages)
    .upload(fileName, file, { contentType: file.type })

  if (error) {
    return { status: 'error', message: error.message }
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(StorageBucketType.Messages).getPublicUrl(fileName)

  // Determine type
  let type = 'file'
  if (file.type.startsWith('image/')) type = 'image'
  else if (file.type.startsWith('video/')) type = 'video'

  return {
    status: 'success',
    data: {
      url: publicUrl,
      name: file.name,
      type,
      size: file.size,
    },
  }
}
