'use client'

import React from 'react'
import { Calendar, MapPin, Plus } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { CompanyEvent } from '@/lib/models'
import { QUERY_KEYS } from '@/lib/constants'
import { getEvents } from '@/lib/actions.events'
import { format } from 'date-fns'
import { ScrollArea } from '@/components/ui/scroll-area'
import Loader from '@/components/partials/loader'
import { useAuthStore } from '@/store'

const UpcomingEventsBlock: React.FC = () => {
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
      <div className="p-2">
        {events.map((event) => (
          <div
            key={event.id}
            className="group flex cursor-pointer flex-col gap-1 rounded-lg border-l-2 border-transparent p-3 transition-colors hover:border-blue-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
          >
            <div className="flex items-start justify-between">
              <span className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase dark:text-zinc-500">
                {event.tag}
              </span>
              <div className="flex items-center gap-1 text-[10px] font-medium text-blue-600 dark:text-blue-400">
                <Calendar size={10} />
                {format(event.start_time, 'MMMM Do, YYYY')}
              </div>
            </div>
            <h3 className="text-xs leading-tight font-semibold text-zinc-800 transition-colors group-hover:text-black dark:text-zinc-200 dark:group-hover:text-white">
              {event.title}
            </h3>
            <div className="mt-1 flex items-center gap-1 text-[10px] text-zinc-500 dark:text-zinc-400">
              <MapPin size={10} />
              {event.location}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

export default UpcomingEventsBlock
