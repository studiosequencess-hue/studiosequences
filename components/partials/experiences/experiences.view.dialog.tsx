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
            className={`mb-4 flex h-20 w-20 items-center justify-center rounded-xl border-4 border-white text-white shadow-lg`}
          >
            <Briefcase size={40} />
          </div>
          <div className={'flex flex-col gap-1'}>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {props.experience.title}
            </DialogTitle>
            <DialogDescription className="text-lg font-medium text-gray-600">
              {props.experience.companyName}
            </DialogDescription>
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
              <span>
                {props.experience.startDate} – {props.experience.endDate}
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={14} /> {props.experience.location}
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto px-8 pb-8">
          <div className="mt-6">
            <h4 className="mb-2 flex items-center gap-2 font-bold text-gray-900 underline decoration-blue-200">
              <Info size={16} /> Description
            </h4>
            <p className="leading-relaxed text-gray-700">
              {props.experience.description || 'No description provided.'}
            </p>
          </div>

          <div className="mt-6">
            <h4 className="mb-2 font-bold text-gray-900">Skills</h4>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold tracking-wider text-blue-700 uppercase">
                {props.experience.skills}
              </span>
            </div>
          </div>

          {/*<div className="mt-8">*/}
          {/*  <h4 className="mb-3 font-bold text-gray-900">*/}
          {/*    Portfolio Highlights*/}
          {/*  </h4>*/}
          {/*  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">*/}
          {/*    {props.experience.projects?.map((item) => (*/}
          {/*      <div*/}
          {/*        key={item.id}*/}
          {/*        className="group relative aspect-video overflow-hidden rounded-lg border"*/}
          {/*      >*/}
          {/*        <img*/}
          {/*          src={item.url}*/}
          {/*          alt="Project"*/}
          {/*          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"*/}
          {/*        />*/}
          {/*      </div>*/}
          {/*    ))}*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ExperiencesViewDialog
