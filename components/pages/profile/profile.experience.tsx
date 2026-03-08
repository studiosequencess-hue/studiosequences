'use client'

import React, { useState } from 'react'
import { Briefcase, Plus } from 'lucide-react'
import { FormExperience } from '@/lib/models'
import ExperiencesViewDialog from '@/components/partials/experiences/experiences.view.dialog'
import { EMPLOYMENT_TYPE } from '@/lib/constants'
import ExperiencesFormDialog from '@/components/partials/experiences/experiences.form.dialog'
import ExperiencesItem from '@/components/partials/experiences/experiences.item'
import { DEFAULT_EXPERIENCE } from '@/lib/defaults'

type Props = {
  editable: boolean
}

const ProfileExperience: React.FC<Props> = ({ editable }) => {
  const [experiences, setExperiences] = useState<FormExperience[]>([])

  const [editingExp, setEditingExp] = useState<FormExperience | null>(null)
  const [viewingExp, setViewingExp] = useState<FormExperience | null>(null)

  // Actions
  const handleOpenAdd = () => {
    setEditingExp({ ...DEFAULT_EXPERIENCE })
  }

  const handleOpenEdit = (exp: FormExperience) => {
    setEditingExp(exp)
  }

  const handleViewDetails = (exp: FormExperience) => {
    setViewingExp(exp)
  }

  const handleDelete = () => {
    if (!editingExp) return
    setExperiences(experiences.filter((e) => e.id !== editingExp.id))
  }

  const handleSave = (exp: FormExperience) => {
    const newExp: FormExperience = {
      id: editingExp ? editingExp.id : Date.now(),
      title: exp.title,
      companyName: exp.companyName,
      startDate: exp.startDate,
      endDate: exp.endDate,
      location: exp.location || 'Remote',
      description: exp.description,
      skills: exp.skills,
      employmentType: EMPLOYMENT_TYPE.FULL_TIME,
      files: editingExp ? editingExp.files : [],
      projects: editingExp ? editingExp.projects : [],
    }

    if (editingExp) {
      setExperiences(
        experiences.map((e) => (e.id === editingExp.id ? newExp : e)),
      )
    } else {
      setExperiences([newExp, ...experiences])
    }
  }

  return (
    <div className="text-foreground min-h-screen p-4 md:p-8">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
      `}</style>

      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <h2 className="text-xl font-semibold">Experience</h2>
          {editable && (
            <button
              onClick={handleOpenAdd}
              className="flex cursor-pointer items-center gap-1 rounded-full p-2 text-sm font-medium"
            >
              <Plus size={20} /> Add Experience
            </button>
          )}
        </div>

        {/* List */}
        <div className="divide-y divide-gray-100">
          {experiences.length === 0 && (
            <div className="p-12 text-center">
              <Briefcase className="mx-auto mb-3 opacity-20" size={48} />
              <p>No experiences added yet.</p>
            </div>
          )}
          {experiences.map((exp, experienceIndex) => (
            <ExperiencesItem
              key={`experience-${experienceIndex}`}
              experience={exp}
              editable={editable}
              onViewExperience={() => handleViewDetails(exp)}
              onEdit={() => handleOpenEdit(exp)}
            />
          ))}
        </div>
      </div>

      <ExperiencesFormDialog
        experience={editingExp}
        onClose={() => setEditingExp(null)}
        onDelete={() => handleDelete()}
        onSave={(exp) => handleSave(exp)}
      />

      {viewingExp && (
        <ExperiencesViewDialog
          experience={viewingExp}
          onClose={() => setViewingExp(null)}
        />
      )}
    </div>
  )
}

export default ProfileExperience
