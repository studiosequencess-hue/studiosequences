'use client'

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
import { DBUser } from '@/lib/models'
import LeftSidebarBlock from '@/components/partials/authenticated-left-sidebar/left-sidebar-block'
import { UserRole } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useCompanyEventsStore } from '@/store'

type Props = {
  user: DBUser
}

const HomeContentAuthenticated: React.FC<Props> = ({ user }) => {
  const { setFormOpen: companyEventFormOpen } = useCompanyEventsStore()

  return (
    <div className={'grid h-full w-full grid-cols-[250px_1fr]'}>
      <div className={'bg-foreground/10 flex flex-col gap-4 p-4'}>
        <LeftSidebarBlock>
          <FollowSuggestionsBlock />
        </LeftSidebarBlock>
        <div className={'bg-background h-1 w-full rounded-full'} />
        <LeftSidebarBlock>
          <LatestNewsBlock />
        </LeftSidebarBlock>
        <div className={'bg-background h-1 w-full rounded-full'} />
        {user && user.role != UserRole.User.toString() && (
          <Button
            size={'sm'}
            variant={'accent'}
            onClick={() => companyEventFormOpen(true)}
          >
            <Plus />
            <span>Add event</span>
          </Button>
        )}
        <LeftSidebarBlock>
          <UpcomingEventsBlock />
        </LeftSidebarBlock>
        <div className={'bg-background h-1 w-full rounded-full'} />
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
