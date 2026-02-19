'use client'

import React from 'react'
import { Calendar, MapPin, Plus } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { CompanyEvent } from '@/lib/models'
import { QUERY_KEYS, UserRole } from '@/lib/constants'
import { getEvents } from '@/lib/actions.events'
import { format } from 'date-fns'
import { ScrollArea } from '@/components/ui/scroll-area'
import Loader from '@/components/partials/loader'
import { useAuthStore, useCompanyEventsStore } from '@/store'

const UpcomingEventsBlock: React.FC = () => {
  const { user, loading: userLoading } = useAuthStore()
  const { setFormOpen, setPreviewOpen } = useCompanyEventsStore()
  const eventsQuery = useQuery<CompanyEvent[]>({
    queryKey: [QUERY_KEYS.EVENTS],
    queryFn: async () => {
      const response = await getEvents()

      return response.status == 'success' ? response.data || [] : []
    },
  })

  const events = eventsQuery.data || []

  if (eventsQuery.isLoading) {
    return <Loader wrapperClassName={'h-full w-full'} />
  }

  if (events.length == 0) {
    return (
      <div
        className={
          'text-muted-foreground flex h-full w-full items-center justify-center text-sm/none'
        }
      >
        No events
      </div>
    )
  }

  return (
    <ScrollArea className="h-full w-full">
      <div className={'flex flex-col'}>
        {events.map((event) => (
          <div
            key={event.id}
            className="group hover:bg-accent-blue flex cursor-pointer flex-col gap-1 p-3 transition-colors"
            onClick={() => {
              if (userLoading || !user) return
              if (
                user.role == UserRole.Admin.toString() ||
                event.user_id == user.id
              ) {
                setFormOpen(true, event)
              } else {
                setPreviewOpen(true, event)
              }
            }}
          >
            <div className="grid w-full grid-cols-2 text-xs/none">
              <span className="truncate font-bold">{event.tag}</span>
              <div className="text-accent-blue group-hover:text-foreground flex items-center justify-end gap-1 text-[10px] font-bold">
                <Calendar size={10} />
                <span>{format(event.start_date, 'MMM dd, yyyy')}</span>
              </div>
            </div>
            <h3 className="line-clamp-2 text-xs/none font-semibold">
              {event.title}
            </h3>
            <div className="text-muted-foreground group-hover:text-foreground flex items-center gap-1 text-[10px]">
              <MapPin size={10} />
              <span>{event.location}</span>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

export default UpcomingEventsBlock
