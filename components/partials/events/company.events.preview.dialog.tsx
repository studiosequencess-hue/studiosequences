'use client'

import React from 'react'
import Image from 'next/image'
import { useCompanyEventsStore } from '@/store'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import Placeholder from '@/public/images/placeholder.svg'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, MapPin } from 'lucide-react'
import { format } from 'date-fns'
import { ScrollArea } from '@/components/ui/scroll-area'

const CompanyEventsPreviewDialog = () => {
  const { previewOpen, setPreviewOpen, selectedEvent } = useCompanyEventsStore()

  if (!selectedEvent) return null

  const startDate = new Date(selectedEvent.start_date)
  const endDate = new Date(selectedEvent.end_date)
  const sameDay =
    format(startDate, 'yyyy-MM-dd') === format(endDate, 'yyyy-MM-dd')

  return (
    <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
      <DialogContent className={'gap-0 overflow-hidden p-0'}>
        <DialogHeader className={'relative h-40 w-full'}>
          <DialogTitle className={'hidden'} />
          <DialogDescription className={'hidden'} />
          <Image
            src={selectedEvent.background_url || Placeholder}
            alt={selectedEvent.title}
            fill
            className={'object-cover'}
          />
        </DialogHeader>
        <div className="space-y-4 p-6">
          <DialogHeader className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <DialogTitle className="text-xl leading-tight font-semibold tracking-tight">
                {selectedEvent.title}
              </DialogTitle>
              <Badge variant="default" className="shrink-0 truncate">
                {selectedEvent.tag}
              </Badge>
            </div>
          </DialogHeader>

          <div className="space-y-2 text-sm">
            <div className="text-foreground flex items-center gap-2">
              <CalendarDays className="h-4 w-4 shrink-0" />
              <span>
                {format(startDate, 'MMM d, yyyy · h:mm a')}
                {sameDay
                  ? ` – ${format(endDate, 'h:mm a')}`
                  : ` – ${format(endDate, 'MMM d, yyyy · h:mm a')}`}
              </span>
            </div>

            <div className="text-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{selectedEvent.location}</span>
            </div>
          </div>

          <ScrollArea className="text-foreground h-full max-h-64 pr-3 text-sm leading-relaxed">
            {selectedEvent.description}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CompanyEventsPreviewDialog
