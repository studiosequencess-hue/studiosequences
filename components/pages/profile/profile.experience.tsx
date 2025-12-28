'use client'

import React, {
  useRef,
  useState,
  MouseEvent,
  ChangeEvent,
  FormEvent,
} from 'react'
import {
  Briefcase,
  MapPin,
  Plus,
  Pencil,
  X,
  Trash2,
  Save,
  Info,
} from 'lucide-react'

interface PortfolioItem {
  id: string | number
  url: string
}

interface Experience {
  id: number
  role: string
  company: string
  logoColor: string
  employmentType: string
  startDate: string
  endDate: string
  location: string
  description: string
  skills: string[]
  portfolio: PortfolioItem[]
}

interface FormData {
  role: string
  company: string
  startDate: string
  endDate: string
  location: string
  description: string
  skills: string
}

/**
 * Sub-component to handle the horizontal scroll logic correctly.
 * Properly typed for React and MouseEvents.
 */
const PortfolioGallery: React.FC<{ portfolio: PortfolioItem[] }> = ({
  portfolio,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [startX, setStartX] = useState<number>(0)
  const [scrollLeft, setScrollLeft] = useState<number>(0)

  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return
    e.stopPropagation()
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const onMouseUp = () => setIsDragging(false)
  const onMouseLeave = () => setIsDragging(false)

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    e.stopPropagation()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 2
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  if (!portfolio || portfolio.length === 0) return null

  return (
    <div className="relative mt-4 overflow-hidden">
      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        onClick={(e) => e.stopPropagation()}
        className={`custom-scrollbar flex cursor-grab gap-3 overflow-x-auto pb-2 select-none ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
      >
        {portfolio.map((item) => (
          <div key={item.id} className="pointer-events-none w-32 flex-shrink-0">
            <div className="aspect-[4/3] overflow-hidden rounded-md border border-gray-200">
              <img
                src={item.url}
                alt="Work"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

type Props = {
  editable: boolean
}

const ProfileExperience: React.FC<Props> = ({ editable }) => {
  // Main state with 3 default experiences
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: 1,
      role: 'Senior Full Stack Engineer',
      company: 'TechFlow Systems',
      logoColor: 'bg-blue-600',
      employmentType: 'Full-time',
      startDate: 'Jan 2022',
      endDate: 'Present',
      location: 'San Francisco, CA',
      description:
        'Leading the core platform team in architecting scalable microservices and optimizing cloud infrastructure. Focusing on high-availability systems and developer productivity.',
      skills: ['React.js', 'Node.js', 'AWS', 'TypeScript'],
      portfolio: [
        { id: 'p1', url: 'https://picsum.photos/seed/tech1/400/300' },
        { id: 'p2', url: 'https://picsum.photos/seed/tech2/400/300' },
        { id: 'p3', url: 'https://picsum.photos/seed/tech3/400/300' },
        { id: 'p4', url: 'https://picsum.photos/seed/tech4/400/300' },
      ],
    },
    {
      id: 2,
      role: 'Product Designer',
      company: 'Creative Pulse Studio',
      logoColor: 'bg-purple-500',
      employmentType: 'Full-time',
      startDate: 'Mar 2019',
      endDate: 'Dec 2021',
      location: 'New York, NY',
      description:
        'Spearheaded user research and designed high-fidelity prototypes for international clients in the fintech space. Created robust design systems for cross-platform products.',
      skills: ['Figma', 'Design Systems', 'User Research', 'Prototyping'],
      portfolio: [
        { id: 'p5', url: 'https://picsum.photos/seed/art5/400/300' },
        { id: 'p6', url: 'https://picsum.photos/seed/art6/400/300' },
        { id: 'p7', url: 'https://picsum.photos/seed/art7/400/300' },
      ],
    },
    {
      id: 3,
      role: 'Frontend Developer',
      company: 'Innovate Digital',
      logoColor: 'bg-emerald-500',
      employmentType: 'Contract',
      startDate: 'Jun 2017',
      endDate: 'Feb 2019',
      location: 'Austin, TX',
      description:
        'Developed responsive web applications focusing on accessibility and performance metrics. Implemented complex UI components and animations using modern JS frameworks.',
      skills: ['HTML5', 'Tailwind CSS', 'JavaScript', 'Vue.js'],
      portfolio: [
        { id: 'p8', url: 'https://picsum.photos/seed/web1/400/300' },
        { id: 'p9', url: 'https://picsum.photos/seed/web2/400/300' },
      ],
    },
  ])

  // UI State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false)
  const [editingExp, setEditingExp] = useState<Experience | null>(null)
  const [viewingExp, setViewingExp] = useState<Experience | null>(null)

  // Form State
  const [formData, setFormData] = useState<FormData>({
    role: '',
    company: '',
    startDate: '',
    endDate: 'Present',
    location: '',
    description: '',
    skills: '',
  })

  // Actions
  const handleOpenAdd = () => {
    setEditingExp(null)
    setFormData({
      role: '',
      company: '',
      startDate: '',
      endDate: 'Present',
      location: '',
      description: '',
      skills: '',
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (e: MouseEvent, exp: Experience) => {
    e.stopPropagation()
    setEditingExp(exp)
    setFormData({
      role: exp.role,
      company: exp.company,
      startDate: exp.startDate,
      endDate: exp.endDate,
      location: exp.location,
      description: exp.description,
      skills: exp.skills.join(', '),
    })
    setIsModalOpen(true)
  }

  const handleViewDetails = (exp: Experience) => {
    setViewingExp(exp)
    setIsDetailOpen(true)
  }

  const handleDelete = () => {
    if (!editingExp) return
    setExperiences(experiences.filter((e) => e.id !== editingExp.id))
    setIsModalOpen(false)
  }

  const handleSave = (e: FormEvent) => {
    e.preventDefault()
    const newExp: Experience = {
      role: formData.role,
      company: formData.company,
      startDate: formData.startDate,
      endDate: formData.endDate,
      location: formData.location || 'Remote',
      description: formData.description,
      id: editingExp ? editingExp.id : Date.now(),
      skills: formData.skills
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s !== ''),
      logoColor: editingExp ? editingExp.logoColor : 'bg-gray-600',
      employmentType: 'Full-time',
      portfolio: editingExp
        ? editingExp.portfolio
        : [
            {
              id: Math.random(),
              url: `https://picsum.photos/seed/${Math.random()}/400/300`,
            },
            {
              id: Math.random(),
              url: `https://picsum.photos/seed/${Math.random()}/400/300`,
            },
          ],
    }

    if (editingExp) {
      setExperiences(
        experiences.map((e) => (e.id === editingExp.id ? newExp : e)),
      )
    } else {
      setExperiences([newExp, ...experiences])
    }
    setIsModalOpen(false)
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
          {experiences.map((exp) => (
            <div
              key={exp.id}
              onClick={() => editable && handleViewDetails(exp)}
              className="group relative cursor-pointer p-6 transition-colors"
            >
              <div className="flex flex-col gap-4 sm:flex-row">
                <div
                  className={`h-12 w-12 flex-shrink-0 rounded ${exp.logoColor} flex items-center justify-center shadow-inner`}
                >
                  <Briefcase size={28} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="group-hover:text-accent-blue text-base font-bold transition-colors">
                        {exp.role}
                      </h3>
                      <p className="text-sm font-medium">{exp.company}</p>
                      <p className="mt-0.5 text-sm">
                        {exp.startDate} – {exp.endDate}
                      </p>
                    </div>
                    {editable && (
                      <button
                        onClick={(e) => handleOpenEdit(e, exp)}
                        className="rounded-full p-2 opacity-0 transition-all group-hover:opacity-100"
                      >
                        <Pencil size={18} />
                      </button>
                    )}
                  </div>

                  {exp.description && (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed">
                      {exp.description}
                    </p>
                  )}

                  <PortfolioGallery portfolio={exp.portfolio} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EDIT/ADD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b bg-gray-50 px-6 py-4">
              <h3 className="text-lg font-bold text-gray-800">
                {editingExp ? 'Edit Experience' : 'Add Experience'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="space-y-4 overflow-y-auto p-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="mb-1 block text-xs font-bold text-gray-500 uppercase">
                    Title
                  </label>
                  <input
                    required
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Senior Designer"
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-xs font-bold text-gray-500 uppercase">
                    Company
                  </label>
                  <input
                    required
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Acme Corp"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-gray-500 uppercase">
                    Start Date
                  </label>
                  <input
                    required
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Jan 2022"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-gray-500 uppercase">
                    End Date
                  </label>
                  <input
                    required
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Present"
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-xs font-bold text-gray-500 uppercase">
                    Skills (comma separated)
                  </label>
                  <input
                    value={formData.skills}
                    onChange={(e) =>
                      setFormData({ ...formData, skills: e.target.value })
                    }
                    className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="React, Figma, Design Systems"
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-xs font-bold text-gray-500 uppercase">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="h-24 w-full resize-none rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </form>

            <div className="flex items-center justify-between border-t bg-gray-50 px-6 py-4">
              {editingExp ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50"
                >
                  <Trash2 size={16} /> Delete
                </button>
              ) : (
                <div />
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-4 py-2 font-semibold text-gray-600 transition-colors hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  <Save size={18} /> Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW DETAIL MODAL */}
      {isDetailOpen && viewingExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-700">
              <button
                onClick={() => setIsDetailOpen(false)}
                className="absolute top-4 right-4 rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white/40"
              >
                <X />
              </button>
            </div>
            <div className="-mt-8 overflow-y-auto px-8 pb-8">
              <div
                className={`h-20 w-20 rounded-xl ${viewingExp.logoColor} mb-4 flex items-center justify-center border-4 border-white text-white shadow-lg`}
              >
                <Briefcase size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {viewingExp.role}
              </h2>
              <p className="text-lg font-medium text-gray-600">
                {viewingExp.company}
              </p>
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                <span>
                  {viewingExp.startDate} – {viewingExp.endDate}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {viewingExp.location}
                </span>
              </div>

              <div className="mt-6">
                <h4 className="mb-2 flex items-center gap-2 font-bold text-gray-900 underline decoration-blue-200">
                  <Info size={16} /> Description
                </h4>
                <p className="leading-relaxed text-gray-700">
                  {viewingExp.description || 'No description provided.'}
                </p>
              </div>

              <div className="mt-6">
                <h4 className="mb-2 font-bold text-gray-900">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {viewingExp.skills.map((s, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold tracking-wider text-blue-700 uppercase"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <h4 className="mb-3 font-bold text-gray-900">
                  Portfolio Highlights
                </h4>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {viewingExp.portfolio?.map((item) => (
                    <div
                      key={item.id}
                      className="group relative aspect-video overflow-hidden rounded-lg border"
                    >
                      <img
                        src={item.url}
                        alt="Project"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileExperience
