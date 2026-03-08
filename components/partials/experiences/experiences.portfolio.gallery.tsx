import React from 'react'
import { FormExperience } from '@/lib/models'

type Props = {
  experience: FormExperience
}

const ExperiencesPortfolioGallery: React.FC<Props> = (props) => {
  const files = props.experience.files
  const projects = props.experience.projects

  console.log(files, projects)

  return <div></div>
}

export default ExperiencesPortfolioGallery
