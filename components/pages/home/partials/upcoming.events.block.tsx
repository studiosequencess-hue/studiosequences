import React from 'react'
import { Calendar, MapPin } from 'lucide-react'

interface ArtEvent {
  id: number
  title: string
  date: string
  location: string
  type: string
}

const UpcomingEventsBlock: React.FC = () => {
  const events: ArtEvent[] = [
    {
      id: 1,
      title: 'Neon Surrealism Workshop',
      date: 'Jan 15, 2026',
      location: 'London, UK',
      type: 'Masterclass',
    },
    {
      id: 2,
      title: 'Contemporary Art Fair',
      date: 'Feb 02, 2026',
      location: 'New York, US',
      type: 'Exhibition',
    },
    {
      id: 3,
      title: 'Digital Sculpture Summit',
      date: 'Mar 10, 2026',
      location: 'Berlin, DE',
      type: 'Conference',
    },
  ]

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white font-sans shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="p-2">
        {events.map((event) => (
          <div
            key={event.id}
            className="group flex cursor-pointer flex-col gap-1 rounded-lg border-l-2 border-transparent p-3 transition-colors hover:border-blue-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
          >
            <div className="flex items-start justify-between">
              <span className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase dark:text-zinc-500">
                {event.type}
              </span>
              <div className="flex items-center gap-1 text-[10px] font-medium text-blue-600 dark:text-blue-400">
                <Calendar size={10} />
                {event.date}
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
    </div>
  )
}

export default UpcomingEventsBlock
