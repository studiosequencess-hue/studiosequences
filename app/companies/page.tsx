'use client'

import React, { useState, useMemo } from 'react'
import {
  Search,
  MapPin,
  Briefcase,
  ArrowLeft,
  Building2,
  Sparkles,
} from 'lucide-react'

// --- Types & Interfaces ---

interface Specialty {
  name: string
}

interface Company {
  id: string
  name: string
  type: string
  location: string
  employees: string
  specialties: string[]
  openRoles: number
  logo: string
  cover: string
  description?: string
}

// --- Expanded Mock Data (20 total) ---

const MOCK_COMPANIES: Company[] = [
  {
    id: '1',
    name: 'Canvas & Chrome',
    type: 'Digital Art Agency',
    location: 'New York, NY',
    employees: '50-200',
    specialties: ['Concept Art', 'VR/AR'],
    openRoles: 4,
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop',
    cover: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800',
  },
  {
    id: '2',
    name: 'Gilded Frame',
    type: 'Fine Art Gallery',
    location: 'London, UK',
    employees: '11-50',
    specialties: ['Curation', 'Oil Painting'],
    openRoles: 2,
    logo: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=100&h=100&fit=crop',
    cover: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
  },
  {
    id: '3',
    name: 'Pixel Collective',
    type: 'Branding',
    location: 'Berlin, DE',
    employees: '201-500',
    specialties: ['UI/UX', 'Motion'],
    openRoles: 0,
    logo: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=100&h=100&fit=crop',
    cover: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=800',
  },
  {
    id: '4',
    name: 'Sculpt & Form',
    type: 'Atelier',
    location: 'Milan, IT',
    employees: '1-10',
    specialties: ['Sculpture', 'Metals'],
    openRoles: 1,
    logo: 'https://images.unsplash.com/photo-1544413647-ad6bcdce312c?w=100&h=100&fit=crop',
    cover: 'https://images.unsplash.com/photo-1518349619113-03114f06ac3a?w=800',
  },
  {
    id: '5',
    name: 'Neon Horizon',
    type: 'VFX House',
    location: 'Seoul, KR',
    employees: '500+',
    specialties: ['CGI', 'Lighting'],
    openRoles: 12,
    logo: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=100&h=100&fit=crop',
    cover: 'https://images.unsplash.com/photo-1614850523296-e8c041de43a2?w=800',
  },
  {
    id: '6',
    name: 'Prism Ink',
    type: 'Print House',
    location: 'Tokyo, JP',
    employees: '50-100',
    specialties: ['Risograph', 'Textiles'],
    openRoles: 0,
    logo: 'https://images.unsplash.com/photo-1534670007418-fbb7f6cf32c3?w=100&h=100&fit=crop',
    cover: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800',
  },
  {
    id: '7',
    name: 'Clay & Co',
    type: 'Ceramics Studio',
    location: 'Portland, OR',
    employees: '1-10',
    specialties: ['Pottery', 'Glazing'],
    openRoles: 2,
    logo: 'https://images.unsplash.com/photo-1520408222757-6f9f95d87d5d?w=100&h=100&fit=crop',
    cover: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800',
  },
  {
    id: '8',
    name: 'Mythos Games',
    type: 'Game Studio',
    location: 'Austin, TX',
    employees: '100-250',
    specialties: ['Environment', 'Characters'],
    openRoles: 5,
    logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop',
    cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
  },
  {
    id: '9',
    name: 'Velvet Lens',
    type: 'Photography',
    location: 'Paris, FR',
    employees: '11-50',
    specialties: ['Fashion', 'Editorial'],
    openRoles: 3,
    logo: 'https://images.unsplash.com/photo-1520390138845-fd2d229dd553?w=100&h=100&fit=crop',
    cover: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800',
  },
  {
    id: '10',
    name: 'The Art Trust',
    type: 'Non-Profit',
    location: 'Geneva, CH',
    employees: '50-100',
    specialties: ['Conservation', 'Grants'],
    openRoles: 1,
    logo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop',
    cover: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800',
  },
  {
    id: '11',
    name: 'Vanguard Media',
    type: 'Ad Agency',
    location: 'Chicago, IL',
    employees: '200-500',
    specialties: ['Copy', 'Visuals'],
    openRoles: 8,
    logo: 'https://images.unsplash.com/photo-1557053910-d9eaba70b584?w=100&h=100&fit=crop',
    cover: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800',
  },
  {
    id: '12',
    name: 'Indigo Loom',
    type: 'Textile Studio',
    location: 'Mumbai, IN',
    employees: '50-200',
    specialties: ['Weaving', 'Dyeing'],
    openRoles: 0,
    logo: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=100&h=100&fit=crop',
    cover: 'https://images.unsplash.com/photo-1528255671579-01b9e11cb3ad?w=800',
  },
  {
    id: '13',
    name: 'Archival Labs',
    type: 'Restoration',
    location: 'Florence, IT',
    employees: '1-10',
    specialties: ['Fresco', 'History'],
    openRoles: 1,
    logo: 'https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?w=100&h=100&fit=crop',
    cover: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800',
  },
  {
    id: '14',
    name: 'Mural Masters',
    type: 'Street Art',
    location: 'Sao Paulo, BR',
    employees: '11-50',
    specialties: ['Graffiti', 'Murals'],
    openRoles: 4,
    logo: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=100&h=100&fit=crop',
    cover: 'https://images.unsplash.com/photo-1561059488-916d69792237?w=800',
  },
  {
    id: '15',
    name: 'Flux Animation',
    type: 'Animation',
    location: 'Vancouver, CA',
    employees: '100-250',
    specialties: ['2D/3D', 'Storyboarding'],
    openRoles: 6,
    logo: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100&h=100&fit=crop',
    cover: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800',
  },
  {
    id: '16',
    name: 'The Foundry',
    type: 'Metal Works',
    location: 'Detroit, MI',
    employees: '11-50',
    specialties: ['Bronze', 'Casting'],
    openRoles: 2,
    logo: 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=100&h=100&fit=crop',
    cover: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800',
  },
  {
    id: '17',
    name: 'Ethereal Audio',
    type: 'Sound Design',
    location: 'Stockholm, SE',
    employees: '11-50',
    specialties: ['Foley', 'Scores'],
    openRoles: 1,
    logo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop',
    cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800',
  },
  {
    id: '18',
    name: 'Lumina Expo',
    type: 'Curatorial',
    location: 'Sydney, AU',
    employees: '50-100',
    specialties: ['Lighting', 'Exhibit'],
    openRoles: 3,
    logo: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=100&h=100&fit=crop',
    cover: 'https://images.unsplash.com/photo-1491243959139-d1f1b40c0aba?w=800',
  },
  {
    id: '19',
    name: 'Paper & Pulp',
    type: 'Design',
    location: 'Copenhagen, DK',
    employees: '1-10',
    specialties: ['Layout', 'Identity'],
    openRoles: 0,
    logo: 'https://images.unsplash.com/photo-1586075010633-247555dfc43b?w=100&h=100&fit=crop',
    cover: 'https://images.unsplash.com/photo-1516962215378-7fa2e1372ca3?w=800',
  },
  {
    id: '20',
    name: 'Zenith Arts',
    type: 'Consultancy',
    location: 'Dubai, UAE',
    employees: '11-50',
    specialties: ['Advisory', 'Strategy'],
    openRoles: 2,
    logo: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=100&h=100&fit=crop',
    cover: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
  },
]

