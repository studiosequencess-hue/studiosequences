'use client'

import React, { useState, useMemo } from 'react'
import { Layers, Image as ImageIcon, ChevronLeft, Search } from 'lucide-react'

// --- Type Definitions ---

interface Project {
  id: string
  title: string
  description: string
  images: string[]
}

interface Album {
  id: string
  title: string
  description: string
  coverImage: string
  projects: Project[]
}

type ViewMode = 'albums' | 'projects' | 'detail'

// --- Expanded Mock Data (10 Albums) ---

const MOCK_ALBUMS: Album[] = [
  {
    id: 'a1',
    title: 'Concept Art 2024',
    description:
      'Environmental storytelling and world-building for "Project Aether".',
    coverImage:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
    projects: [
      {
        id: 'p1',
        title: 'Cyberpunk Slums',
        description: 'Neon lighting and verticality studies.',
        images: [
          'https://images.unsplash.com/photo-1605142859862-978be7eba909?auto=format&fit=crop&q=80&w=1200',
          'https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=1200',
        ],
      },
      {
        id: 'p2',
        title: 'Ancient Relics',
        description: 'Mystical artifacts and weaponry.',
        images: [
          'https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=1200',
        ],
      },
    ],
  },
  {
    id: 'a2',
    title: 'Digital Sculptures',
    description: 'High-poly character sculpts and anatomical studies.',
    coverImage:
      'https://images.unsplash.com/photo-1554188248-986adbb73be4?auto=format&fit=crop&q=80&w=800',
    projects: [
      {
        id: 'p3',
        title: 'Human Anatomy V1',
        description: 'Realistic male torso study.',
        images: [
          'https://images.unsplash.com/photo-1558864559-ed673ba3610b?auto=format&fit=crop&q=80&w=1200',
        ],
      },
    ],
  },
  {
    id: 'a3',
    title: 'Illustration Works',
    description: 'Commercial illustrations for book covers.',
    coverImage:
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800',
    projects: [
      {
        id: 'p4',
        title: 'Forest Spirits',
        description: 'Whimsical character illustrations.',
        images: [
          'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1200',
          'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&q=80&w=1200',
        ],
      },
    ],
  },
  {
    id: 'a4',
    title: 'Architectural Viz',
    description: 'Photorealistic interior and exterior renders.',
    coverImage:
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800',
    projects: [
      {
        id: 'p5',
        title: 'Modern Loft',
        description: 'Lighting study for industrial spaces.',
        images: [
          'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200',
        ],
      },
    ],
  },
  {
    id: 'a5',
    title: 'UI/UX Prototypes',
    description: 'Interface designs for high-end creative software.',
    coverImage:
      'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=800',
    projects: [
      {
        id: 'p6',
        title: 'Nodes Editor',
        description: 'Visual scripting interface.',
        images: [
          'https://images.unsplash.com/photo-1581291518655-9523bb99a9f9?auto=format&fit=crop&q=80&w=1200',
        ],
      },
    ],
  },
  {
    id: 'a6',
    title: 'Motion Graphics',
    description: 'Abstract loops and kinetic typography experiments.',
    coverImage:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
    projects: [
      {
        id: 'p7',
        title: 'Glitch Reels',
        description: 'Experimental distortion techniques.',
        images: [
          'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200',
        ],
      },
    ],
  },
  {
    id: 'a7',
    title: 'Photography',
    description: 'Street and urban exploration photography.',
    coverImage:
      'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&q=80&w=800',
    projects: [
      {
        id: 'p8',
        title: 'Tokyo Nights',
        description: 'Long exposure street shots.',
        images: [
          'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=1200',
        ],
      },
    ],
  },
  {
    id: 'a8',
    title: '3D Environments',
    description: 'Game-ready environments built in Unreal Engine 5.',
    coverImage:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800',
    projects: [
      {
        id: 'p9',
        title: 'Overgrown Temple',
        description: 'Vegetation and ruin study.',
        images: [
          'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200',
        ],
      },
    ],
  },
  {
    id: 'a9',
    title: 'Matte Painting',
    description: 'High-end set extensions for film.',
    coverImage:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800',
    projects: [
      {
        id: 'p10',
        title: 'Cloud City',
        description: 'Skyline extensions for sci-fi.',
        images: [
          'https://images.unsplash.com/photo-1444084316824-dc26d6657664?auto=format&fit=crop&q=80&w=1200',
        ],
      },
    ],
  },
  {
    id: 'a10',
    title: 'Character Design',
    description: 'Original character sheets and turnarounds.',
    coverImage:
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=800',
    projects: [
      {
        id: 'p11',
        title: 'The Nomad',
        description: 'Fantasy explorer concept.',
        images: [
          'https://images.unsplash.com/photo-1533109721025-d1ae7ee7c1e1?auto=format&fit=crop&q=80&w=1200',
        ],
      },
    ],
  },
]

