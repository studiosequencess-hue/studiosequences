'use client'

import React, { useState, useMemo } from 'react'
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  Filter,
  ChevronRight,
  Bookmark,
  Share2,
  Building2,
  DollarSign,
  UserCheck,
  Globe,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// --- Types & Interfaces ---

interface Job {
  id: number
  title: string
  company: string
  location: string
  type: string
  level: string
  salary: string
  posted: string
  description: string
  applicants: number
}

interface ActiveFilters {
  type: string
  level: string
}

// --- Constants ---

const JOB_TYPES: string[] = ['Full-time', 'Contract', 'Remote', 'Part-time']
const EXPERIENCE_LEVELS: string[] = [
  'Entry Level',
  'Mid-Level',
  'Senior',
  'Lead',
  'Executive',
]

const DUMMY_JOBS: Job[] = [
  {
    id: 1,
    title: 'Senior Frontend Engineer',
    company: 'TechFlow',
    location: 'San Francisco, CA',
    type: 'Full-time',
    level: 'Senior',
    salary: '$140k - $180k',
    posted: '2h ago',
    description:
      'We are looking for a React expert to lead our dashboard team.',
    applicants: 45,
  },
  {
    id: 2,
    title: 'Product Designer',
    company: 'Creative Minds',
    location: 'Remote',
    type: 'Remote',
    level: 'Mid-Level',
    salary: '$110k - $150k',
    posted: '5h ago',
    description:
      'Design intuitive user experiences for our next-gen mobile app.',
    applicants: 120,
  },
  {
    id: 3,
    title: 'Backend Developer (Go)',
    company: 'CloudScale',
    location: 'Austin, TX',
    type: 'Full-time',
    level: 'Mid-Level',
    salary: '$130k - $170k',
    posted: '1d ago',
    description: 'Scale our infrastructure using Go and Kubernetes.',
    applicants: 32,
  },
  {
    id: 4,
    title: 'Marketing Manager',
    company: 'Growthly',
    location: 'New York, NY',
    type: 'Full-time',
    level: 'Senior',
    salary: '$90k - $130k',
    posted: '3h ago',
    description: 'Lead our performance marketing and brand strategy.',
    applicants: 89,
  },
  {
    id: 5,
    title: 'Data Scientist',
    company: 'DataPulse',
    location: 'Seattle, WA',
    type: 'Full-time',
    level: 'Mid-Level',
    salary: '$150k - $200k',
    posted: '6h ago',
    description: 'Apply machine learning to solve complex logistics problems.',
    applicants: 15,
  },
  {
    id: 6,
    title: 'UX Researcher',
    company: 'UserFirst',
    location: 'London, UK',
    type: 'Contract',
    level: 'Mid-Level',
    salary: '$80k - $110k',
    posted: '4h ago',
    description: 'Understand user behavior through qualitative research.',
    applicants: 28,
  },
  {
    id: 7,
    title: 'Sales Executive',
    company: 'SaaSify',
    location: 'Chicago, IL',
    type: 'Full-time',
    level: 'Senior',
    salary: '$70k + Commission',
    posted: '1d ago',
    description: 'Drive revenue growth for our enterprise CRM.',
    applicants: 67,
  },
  {
    id: 8,
    title: 'iOS Developer',
    company: 'MobileWave',
    location: 'Remote',
    type: 'Remote',
    level: 'Senior',
    salary: '$140k - $190k',
    posted: '12h ago',
    description: 'Build beautiful Swift applications for millions of users.',
    applicants: 41,
  },
  {
    id: 9,
    title: 'DevOps Engineer',
    company: 'StableOps',
    location: 'Denver, CO',
    type: 'Full-time',
    level: 'Mid-Level',
    salary: '$120k - $160k',
    posted: '2d ago',
    description: 'Automate everything and manage our AWS stack.',
    applicants: 19,
  },
  {
    id: 10,
    title: 'Junior Web Developer',
    company: 'StartupX',
    location: 'Remote',
    type: 'Remote',
    level: 'Entry Level',
    salary: '$60k - $80k',
    posted: '8h ago',
    description: 'Learn and grow with a fast-paced engineering team.',
    applicants: 300,
  },
  {
    id: 11,
    title: 'Product Manager',
    company: 'Visionary',
    location: 'Palo Alto, CA',
    type: 'Full-time',
    level: 'Lead',
    salary: '$180k - $240k',
    posted: '1h ago',
    description: 'Define the roadmap for our AI-driven productivity suite.',
    applicants: 54,
  },
  {
    id: 12,
    title: 'Cybersecurity Analyst',
    company: 'SecureNet',
    location: 'Washington, DC',
    type: 'Full-time',
    level: 'Mid-Level',
    salary: '$115k - $145k',
    posted: '3d ago',
    description: 'Protect our infrastructure from evolving threats.',
    applicants: 22,
  },
  {
    id: 13,
    title: 'Customer Success Lead',
    company: 'HappyClient',
    location: 'Remote',
    type: 'Remote',
    level: 'Senior',
    salary: '$95k - $125k',
    posted: '5d ago',
    description: 'Ensure our enterprise partners get maximum value.',
    applicants: 48,
  },
  {
    id: 14,
    title: 'HR Generalist',
    company: 'PeopleFirst',
    location: 'Boston, MA',
    type: 'Full-time',
    level: 'Mid-Level',
    salary: '$75k - $100k',
    posted: '1w ago',
    description: 'Manage recruiting and employee relations.',
    applicants: 92,
  },
  {
    id: 15,
    title: 'Graphic Designer',
    company: 'Studio7',
    location: 'Remote',
    type: 'Part-time',
    level: 'Entry Level',
    salary: '$40/hr',
    posted: '2h ago',
    description: 'Create visual assets for social media and marketing.',
    applicants: 110,
  },
  {
    id: 16,
    title: 'Solutions Architect',
    company: 'EnterpriseCore',
    location: 'Dallas, TX',
    type: 'Full-time',
    level: 'Lead',
    salary: '$170k - $210k',
    posted: '4d ago',
    description:
      'Bridge the gap between business needs and technical solutions.',
    applicants: 14,
  },
  {
    id: 17,
    title: 'Python Developer',
    company: 'PyLogic',
    location: 'Remote',
    type: 'Full-time',
    level: 'Senior',
    salary: '$150k - $190k',
    posted: '6h ago',
    description: 'Optimize our data pipelines and API services.',
    applicants: 36,
  },
  {
    id: 18,
    title: 'QA Engineer',
    company: 'BugFree',
    location: 'Berlin, DE',
    type: 'Contract',
    level: 'Mid-Level',
    salary: '€60k - €85k',
    posted: '2w ago',
    description: 'Maintain high quality standards through automated testing.',
    applicants: 25,
  },
  {
    id: 19,
    title: 'Chief Technology Officer',
    company: 'FutureCorp',
    location: 'San Francisco, CA',
    type: 'Full-time',
    level: 'Executive',
    salary: '$250k+',
    posted: '1mo ago',
    description: 'Lead the technical vision of a Series B startup.',
    applicants: 102,
  },
  {
    id: 20,
    title: 'Content Strategist',
    company: 'WordSmith',
    location: 'Remote',
    type: 'Remote',
    level: 'Mid-Level',
    salary: '$85k - $115k',
    posted: '12h ago',
    description: 'Craft compelling narratives across all digital channels.',
    applicants: 73,
  },
]

