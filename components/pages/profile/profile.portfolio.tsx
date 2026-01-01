'use client'

import React from 'react'
import { Project } from '@/lib/models'
import ProjectsGrid from '@/components/partials/projects/projects.grid'

const ProfilePortfolio: React.FC = () => {
  const [projects, setProjects] = React.useState<Project[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    setLoading(true)

    setLoading(false)
  }, [])

  return (
    <div className="flex h-full min-h-[50vh]">
      <ProjectsGrid projects={projects} editable={true} />
    </div>
  )
}

export default ProfilePortfolio
