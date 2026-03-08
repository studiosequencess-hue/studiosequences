import React from 'react'
import { FormExperience } from '@/lib/models'
import { Briefcase, Pencil } from 'lucide-react'

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
      onClick={() => props.editable && props.onViewExperience?.()}
      className="group relative cursor-pointer p-6 transition-colors"
    >
      <div className="flex flex-col gap-4 sm:flex-row">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded shadow-inner`}
        >
          <Briefcase size={28} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="group-hover:text-accent-blue text-base font-bold transition-colors">
                {props.experience.title}
              </h3>
              <p className="text-sm font-medium">
                {props.experience.companyName}
              </p>
              <p className="mt-0.5 text-sm">
                {props.experience.startDate} – {props.experience.endDate}
              </p>
            </div>
            {props.editable && (
              <button
                onClick={() => props.onEdit?.()}
                className="rounded-full p-2 opacity-0 transition-all group-hover:opacity-100"
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

          {/*<PortfolioGallery portfolio={props.experience.portfolio} />*/}
        </div>
      </div>
    </div>
  )
}

export default ExperiencesItem
