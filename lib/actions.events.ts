'use server'

import { ServerResponse, CompanyEvent, FormCompanyEvent } from '@/lib/models'
import { ServerRequest } from '@/lib/actions'
import { getUser } from '@/lib/actions.auth'
import { db } from '@/db/client'
import { events } from '@/drizzle/schema'
import { gt, asc, eq, and } from 'drizzle-orm'

export async function getEvents(): Promise<ServerResponse<CompanyEvent[]>> {
  try {
    const now = new Date()

    const eventsData = await db.query.events.findMany({
      where: gt(events.endDate.getSQL(), now),
      orderBy: [asc(events.startDate)],
      with: {
        user: true,
      },
    })

    return {
      status: 'success',
      message: 'Successfully fetched events.',
      data: eventsData,
    }
  } catch (e) {
    console.log('getEvents', e)
    return {
      status: 'error',
      message: 'Failed to fetch events. Please try again later.',
    }
  }
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
      const userResponse = await getUser()
      if (userResponse.status == 'error') {
        return {
          status: 'error',
          message: userResponse.message,
        }
      }

      const { id, ...eventData } = props.event

      const eventResult = await db
        .insert(events)
        .values({ ...props.event, userId: userResponse.data.id })
        .onConflictDoUpdate({
          target: events.id,
          set: { ...eventData, userId: userResponse.data.id },
        })
        .returning()

      return {
        status: 'success',
        message: 'Successfully created event.',
        data: {
          ...eventResult[0],
          user: userResponse.data,
        },
      }
    },
  )
}

type UpdateEventProps = {
  event_id: CompanyEvent['id']
  event: Partial<FormCompanyEvent>
}
export async function updateEvent(props: UpdateEventProps) {
  return ServerRequest<CompanyEvent, UpdateEventProps>(
    'updateEvent',
    async (): Promise<ServerResponse<CompanyEvent>> => {
      const userResponse = await getUser()
      if (userResponse.status == 'error') {
        return {
          status: 'error',
          message: userResponse.message,
        }
      }

      const fetchResponse = await db
        .update(events)
        .set(props.event)
        .where(eq(events.id, props.event_id))
        .returning()

      if (!fetchResponse || fetchResponse.length === 0) {
        return {
          status: 'error',
          message: 'Event not found',
        }
      }

      return {
        status: 'success',
        message: 'Successfully updated event.',
        data: {
          ...fetchResponse[0],
          user: userResponse.data,
        },
      }
    },
  )
}

type DeleteEventProps = {
  event_id: CompanyEvent['id']
}
export async function deleteEvent(props: DeleteEventProps) {
  return ServerRequest<boolean, DeleteEventProps>(
    'deleteEvent',
    async (): Promise<ServerResponse<boolean>> => {
      const userResponse = await getUser()
      if (userResponse.status == 'error') {
        return {
          status: 'error',
          message: userResponse.message,
        }
      }

      await db
        .delete(events)
        .where(
          and(
            eq(events.id, props.event_id),
            eq(events.userId, userResponse.data.id),
          ),
        )

      return {
        status: 'success',
        message: 'Successfully deleted event.',
        data: true,
      }
    },
  )
}