const CompaniesPage = () => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filterType, setFilterType] = useState<string>('All')

  const filteredCompanies = useMemo(() => {
    return MOCK_COMPANIES.filter((company) => {
      const matchesSearch =
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.specialties.some((s) =>
          s.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      const matchesFilter = filterType === 'All' || company.type === filterType
      return matchesSearch && matchesFilter
    })
  }, [searchQuery, filterType])

  const companyTypes = useMemo(
    () => ['All', ...new Set(MOCK_COMPANIES.map((c) => c.type))],
    [],
  )

  if (selectedCompany) {
    return (
      <CompanyDetail
        company={selectedCompany}
        onBack={() => setSelectedCompany(null)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 font-sans text-slate-900 md:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Search & Simple Filters */}
        <div className="mb-10 flex flex-col gap-4">
          <div className="group relative">
            <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500" />
            <input
              type="text"
              placeholder="Search by institution name or specialty..."
              className="w-full rounded-2xl border-0 bg-white py-4 pr-4 pl-12 text-sm font-medium shadow-sm transition-all focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
            />
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto py-1">
            {companyTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`rounded-xl border px-4 py-2 text-xs font-bold whitespace-nowrap transition-all ${
                  filterType === type
                    ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Dense Grid View */}
        {filteredCompanies.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredCompanies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                onClick={() => setSelectedCompany(company)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-24 text-center">
            <Building2 className="mx-auto mb-3 h-10 w-10 text-slate-200" />
            <p className="text-sm font-medium text-slate-400">
              No institutions match your search.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// --- Smaller, Compact Company Card ---

interface CompanyCardProps {
  company: Company
  onClick: () => void
}

function CompanyCard({ company, onClick }: CompanyCardProps) {
  return (
    <div
      onClick={onClick}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:border-indigo-400 hover:shadow-lg"
    >
      <div className="relative h-20 overflow-hidden bg-slate-100">
        <img
          src={company.cover}
          className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
          alt={`${company.name} cover`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent"></div>
      </div>

      <div className="relative flex-grow p-4">
        <div className="relative z-10 -mt-10 mb-2 h-12 w-12 overflow-hidden rounded-xl border-2 border-white bg-white shadow-sm">
          <img
            src={company.logo}
            alt={company.name}
            className="h-full w-full object-cover"
          />
        </div>

        <h3 className="line-clamp-1 text-sm leading-tight font-bold transition-colors group-hover:text-indigo-600">
          {company.name}
        </h3>
        <p className="mt-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          {company.type}
        </p>

        <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
          <MapPin className="h-3 w-3 text-slate-400" />
          {company.location}
        </div>

        <div className="mt-3 flex flex-wrap gap-1">
          {company.specialties.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded border border-slate-100 bg-slate-50 px-1.5 py-0.5 text-[9px] font-bold text-slate-500"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {company.openRoles > 0 ? (
        <div className="flex items-center justify-between border-t border-indigo-100 bg-indigo-50 px-4 py-2">
          <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-700">
            <Briefcase className="h-3 w-3" />
            {company.openRoles} Jobs
          </span>
          <span className="text-[10px] font-black text-indigo-600">VIEW</span>
        </div>
      ) : (
        <div className="flex items-center justify-between border-t border-slate-50 px-4 py-2">
          <span className="text-[10px] font-bold text-slate-300">
            No active roles
          </span>
        </div>
      )}
    </div>
  )
}

// --- Component: Company Detail Page ---

interface CompanyDetailProps {
  company: Company
  onBack: () => void
}

function CompanyDetail({ company, onBack }: CompanyDetailProps) {
  return (
    <div className="animate-in fade-in min-h-screen bg-white duration-300">
      <div className="mx-auto max-w-4xl p-4 md:p-8">
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-xs font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Directory
        </button>

        <div className="relative mb-8 overflow-hidden rounded-3xl border border-slate-200">
          <div className="relative h-64 bg-slate-100 md:h-80">
            <img
              src={company.cover}
              className="h-full w-full object-cover"
              alt={`${company.name} cover`}
            />
          </div>
          <div className="relative z-10 -mt-12 flex flex-col items-start gap-6 p-6 md:-mt-20 md:flex-row md:items-end md:p-10">
            <div className="h-24 w-24 overflow-hidden rounded-3xl border-8 border-white bg-white shadow-xl md:h-32 md:w-32">
              <img
                src={company.logo}
                className="h-full w-full object-cover"
                alt={company.name}
              />
            </div>
            <div className="flex-grow pb-2">
              <div className="mb-1 flex items-center gap-2">
                <span className="rounded bg-indigo-600 px-2 py-0.5 text-[10px] font-black tracking-tighter text-white uppercase">
                  Verified
                </span>
                <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                  {company.type}
                </span>
              </div>
              <h1 className="text-4xl font-black text-slate-900">
                {company.name}
              </h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div className="md:col-span-2">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              Manifesto
            </h2>
            <p className="mb-8 leading-relaxed text-slate-600">
              Based in {company.location}, {company.name} is a cornerstone of
              the art community. We specialize in{' '}
              {company.specialties.join(', ')} and employ a team of{' '}
              {company.employees} dedicated professionals. Our focus remains on
              pushing the boundaries of creativity and technical excellence in{' '}
              {company.type.toLowerCase()} sectors.
            </p>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
              <h3 className="mb-2 font-bold text-slate-900">
                Connect with the Team
              </h3>
              <p className="mb-4 text-sm text-slate-500">
                Request access to internal artist rosters or inquire about
                partnership opportunities.
              </p>
              <button className="w-full rounded-xl bg-slate-900 px-6 py-3 text-xs font-bold tracking-widest text-white uppercase transition-colors hover:bg-indigo-600 sm:w-auto">
                Inquire Now
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 p-6">
              <h3 className="mb-4 text-xs font-bold tracking-widest text-slate-400 uppercase">
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">
                    Location
                  </span>
                  <span className="text-xs font-black text-slate-900">
                    {company.location}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">
                    Scale
                  </span>
                  <span className="text-xs font-black text-slate-900">
                    {company.employees}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">
                    Hiring
                  </span>
                  <span className="text-xs font-black text-indigo-600">
                    {company.openRoles} Roles
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {company.specialties.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-bold text-slate-600"
                >
                  #{s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompaniesPage
