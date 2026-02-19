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
        .gt('end_date', now)
        .order('start_date', { ascending: true })

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
  event: FormCompanyEvent & {
    id?: CompanyEvent['id']
  }
}
export async function upsertEvent(props: CreateEventProps) {
  return ServerRequest<CompanyEvent, CreateEventProps>(
    'createEvent',
    async (): Promise<ServerResponse<CompanyEvent>> => {
      const supabase = await createClient()
      const userResponse = await getUser()

      if (userResponse.status == 'error') {
        return {
          status: 'error',
          message: userResponse.message,
        }
      }

      const fetchResponse = await supabase
        .from('events')
        .upsert({
          ...props.event,
          user_id: userResponse.data.id,
        })
        .select()
        .single()

      if (fetchResponse.error) {
        return {
          status: 'error',
          message: fetchResponse.error.message,
        }
      }

      return {
        status: 'success',
        message: 'Successfully created event.',
        data: {
          ...fetchResponse.data,
          user: userResponse.data,
        },
      }
    },
  )
}

type updateEventProps = {
  event_id: CompanyEvent['id']
  event: Partial<FormCompanyEvent>
}
export async function updateEvent(props: updateEventProps) {
  return ServerRequest<CompanyEvent, CreateEventProps>(
    'updateEvent',
    async (): Promise<ServerResponse<CompanyEvent>> => {
      const supabase = await createClient()
      const userResponse = await getUser()

      if (userResponse.status == 'error') {
        return {
          status: 'error',
          message: userResponse.message,
        }
      }

      const fetchResponse = await supabase
        .from('events')
        .update({ ...props.event })
        .eq('id', props.event_id)
        .select()
        .single()

      if (fetchResponse.error) {
        return {
          status: 'error',
          message: fetchResponse.error.message,
        }
      }

      return {
        status: 'success',
        message: 'Successfully updated event.',
        data: {
          ...fetchResponse.data,
          user: userResponse.data,
        },
      }
    },
  )
}
