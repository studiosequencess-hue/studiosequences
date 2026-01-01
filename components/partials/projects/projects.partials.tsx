import React from 'react'
import ProjectView from '@/components/partials/projects/project.view'
import ProjectCreate from '@/components/partials/projects/project.create'

const ProjectsPartials = () => {
  return (
    <React.Fragment>
      <ProjectView />
      <ProjectCreate />
    </React.Fragment>
  )
}

export default ProjectsPartials
