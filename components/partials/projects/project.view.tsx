'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useProjectsStore } from '@/store/project.viewer.store'
import { X } from 'lucide-react'

const ProjectView = () => {
  const {
    viewProject: project,
    viewIsOpen: open,
    viewClose: close,
  } = useProjectsStore()

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) {
          close()
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
        </DialogHeader>
        {project && (
          <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div>
                <h2 className="text-xs font-black tracking-[0.2em] uppercase">
                  {project.title}
                </h2>
                <p className="mt-0.5 text-[10px] tracking-widest text-zinc-500 uppercase">
                  {project.description}
                </p>
              </div>
              <button
                onClick={close}
                className="rounded-full p-2 transition-colors hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Images Container */}
            <div className="custom-scrollbar flex-1 space-y-8 overflow-y-auto p-4 md:p-12">
              <div className="mx-auto max-w-5xl space-y-12">
                {project.images.map((img, index) => (
                  <div key={index} className="group relative">
                    <img
                      src={img.url}
                      alt={`${project.title} - ${index + 1}`}
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
      </DialogContent>
    </Dialog>
  )
}

export default ProjectView
