'use server'

import { createClient } from '@/lib/supabase.server'
import { ServerResponse, CompanyEvent, FormCompanyEvent } from '@/lib/models'
import { ServerRequest } from '@/lib/actions'
import { getUser } from '@/lib/actions.auth'

export async function getEvents() {
  return ServerRequest<CompanyEvent[]>(
    'getEvents',
    async (): Promise<ServerResponse<CompanyEvent[]>> => {
      const supabase = await createClient()
      const now = new Date().toISOString()

      const fetchResponse = await supabase
        .from('events')
        .select('*, user:user_id(*)')
        .gt('end_time', now)
        .order('start_time', { ascending: true })

      if (fetchResponse.error) {
        return {
          status: 'error',
          message: fetchResponse.error.message,
        }
      }

      return {
        status: 'success',
        message: 'Successfully fetched events.',
        data: fetchResponse.data,
      }
    },
  )
}

type CreateEventProps = {
  event: FormCompanyEvent
}
export async function createEvent(props: CreateEventProps) {
  return ServerRequest<boolean, CreateEventProps>(
    'createEvent',
    async (): Promise<ServerResponse<boolean>> => {
      const supabase = await createClient()
      const userResponse = await getUser()

      if (userResponse.status == 'error') {
        return {
          status: 'error',
          message: userResponse.message,
        }
      }

      const fetchResponse = await supabase.from('events').insert([
        {
          ...props.event,
          user_id: userResponse.data.id,
        },
      ])

      if (fetchResponse.error) {
        return {
          status: 'error',
          message: fetchResponse.error.message,
        }
      }

      return {
        status: 'success',
        message: 'Successfully created event.',
        data: true,
      }
    },
  )
}
