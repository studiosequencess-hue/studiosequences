import React from 'react'
import StoriesSlider from '@/components/pages/home/partials/stories.slider'
import FollowSuggestionsBlock from '@/components/pages/home/partials/follow.suggestions.block'
import LatestNewsBlock from '@/components/pages/home/partials/latest.news.block'
import UpcomingEventsBlock from '@/components/pages/home/partials/upcoming.events.block'

const HomeContentAuthenticated = () => {
  return (
    <div className={'grid h-full w-full grid-cols-[250px_1fr]'}>
      <div className={'bg-foreground/10 flex flex-col gap-2 p-4'}>
        <FollowSuggestionsBlock />
        <div className={'bg-background my-4 h-1 w-full rounded-full'} />
        <LatestNewsBlock />
        <div className={'bg-background my-4 h-1 w-full rounded-full'} />
        <UpcomingEventsBlock />
        <div className={'bg-background my-4 h-1 w-full rounded-full'} />
        <div
          className={
            '*:hover:text-foreground/80 mb-8 flex flex-wrap gap-1.5 text-xs/none *:cursor-pointer'
          }
        >
          <span>Terms & Conditions</span>
          <span>Privacy Policy</span>
          <span>Cookie Policy</span>
        </div>
      </div>
      <div className={'flex min-w-0 flex-col'}>
        <StoriesSlider />
      </div>
    </div>
  )
}

export default HomeContentAuthenticated
