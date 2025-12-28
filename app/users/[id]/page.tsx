import React from 'react'
import ProfileInfo from '@/components/pages/profile/profile.info'
import EmptyPage from '@/components/empty.page'
import { getUser } from '@/lib/actions.auth'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProfileExperience from '@/components/pages/profile/profile.experience'

type Props = {
  params: Promise<{ id: string }>
}

const ProfilePage: React.FC<Props> = async (props) => {
  const [userResponse, { id }] = await Promise.all([getUser(), props.params])

  if (userResponse.status == 'error') {
    return (
      <EmptyPage.Error
        title={'No such user found.'}
        description={'Please, try to login or contact support.'}
      />
    )
  }

  const editable = id === userResponse.data.id

  return (
    <div className={'flex grow flex-col'}>
      <ProfileInfo user={userResponse.data} editable={editable} />

      <Tabs defaultValue="portfolio">
        <TabsList className="mx-auto w-fit">
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="experiences">Experiences</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
        </TabsList>
        <TabsContent value="portfolio">portfolio</TabsContent>
        <TabsContent value="experiences">
          <ProfileExperience editable={editable} />
        </TabsContent>
        <TabsContent value="activities">activities</TabsContent>
        <TabsContent value="bookmarks">bookmarks</TabsContent>
      </Tabs>
    </div>
  )
}

export default ProfilePage
