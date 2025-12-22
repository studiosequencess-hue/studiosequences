import { getUser } from '@/lib/actions.auth'
import HomeContentAuthenticated from '@/components/pages/home/home.content.authenticated'
import HomeContentUnauthenticated from '@/components/pages/home/home.content.unauthenticated'

const HomePage = async () => {
  const response = await getUser()

  if (response.status == 'success' && response.data) {
    return <HomeContentAuthenticated />
  }

  return <HomeContentUnauthenticated />
}

export default HomePage
