'use client'

import React, { useState } from 'react'
import { Briefcase, Plus } from 'lucide-react'
import { FormExperience, UserExperience } from '@/lib/models'
import ExperiencesViewDialog from '@/components/partials/experiences/experiences.view.dialog'
import { QUERY_KEYS } from '@/lib/constants'
import ExperiencesFormDialog from '@/components/partials/experiences/experiences.form.dialog'
import ExperiencesItem from '@/components/partials/experiences/experiences.item'
import { DEFAULT_EXPERIENCE } from '@/lib/defaults'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { getExperiences } from '@/lib/actions.experiences'
import { useAuthStore } from '@/store'
import Loader from '@/components/partials/loader'

type Props = {
  editable: boolean
}

const ProfileExperience: React.FC<Props> = ({ editable }) => {
  const { user } = useAuthStore()

  const [editingExp, setEditingExp] = useState<FormExperience | null>(null)
  const [viewingExp, setViewingExp] = useState<FormExperience | null>(null)

  const loadExperiencesQuery = useQuery<UserExperience[]>({
    queryKey: [QUERY_KEYS.EXPERIENCES, user?.id],
    queryFn: async () => {
      if (!user) return []

      const response = await getExperiences({
        userId: user.id,
      })

      return response.status == 'success' ? response.data : []
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // stale time of 5 min
  })

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

  return (
    <div className="min-h-96 py-8">
      <div className="border-foreground/25 relative mx-auto max-w-3xl rounded-xl border">
        {/* Header */}
        <div className="border-foreground/25 sticky top-0 z-10 flex items-center justify-between border-b px-6 py-3">
          <h2 className="text-sm/none font-semibold">Experience</h2>
          {editable && (
            <Button
              variant={'ghost'}
              onClick={handleOpenAdd}
              disabled={loadExperiencesQuery.isLoading}
              className={'flex items-center gap-1'}
            >
              <Plus size={20} />
              <span>Add Experience</span>
            </Button>
          )}
        </div>

        {/* List */}
        <div className="divide-foreground/25 divide-y">
          {loadExperiencesQuery.isLoading ? (
            <Loader />
          ) : (loadExperiencesQuery.data || []).length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 p-12 text-sm/none">
              <Briefcase className="opacity-20" size={44} />
              <p>No experiences added yet.</p>
            </div>
          ) : (
            (loadExperiencesQuery.data || []).map(
              (experience, experienceIndex) => {
                const formExperience = {
                  ...experience,
                  files: experience.files.map((file) => ({
                    ...file,
                  })),
                  projects: experience.projects.map(
                    (project) => project.projectId,
                  ),
                }

                return (
                  <ExperiencesItem
                    key={`experience-${experienceIndex}`}
                    experience={formExperience}
                    editable={editable}
                    onViewExperience={() => handleViewDetails(formExperience)}
                    onEdit={() => handleOpenEdit(formExperience)}
                  />
                )
              },
            )
          )}
        </div>
      </div>

      <ExperiencesFormDialog
        experience={editingExp}
        onClose={() => setEditingExp(null)}
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