// --- Sub-components ---

interface FilterBadgeProps {
  label: string
  active: boolean
  onClick: () => void
}

const FilterBadge: React.FC<FilterBadgeProps> = ({
  label,
  active,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
      active
        ? 'border-accent-blue bg-accent-blue text-white'
        : 'bg-background text-foreground border-gray-300'
    }`}
  >
    {label}
  </button>
)

interface JobCardProps {
  job: Job
  isSelected: boolean
  onClick: () => void
}

const JobCard: React.FC<JobCardProps> = ({ job, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={`cursor-pointer border-b p-4 transition-colors ${
      isSelected
        ? 'border-l-accent-blue border-l-4'
        : 'bg-background text-foreground'
    }`}
  >
    <div className="flex gap-3">
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded">
        <Building2 size={24} />
      </div>
      <div className="min-w-0 flex-1">
        <h3
          className={cn(
            'truncate text-lg font-semibold hover:underline',
            isSelected ? 'text-accent-blue' : 'text-foreground',
          )}
        >
          {job.title}
        </h3>
        <p className="text-sm">{job.company}</p>
        <p className="mt-1 flex items-center gap-1 text-sm">
          <MapPin size={14} /> {job.location}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
            {job.type}
          </span>
          <span className="text-xs font-medium">{job.posted}</span>
        </div>
      </div>
    </div>
  </div>
)

interface JobDetailsProps {
  job: Job | undefined
}

const JobDetails: React.FC<JobDetailsProps> = ({ job }) => {
  if (!job)
    return (
      <div className="flex h-full flex-col items-center justify-center p-8">
        <Briefcase size={64} className="mb-4 opacity-20" />
        <p className="text-xl font-medium">Select a job to view details</p>
      </div>
    )

  return (
    <div className="h-full overflow-y-auto rounded-lg border shadow-sm">
      {/* Header */}
      <div className="border-b p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg">
              <Building2 size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{job.title}</h2>
              <p className="text-lg">
                {job.company} · {job.location}
              </p>
              <div className="mt-1 flex items-center gap-2 text-sm">
                <span>{job.posted}</span>
                <span>•</span>
                <span className="font-medium text-green-600">
                  {job.applicants} applicants
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="rounded-full p-2">
              <Share2 size={20} />
            </button>
            <button className="rounded-full p-2">
              <Bookmark size={20} />
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="bg-accent-blue rounded-full px-8 py-2 font-semibold text-white">
            Apply Now
          </button>
          <button className="border-accent-blue text-accent-blue rounded-full border px-8 py-2 font-semibold">
            Save
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8 p-6">
        <section>
          <h3 className="mb-4 text-xl font-bold">About the job</h3>
          <p className="leading-relaxed">
            {job.description} Join our growing team at {job.company} as a{' '}
            {job.title}. We are looking for someone passionate about building
            high-quality software and collaborating with cross-functional teams.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex items-start gap-3">
            <Briefcase className="mt-1" size={20} />
            <div>
              <h4 className="font-semibold">Job Type</h4>
              <p>{job.type}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <UserCheck className="mt-1" size={20} />
            <div>
              <h4 className="font-semibold">Experience Level</h4>
              <p>{job.level}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <DollarSign className="mt-1" size={20} />
            <div>
              <h4 className="font-semibold">Salary Range</h4>
              <p>{job.salary}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Globe className="mt-1" size={20} />
            <div>
              <h4 className="font-semibold">Location</h4>
              <p>{job.location}</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border p-6">
          <h3 className="mb-4 text-lg font-bold">Meet the hiring team</h3>
          <div className="flex items-center gap-4">
            <div className="text-accent-blue flex h-12 w-12 items-center justify-center rounded-full font-bold">
              JD
            </div>
            <div>
              <p className="font-bold">Jane Doe</p>
              <p className="text-sm">
                Talent Acquisition Manager at {job.company}
              </p>
              <button className="text-accent-blue mt-1 text-sm font-semibold hover:underline">
                Message Jane
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

// --- Main App Component ---

const JobsPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [locationTerm, setLocationTerm] = useState<string>('')
  const [selectedJobId, setSelectedJobId] = useState<number>(DUMMY_JOBS[0].id)
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    type: 'All',
    level: 'All',
  })

  const filteredJobs = useMemo(() => {
    return DUMMY_JOBS.filter((job: Job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesLocation = job.location
        .toLowerCase()
        .includes(locationTerm.toLowerCase())
      const matchesType =
        activeFilters.type === 'All' || job.type === activeFilters.type
      const matchesLevel =
        activeFilters.level === 'All' || job.level === activeFilters.level

      return matchesSearch && matchesLocation && matchesType && matchesLevel
    })
  }, [searchTerm, locationTerm, activeFilters])

  const selectedJob =
    filteredJobs.find((j: Job) => j.id === selectedJobId) || filteredJobs[0]

  return (
    <div className="bg-background text-foreground min-h-screen font-sans">
      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Search & Filter Bar */}
        <div className="bg-background text-foreground mb-6 rounded-lg border p-4 shadow-sm">
          <div className="mb-4 flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute top-3 left-3" size={20} />
              <input
                type="text"
                placeholder="Job title, keywords, or company"
                className="w-full rounded border py-2 pr-4 pl-10 outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
              />
            </div>
            <div className="relative flex-1">
              <MapPin className="absolute top-3 left-3" size={20} />
              <input
                type="text"
                placeholder="City, state, or zip code"
                className="w-full rounded border py-2 pr-4 pl-10 outline-none focus:ring-2 focus:ring-blue-500"
                value={locationTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setLocationTerm(e.target.value)
                }
              />
            </div>
            <button className="rounded-full bg-blue-600 px-8 py-2 font-bold hover:bg-blue-700">
              Search
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t pt-4">
            <span className="flex items-center gap-1 text-sm font-semibold">
              <Filter size={14} /> Filters:
            </span>
            <FilterBadge
              label="All Types"
              active={activeFilters.type === 'All'}
              onClick={() => setActiveFilters((f) => ({ ...f, type: 'All' }))}
            />
            {JOB_TYPES.map((type) => (
              <FilterBadge
                key={type}
                label={type}
                active={activeFilters.type === type}
                onClick={() => setActiveFilters((f) => ({ ...f, type }))}
              />
            ))}
            <div className="mx-2 h-6 w-px bg-gray-200"></div>
            <FilterBadge
              label="Any Experience"
              active={activeFilters.level === 'All'}
              onClick={() => setActiveFilters((f) => ({ ...f, level: 'All' }))}
            />
            {EXPERIENCE_LEVELS.map((level) => (
              <FilterBadge
                key={level}
                label={level}
                active={activeFilters.level === level}
                onClick={() => setActiveFilters((f) => ({ ...f, level }))}
              />
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left Panel: Job List */}
          <div className="w-full flex-shrink-0 lg:w-[400px]">
            <div className="flex h-[700px] flex-col overflow-hidden rounded-lg border shadow-sm">
              <div className="flex items-center justify-between border-b p-4">
                <span className="font-semibold">
                  {filteredJobs.length} jobs found
                </span>
                <button className="text-sm font-semibold hover:underline">
                  Set alert
                </button>
              </div>
              <div className="custom-scrollbar flex-1 overflow-y-auto">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job: Job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      isSelected={selectedJobId === job.id}
                      onClick={() => setSelectedJobId(job.id)}
                    />
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <p>No jobs found matching your criteria.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Job Details */}
          <div className="hidden h-[700px] flex-1 lg:block">
            <JobDetails job={selectedJob} />
          </div>
        </div>
      </main>

      {/* Footer Mobile Padding */}
      <div className="h-20 lg:hidden"></div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d1d1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>
    </div>
  )
}

export default JobsPage
