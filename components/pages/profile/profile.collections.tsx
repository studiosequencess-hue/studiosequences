'use client'

import React, { useState, useMemo } from 'react'
import {
  Layers,
  Image as ImageIcon,
  ChevronLeft,
  Search,
  Plus,
  Edit,
} from 'lucide-react'
import { Collection, Project } from '@/lib/models'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getPersonalProjects } from '@/lib/actions.projects'
import { QUERY_KEYS } from '@/lib/constants'
import Placeholder from '@/public/images/placeholder.svg'
import CollectionFormDialog from '@/components/partials/collections/collection.form.dialog'
import { getPersonalCollections } from '@/lib/actions.collections'
import Image from 'next/image'
import CollectionProjectsFormDialog from '@/components/partials/collections/collection.projects.form.dialog'
import Loader from '@/components/partials/loader'
import { Spinner } from '@/components/ui/spinner'
import ReactPlayer from 'react-player'

type ViewMode = 'collections' | 'projects' | 'detail'

interface BadgeProps {
  children: React.ReactNode
  icon?: React.ElementType
}

const Badge: React.FC<BadgeProps> = ({ children, icon: Icon }) => (
  <span className="inline-flex items-center gap-1 rounded-md border border-zinc-700/50 bg-zinc-900/90 px-2 py-0.5 text-[10px] font-semibold text-zinc-300 backdrop-blur-sm">
    {Icon && <Icon size={10} />}
    {children}
  </span>
)

type Props = {
  editable?: boolean
}

