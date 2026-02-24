import ConversationsLeftSidebar from '@/components/partials/messaging/conversations.left.sidebar'
import ConversationsChatArea from '@/components/partials/messaging/conversations.chat.area'
import ConversationsRightSidebar from '@/components/partials/messaging/conversations.right.sidebar'

// Main Page Component
export default function MessagesPage() {
  return (
    <div className="flex grow">
      {/* Left: Conversation List */}
      <ConversationsLeftSidebar />

      {/* Middle: Chat Area */}
      <ConversationsChatArea />

      {/* Right: Empty Panel (future use) */}
      <ConversationsRightSidebar />
    </div>
  )
}
