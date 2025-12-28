'use client'

import React, { useState, useMemo } from 'react'
import { Lock, Layers, X } from 'lucide-react'

/**
 * Interfaces for Art Portfolio Data
 */
interface Project {
  id: number
  title: string
  category: string
  images: string[]
  isSensitive: boolean
}

/**
 * ArtPortfolio Component
 * A minimalist, type-safe grid for art specialists.
 */
const ProfilePortfolio: React.FC = () => {
  const [revealedIds, setRevealedIds] = useState<Set<number>>(new Set())
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  // Mock data for 30 artistic projects, each with 3-5 images
  const projects = useMemo<Project[]>(() => {
    const categories: string[] = [
      'Digital Painting',
      'Fine Art',
      'Concept Art',
      'Architecture',
      'Sketching',
      'Illustration',
      '3D Modeler',
      'Street Art',
      'Photography',
      'Graphic Design',
    ]

    return Array.from({ length: 50 }, (_, i) => {
      const id = i + 1
      const isSensitive = [2, 9, 17, 34, 41].includes(id)
      // eslint-disable-next-line react-hooks/purity
      const imageCount = Math.floor(Math.random() * 3) + 3

      return {
        id,
        title: `Project ${id}`,
        category: categories[i % categories.length],
        images: Array.from(
          { length: imageCount },
          (_, imgIdx) =>
            `https://picsum.photos/seed/art-v5-${id}-${imgIdx}/1200/1200`,
        ),
        isSensitive,
      }
    })
  }, [])

  const toggleReveal = (e: React.MouseEvent, id: number): void => {
    e.stopPropagation() // Prevent opening modal when clicking reveal
    setRevealedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const openProject = (project: Project): void => {
    const isCensored = project.isSensitive && !revealedIds.has(project.id)
    if (!isCensored) {
      setSelectedProject(project)
      // eslint-disable-next-line react-hooks/immutability
      document.body.style.overflow = 'hidden'
    }
  }

  const closeProject = (): void => {
    setSelectedProject(null)
    document.body.style.overflow = 'auto'
  }

  return (
    <div className="min-h-screen bg-black font-sans text-zinc-100">
      <main className="w-full">
        <div className="grid grid-cols-3 leading-[0] sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10">
          {projects.map((project) => {
            const isCensored =
              project.isSensitive && !revealedIds.has(project.id)

            return (
              <div
                key={project.id}
                onClick={() => openProject(project)}
                className={`group relative aspect-square overflow-hidden border-[0.5px] border-white/5 bg-zinc-950 ${!isCensored ? 'cursor-pointer' : ''}`}
              >
                {/* Primary Image */}
                <img
                  src={project.images[0]}
                  alt={project.title}
                  className={`h-full w-full object-cover transition-all duration-1000 ${
                    isCensored
                      ? 'scale-150 opacity-30 blur-3xl grayscale'
                      : 'group-hover:scale-110'
                  }`}
                />

                {/* Multi-image Indicator */}
                {!isCensored && (
                  <div className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded-sm border border-white/10 bg-black/40 px-1.5 py-0.5 opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">
                    <Layers className="h-2.5 w-2.5 text-white/70" />
                    <span className="text-[9px] font-black text-white/90 uppercase">
                      {project.images.length}
                    </span>
                  </div>
                )}

                {/* Sensitive Content Overlay */}
                {isCensored && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 transition-colors duration-300 group-hover:bg-black/40">
                    <div className="flex flex-col items-center gap-3 p-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                        <Lock className="h-3.5 w-3.5 text-white/40" />
                      </div>
                      <button
                        onClick={(e) => toggleReveal(e, project.id)}
                        className="rounded-full bg-white px-4 py-1.5 text-[9px] font-black tracking-widest text-black uppercase shadow-lg shadow-black/20 transition-all hover:bg-zinc-200 active:scale-95"
                      >
                        Reveal
                      </button>
                    </div>
                  </div>
                )}

                {/* Subtle Hover Details */}
                {!isCensored && (
                  <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="mb-0.5 text-[8px] font-black tracking-tighter text-white uppercase opacity-60">
                      {project.category}
                    </p>
                    <p className="truncate text-[10px] font-bold tracking-widest text-white uppercase">
                      {project.title}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-xl">
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <div>
              <h2 className="text-xs font-black tracking-[0.2em] uppercase">
                {selectedProject.title}
              </h2>
              <p className="mt-0.5 text-[10px] tracking-widest text-zinc-500 uppercase">
                {selectedProject.category} — {selectedProject.images.length}{' '}
                Assets
              </p>
            </div>
            <button
              onClick={closeProject}
              className="rounded-full p-2 transition-colors hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Images Container */}
          <div className="custom-scrollbar flex-1 space-y-8 overflow-y-auto p-4 md:p-12">
            <div className="mx-auto max-w-5xl space-y-12">
              {selectedProject.images.map((img, index) => (
                <div key={index} className="group relative">
                  <img
                    src={img}
                    alt={`${selectedProject.title} - ${index + 1}`}
                    className="h-auto w-full bg-zinc-900/50 object-contain shadow-2xl"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 border border-white/10 bg-black/50 px-2 py-1 text-[9px] font-bold tracking-widest uppercase opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">
                    View {index + 1}
                  </div>
                </div>
              ))}
            </div>

            <div className="mx-auto max-w-5xl border-t border-white/5 pt-20 pb-10 text-center">
              <p className="text-[10px] font-black tracking-[0.4em] text-zinc-600 uppercase italic">
                End of Project
              </p>
            </div>
          </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `,
        }}
      />
    </div>
  )
}

export default ProfilePortfolio
