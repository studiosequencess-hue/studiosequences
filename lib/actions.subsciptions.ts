'use server'

import { createClient } from '@/lib/supabase.server'
import { ServerResponse, DBUser } from '@/lib/models'
import { ServerRequest } from '@/lib/actions'

type GetFollowSuggestionsProps = {
  count: number
}
export async function getFollowSuggestions(props: GetFollowSuggestionsProps) {
  return ServerRequest<DBUser[], GetFollowSuggestionsProps>(
    'getFollowSuggestions',
    async (): Promise<ServerResponse<DBUser[]>> => {
      const supabase = await createClient()
      const fetchResponse = await supabase.rpc('get_random_unfollowed_users', {
        limit_count: props.count,
      })

      if (fetchResponse.error) {
        return {
          status: 'error',
          message: fetchResponse.error.message,
        }
      }

      return {
        status: 'success',
        message: 'Successfully fetched follow suggestions.',
        data: fetchResponse.data,
      }
    },
  )
}

type ToggleFollowProps = {
  followingId: DBUser['id']
}
export async function toggleFollow(props: ToggleFollowProps) {
  return ServerRequest<boolean, ToggleFollowProps>(
    'toggleFollowUser',
    async (): Promise<ServerResponse<boolean>> => {
      const supabase = await createClient()
      const currentUserResponse = await supabase.auth.getUser()

      if (currentUserResponse.error) {
        return {
          status: 'error',
          message: currentUserResponse.error.message,
        }
      }

      const followResponse = await supabase.rpc('toggle_follow', {
        target_follower_id: currentUserResponse.data.user.id,
        target_following_id: props.followingId,
      })

      if (followResponse.error) {
        return {
          status: 'error',
          message: followResponse.error.message,
        }
      }

      return {
        status: 'success',
        message: 'Successfully toggled follow.',
        data: true,
      }
    },
  )
}
