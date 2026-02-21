import { getUserStories } from '@/lib/actions.stories'
import { StoryViewer } from '@/components/partials/stories/story.viewer'
import { notFound } from 'next/navigation'

export default async function StoryPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params
  const stories = await getUserStories(userId)

  if (
    stories.status === 'error' ||
    !stories.data ||
    stories.data.length === 0
  ) {
    notFound()
  }

  return <StoryViewer stories={stories.data} userId={userId} />
}