// --- Helper Components ---

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

// --- Main Component ---

const ProfileCollections: React.FC = () => {
  const [view, setView] = useState<ViewMode>('albums')
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')

  const handleAlbumClick = (album: Album) => {
    setSelectedAlbum(album)
    setView('projects')
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
      setView('albums')
      setSelectedAlbum(null)
    }
  }

  const filteredAlbums = useMemo(() => {
    return MOCK_ALBUMS.filter(
      (a) =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [searchQuery])

  return (
    <div className="min-h-screen bg-zinc-950 p-4 font-sans text-zinc-100 md:p-8">
      <main className="mx-auto max-w-7xl">
        {/* Navigation / Search Bar */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            {view !== 'albums' && (
              <button
                onClick={handleBack}
                className="rounded-lg border border-zinc-800 p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                {view === 'albums' && 'Collections'}
                {view === 'projects' && selectedAlbum?.title}
                {view === 'detail' && selectedProject?.title}
              </h1>
              <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                {view === 'albums' && `${filteredAlbums.length} Collections`}
                {view === 'projects' &&
                  `${selectedAlbum?.projects.length} Projects`}
                {view === 'detail' &&
                  `${selectedProject?.images.length} Images`}
              </span>
            </div>
          </div>

          {view === 'albums' && (
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
        {view === 'albums' && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredAlbums.map((album) => (
              <div
                key={album.id}
                onClick={() => handleAlbumClick(album)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-square overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition-all duration-300 group-hover:border-zinc-500">
                  <img
                    src={album.coverImage}
                    alt={album.title}
                    className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                  <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                    <Badge icon={Layers}>{album.projects.length}</Badge>
                    <Badge icon={ImageIcon}>
                      {album.projects.reduce(
                        (acc, p) => acc + p.images.length,
                        0,
                      )}
                    </Badge>
                  </div>
                </div>
                <div className="mt-2 px-0.5">
                  <h3 className="truncate text-xs font-bold tracking-wide uppercase transition-colors group-hover:text-zinc-300">
                    {album.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VIEW: PROJECTS IN ALBUM */}
        {view === 'projects' && selectedAlbum && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {selectedAlbum.projects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleProjectClick(project)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[3/2] overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 transition-all group-hover:border-zinc-600">
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute right-2 bottom-2">
                    <Badge icon={ImageIcon}>{project.images.length}</Badge>
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
            ))}
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
              {selectedProject.images.map((img, idx) => (
                <div
                  key={idx}
                  className="overflow-hidden rounded-lg border border-zinc-900 bg-zinc-900"
                >
                  <img
                    src={img}
                    alt={`${selectedProject.title} ${idx + 1}`}
                    className="h-auto w-full"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-center pt-8">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-xs font-bold tracking-widest text-zinc-500 uppercase transition-colors hover:text-white"
              >
                <ChevronLeft size={16} /> Back to {selectedAlbum?.title}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default ProfileCollections
