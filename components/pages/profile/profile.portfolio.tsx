'use client'

import React from 'react'
import ProjectsGrid from '@/components/partials/projects/projects.grid'
import { getAllProjectsByUserId } from '@/lib/actions.projects'
import { toast } from 'sonner'
import Loader from '@/components/partials/loader'
import { useProjectsStore } from '@/store'
import { User } from '@/lib/models'

type Pagination = {
  pageSize: number
  pageIndex: number
  total: number
}

type Props = {
  user: User
  editable: boolean
}

const ProfilePortfolio: React.FC<Props> = ({ user, editable }) => {
  const { setProjects, fetching, setFetching, fetchAllTriggerValue } =
    useProjectsStore()
  const [pagination, setPagination] = React.useState<Pagination>({
    pageIndex: 0,
    pageSize: 50,
    total: 0,
  })

  React.useEffect(() => {
    const fetchAllProjects = async () => {
      const projectsResponse = await getAllProjectsByUserId({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        userId: user.id,
      })

      if (projectsResponse.status == 'error') {
        toast.error(projectsResponse.message)
      } else {
        setProjects(projectsResponse.data.projects)
        setPagination({
          pageSize: pagination.pageSize,
          pageIndex: pagination.pageIndex,
          total: projectsResponse.data.total,
        })
      }
    }

    setFetching(true)
    fetchAllProjects().finally(() => {
      setFetching(false)
    })
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    fetchAllTriggerValue,
    setFetching,
    setProjects,
  ])

  return (
    <div className="flex h-full min-h-[50vh]">
      {fetching ? <Loader /> : <ProjectsGrid editable={editable} />}
    </div>
  )
}

export default ProfilePortfolio
