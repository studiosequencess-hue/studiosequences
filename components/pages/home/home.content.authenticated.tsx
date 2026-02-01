import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import StoriesSlider from '@/components/pages/home/partials/stories.slider'
import FollowSuggestionsBlock from '@/components/pages/home/partials/follow.suggestions.block'
import LatestNewsBlock from '@/components/pages/home/partials/latest.news.block'
import UpcomingEventsBlock from '@/components/pages/home/partials/upcoming.events.block'
import TabPosts from '@/components/pages/home/sections/tab.posts'
import TabPortfolio from '@/components/pages/home/sections/tab.portfolio'
import TabBookmarks from '@/components/pages/home/sections/tab.bookmarks'
import TabAbout from '@/components/pages/home/sections/tab.about'
import { UserInfo } from '@/lib/models'

type Props = {
  user: UserInfo
}

const HomeContentAuthenticated: React.FC<Props> = ({ user }) => {
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

        <Tabs defaultValue="posts" className="w-full">
          <TabsList className={'mx-auto flex w-fit gap-0 *:w-fit *:px-4'}>
            <TabsTrigger value="posts" className={'uppercase'}>
              posts
            </TabsTrigger>
            <TabsTrigger value="portfolio" className={'uppercase'}>
              portfolio
            </TabsTrigger>
            <TabsTrigger value="bookmarks" className={'uppercase'}>
              bookmarks
            </TabsTrigger>
            <TabsTrigger value="about" className={'uppercase'}>
              about
            </TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            <TabPosts />
          </TabsContent>
          <TabsContent value="portfolio">
            <TabPortfolio user={user} />
          </TabsContent>
          <TabsContent value="bookmarks">
            <TabBookmarks />
          </TabsContent>
          <TabsContent value="about">
            <TabAbout />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default HomeContentAuthenticated
