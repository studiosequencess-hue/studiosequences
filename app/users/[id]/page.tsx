import React from 'react'
import ProfileInfo from '@/components/pages/profile/profile.info'
import EmptyPage from '@/components/empty.page'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProfileExperience from '@/components/pages/profile/profile.experience'
import ProfileActivities from '@/components/pages/profile/profile.activities'
import ProfilePortfolio from '@/components/pages/profile/profile.portfolio'
import ProfileCollections from '@/components/pages/profile/profile.collections'
import { getUserById } from '@/lib/actions.user'
import { createClient } from '@/lib/supabase.server'

type Props = {
  params: Promise<{ id: string }>
}

const ProfilePage: React.FC<Props> = async (props) => {
  const [{ id }, supabase] = await Promise.all([props.params, createClient()])
  const [userResponse] = await Promise.all([getUserById(id)])

  if (userResponse.status == 'error') {
    return (
      <EmptyPage.Error
        title={'No such user found'}
        description={'Cannot find such user. Please try again'}
      />
    )
  }

  const currentUser = await supabase.auth.getUser()
  const editable = id === currentUser.data.user?.id

  return (
    <div className={'flex grow flex-col'}>
      <ProfileInfo user={userResponse.data} editable={editable} />

      <Tabs defaultValue="portfolio">
        <TabsList className="mx-auto w-fit">
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="experiences">Experiences</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
        </TabsList>
        <TabsContent value="portfolio">
          <ProfilePortfolio user={userResponse.data} editable={editable} />
        </TabsContent>
        <TabsContent value="experiences">
          <ProfileExperience editable={editable} />
        </TabsContent>
        <TabsContent value="activities">
          <ProfileActivities />
        </TabsContent>
        <TabsContent value="collections">
          <ProfileCollections />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ProfilePage
