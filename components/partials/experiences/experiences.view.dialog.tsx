'use client'

import React from 'react'
import { Briefcase, Info, MapPin } from 'lucide-react'
import { FormExperience } from '@/lib/models'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { format } from 'date-fns'
import ExperiencesPortfolioGallery from '@/components/partials/experiences/experiences.portfolio.gallery'

type Props = {
  experience: FormExperience
  onClose: () => void
}

const ExperiencesViewDialog: React.FC<Props> = (props) => {
  return (
    <Dialog
      open={!!props.experience}
      onOpenChange={(state) => {
        if (!state) props.onClose()
      }}
    >
      <DialogContent>
        <DialogHeader className={'flex items-start gap-1.5'}>
          <div
            className={`border-foreground/25 bg-accent-blue mb-4 flex size-16 items-center justify-center rounded-xl border-4`}
          >
            <Briefcase size={28} />
          </div>
          <div className={'flex flex-col gap-1'}>
            <DialogTitle className="line-clamp-2 text-xl/none font-bold">
              {props.experience.title}
            </DialogTitle>
            <DialogDescription className="line-clamp-2 text-sm/none font-medium">
              {props.experience.companyName}
            </DialogDescription>
            <div className="mt-2 flex flex-col gap-1 text-sm/none">
              <p className="mt-0.5 text-sm">
                {format(new Date(props.experience.startDate), 'MMM d, yyyy')} –{' '}
                {props.experience.endDate
                  ? format(new Date(props.experience.endDate), 'MMM d, yyyy')
                  : 'Present'}
              </p>
              {props.experience.location && (
                <span className="flex items-center gap-1 text-sm/none">
                  <MapPin size={14} /> {props.experience.location}
                </span>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <div className="mt-2">
            <h4 className="mb-2 flex items-center gap-2 text-sm/none font-bold">
              <Info size={16} /> Description
            </h4>
            <div className="max-h-24 overflow-y-auto text-sm/none leading-relaxed">
              {props.experience.description || (
                <span className={'text-muted-foreground'}>
                  No description provided.
                </span>
              )}
            </div>
          </div>

          <div className="mt-2">
            <h4 className="mb-2 flex items-center gap-2 text-sm/none leading-relaxed font-bold">
              <Info size={16} /> Skills
            </h4>
            <div className="flex flex-wrap gap-2 text-sm/none">
              {props.experience.skills || (
                <span className={'text-muted-foreground'}>No skills</span>
              )}
            </div>
          </div>

          <div className="mt-2">
            <h4 className="mb-2 flex items-center gap-2 text-sm/none leading-relaxed font-bold">
              <Info size={16} /> Portfolio
            </h4>
            <ExperiencesPortfolioGallery experience={props.experience} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ExperiencesViewDialog
