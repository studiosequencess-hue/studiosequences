import React from 'react'
import { FormExperience } from '@/lib/models'
import { Briefcase, Pencil } from 'lucide-react'
import { format } from 'date-fns'
import { beautifyEmploymentType } from '@/lib/utils'
import { EMPLOYMENT_TYPE } from '@/lib/constants'
import ExperiencesPortfolioGallery from '@/components/partials/experiences/experiences.portfolio.gallery'

type Props = {
  editable: boolean
  experience: FormExperience
  onEdit: () => void
  onViewExperience?: () => void
}

const ExperiencesItem: React.FC<Props> = (props) => {
  return (
    <div
      key={props.experience.id}
      onClick={() => props.onViewExperience?.()}
      className="group relative cursor-pointer p-4 transition-colors"
    >
      <div className="flex flex-col gap-4 sm:flex-row">
        <div
          className={`bg-accent-blue flex size-12 items-center justify-center rounded-sm`}
        >
          <Briefcase size={24} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="group-hover:text-accent-blue line-clamp-2 text-base font-bold transition-colors">
                {props.experience.title}
              </h3>
              <div className="line-clamp-2 flex items-center gap-1.5 text-sm/5 font-normal">
                <span>{props.experience.companyName}</span>
                <span className={'text-muted-foreground'}>
                  {beautifyEmploymentType(
                    props.experience.employmentType as EMPLOYMENT_TYPE,
                  )}
                </span>
              </div>
              {props.experience.location && (
                <p className="line-clamp-2 text-sm font-normal">
                  {props.experience.location}
                </p>
              )}
              <p className="mt-0.5 text-sm">
                {format(new Date(props.experience.startDate), 'MMM d, yyyy')} –{' '}
                {props.experience.endDate
                  ? format(new Date(props.experience.endDate), 'MMM d, yyyy')
                  : 'Present'}
              </p>
            </div>
            {props.editable && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()

                  props.onEdit?.()
                }}
                className="hover:text-accent-blue cursor-pointer rounded-full p-2 opacity-0 transition-all group-hover:opacity-100"
              >
                <Pencil size={18} />
              </button>
            )}
          </div>

          {props.experience.description && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed">
              {props.experience.description}
            </p>
          )}

          <ExperiencesPortfolioGallery experience={props.experience} />
        </div>
      </div>
    </div>
  )
}

export default ExperiencesItem