const ProfileCollections: React.FC<Props> = (props) => {
  const [view, setView] = useState<ViewMode>('collections')
  const [selectionCollection, setSelectionCollection] =
    useState<Collection | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [collectionFormOpen, setCollectionFormOpen] = useState<boolean>(false)
  const [collectionProjectsFormOpen, setCollectionProjectsFormOpen] =
    useState<boolean>(false)

  const collectionsQuery = useQuery({
    queryKey: [QUERY_KEYS.PERSONAL_COLLECTIONS],
    queryFn: async () => {
      const response = await getPersonalCollections()

      if (response.status == 'error') {
        return []
      } else {
        return response.data
      }
    },
  })

  const handleAlbumAdd = () => {
    setCollectionFormOpen(true)
  }

  const handleCollectionClick = (album: Collection) => {
    setSelectionCollection(album)
    setView('projects')
  }

  const handleProjectAdd = () => {
    setCollectionProjectsFormOpen(true)
  }

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project)
    setView('detail')
  }

  const handleBack = () => {
    if (view === 'detail') {
      setView('projects')
      setSelectedProject(null)
    } else if (view === 'projects') {
      setView('collections')
      setSelectionCollection(null)
    }
  }

  const filteredCollections = useMemo(() => {
    return (collectionsQuery.data || []).filter((collection) =>
      collection.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [searchQuery, collectionsQuery])

  const getCollectionPreview = (
    collection: Collection,
  ): { url: string; type: string } => {
    return collection.projects.length > 0
      ? collection.projects[0].files.length > 0
        ? {
            url: collection.projects[0].files[0].url || Placeholder,
            type: collection.projects[0].files[0].type,
          }
        : {
            url: Placeholder,
            type: 'image',
          }
      : {
          url: Placeholder,
          type: 'image',
        }
  }

  const getProjectPreview = (
    project: Project,
  ): { url: string; type: string } => {
    return project.files.length > 0
      ? {
          url: project.files[0].url || Placeholder,
          type: project.files[0].type,
        }
      : {
          url: Placeholder,
          type: 'image',
        }
  }

  React.useEffect(() => {
    if (selectionCollection) {
      setSelectionCollection(
        collectionsQuery.data?.find((c) => c.id == selectionCollection.id) ||
          null,
      )
    }
  }, [collectionsQuery.data])

  return (
    <div className="min-h-screen bg-zinc-950 p-4 font-sans text-zinc-100 md:p-8">
      <CollectionFormDialog
        open={collectionFormOpen}
        setOpen={setCollectionFormOpen}
        onSuccess={() => {
          collectionsQuery.refetch()
        }}
      />
      {selectionCollection && (
        <CollectionProjectsFormDialog
          open={collectionProjectsFormOpen}
          setOpen={setCollectionProjectsFormOpen}
          collection={selectionCollection}
          onSuccess={() => {
            collectionsQuery.refetch()
          }}
        />
      )}

      <main className="mx-auto max-w-7xl">
        {/* Navigation / Search Bar */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            {view !== 'collections' && (
              <button
                onClick={handleBack}
                className="rounded-lg border border-zinc-800 p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                {view === 'collections' && 'Collections'}
                {view === 'projects' && selectionCollection?.name}
                {view === 'detail' && selectedProject?.title}
              </h1>
              <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                {view === 'collections' &&
                  `${filteredCollections.length} Collections`}
                {view === 'projects' &&
                  `${selectionCollection?.projects.length} Projects`}
                {view === 'detail' && `${selectedProject?.files.length} Files`}
              </span>
            </div>
          </div>

          {view === 'collections' && (
            <div className="relative w-full md:w-72">
              <Search
                className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-500"
                size={16}
              />
              <input
                type="text"
                placeholder="Search portfolio..."
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-1.5 pr-4 pl-9 text-sm transition-all placeholder:text-zinc-600 focus:ring-1 focus:ring-zinc-600 focus:outline-none"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
              />
            </div>
          )}
        </div>

        {/* VIEW: ALBUMS GRID */}
        {view === 'collections' && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {props.editable && (
              <div onClick={handleAlbumAdd} className="group cursor-pointer">
                <div className="relative flex aspect-square items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 transition-all duration-300 group-hover:border-zinc-500">
                  <Plus size={32} />
                </div>
              </div>
            )}
            {collectionsQuery.isLoading ? (
              <div onClick={handleAlbumAdd} className="group cursor-pointer">
                <div className="relative flex aspect-square items-center justify-center rounded-xl">
                  <Spinner />
                </div>
              </div>
            ) : (
              filteredCollections.map((collection) => {
                const collectionPreview = getCollectionPreview(collection)

                return (
                  <div
                    key={collection.id}
                    onClick={() => handleCollectionClick(collection)}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition-all duration-300 group-hover:border-zinc-500">
                      <div className={'relative h-full w-full'}>
                        {collectionPreview.type === 'image' ? (
                          <Image
                            src={collectionPreview.url}
                            alt={collection.name}
                            fill
                            className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-100"
                          />
                        ) : (
                          <ReactPlayer
                            src={collectionPreview.url}
                            width={'100%'}
                            height={'100% '}
                          />
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                      <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                        <Badge icon={Layers}>
                          {collection.projects.length}
                        </Badge>
                        <Badge icon={ImageIcon}>
                          {collection.projects.reduce(
                            (acc, p) => acc + p.files.length,
                            0,
                          )}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-2 px-0.5">
                      <h3 className="truncate text-xs font-bold tracking-wide uppercase transition-colors group-hover:text-zinc-300">
                        {collection.name}
                      </h3>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* VIEW: PROJECTS IN ALBUM */}
        {view === 'projects' && selectionCollection && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {props.editable && (
              <div onClick={handleProjectAdd} className="group cursor-pointer">
                <div className="relative flex aspect-[3/2] items-center justify-center overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 transition-all group-hover:border-zinc-600">
                  <Edit size={32} />
                </div>
              </div>
            )}
            {selectionCollection.projects.map((project) => {
              const projectPreview = getProjectPreview(project)

              return (
                <div
                  key={project.id}
                  onClick={() => handleProjectClick(project)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[3/2] overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 transition-all group-hover:border-zinc-600">
                    {projectPreview.type === 'image' ? (
                      <Image
                        src={projectPreview.url}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <ReactPlayer
                        src={projectPreview.url}
                        width={'100%'}
                        height={'100% '}
                      />
                    )}
                    <div className="absolute right-2 bottom-2">
                      <Badge icon={ImageIcon}>{project.files.length}</Badge>
                    </div>
                  </div>
                  <div className="mt-3">
                    <h3 className="truncate text-sm font-bold">
                      {project.title}
                    </h3>
                    <p className="mt-0.5 line-clamp-1 text-[11px] text-zinc-500">
                      {project.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* VIEW: PROJECT DETAIL */}
        {view === 'detail' && selectedProject && (
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="border-b border-zinc-900 pb-6">
              <p className="text-sm leading-relaxed text-zinc-400">
                {selectedProject.description}
              </p>
            </div>
            <div className="space-y-4">
              {selectedProject.files.map((file, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square w-full rounded-lg border border-zinc-900 bg-zinc-900"
                >
                  {file.type === 'image' ? (
                    <Image
                      src={file.url}
                      alt={`selected-project-${idx}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <ReactPlayer
                      src={file.url}
                      controls
                      width={'100%'}
                      height={'100% '}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center pt-8">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-xs font-bold tracking-widest text-zinc-500 uppercase transition-colors hover:text-white"
              >
                <ChevronLeft size={16} /> Back to {selectionCollection?.name}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default ProfileCollections
