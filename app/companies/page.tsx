'use client'

import React from 'react'
import Image from 'next/image'
import { Search, MapPin, Building2 } from 'lucide-react'
import { UserInfo } from '@/lib/models'
import { getOnlyCompanies } from '@/lib/actions.user'
import { toast } from 'sonner'
import Loader from '@/components/partials/loader'
import Placeholder from '@/public/images/placeholder.svg'
import Link from 'next/link'

const CompaniesPage = () => {
  const [companies, setCompanies] = React.useState<UserInfo[]>([])
  const [companiesLoading, setCompaniesLoading] = React.useState<boolean>(true)
  const [searchQuery, setSearchQuery] = React.useState<string>('')
  const [occupationType, setOccupationType] = React.useState<string>('All')

  const filteredCompanies = React.useMemo(() => {
    return companies.filter((company) => {
      const matchesSearch = company.company_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
      const matchesFilter =
        occupationType === 'All' || company.occupation === occupationType
      return matchesSearch && matchesFilter
    })
  }, [companies, searchQuery, occupationType])

  const companyTypes = React.useMemo(
    () => [
      'All',
      ...new Set(companies.map((c) => c.occupation || '').filter((o) => !!o)),
    ],
    [companies],
  )

  const loadCompanies = async () => {
    const companiesResponse = await getOnlyCompanies()

    if (companiesResponse.status == 'error') {
      toast.error(companiesResponse.message)
    } else {
      setCompanies(companiesResponse.data)
    }
  }

  React.useEffect(() => {
    setCompanies([])
    setCompaniesLoading(true)
    loadCompanies().finally(() => setCompaniesLoading(false))
  }, [])

  if (companiesLoading) {
    return <Loader wrapperClassName={'h-screen'} />
  }

  return (
    <div className="bg-background text-foreground min-h-screen p-4 font-sans md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4">
          <div className="group relative">
            <Search className="text-background absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by company name..."
              className="bg-foreground text-background w-full rounded-2xl border-0 py-4 pr-4 pl-12 text-sm/none font-medium shadow-sm transition-all"
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
                onClick={() => setOccupationType(type)}
                className={`rounded-xl border px-4 py-2 text-xs font-bold whitespace-nowrap transition-all ${
                  occupationType === type
                    ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {filteredCompanies.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} />
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

interface CompanyCardProps {
  company: UserInfo
}

function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link
      href={`/users/${company.id}`}
      className="group bg-foreground flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200"
    >
      <div className="relative aspect-square h-20 overflow-hidden bg-slate-100">
        {(company.background_top || company.background_bottom) && (
          <Image
            src={company.background_top || company.background_bottom || ''}
            fill
            className="object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
            alt={`${company.company_name} cover`}
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-white/10 to-transparent"></div>
      </div>

      <div className="relative grow p-4">
        <div className="relative z-10 -mt-10 mb-2 h-12 w-12 overflow-hidden rounded-xl border-2 border-white bg-white shadow-sm">
          <Image
            src={company.avatar || Placeholder}
            alt={company.company_name || `company-${company.id}-avatar`}
            fill
            className="h-full w-full object-cover"
          />
        </div>

        <h3 className="line-clamp-1 text-sm leading-tight font-bold">
          {company.company_name || 'No name'}
        </h3>
        <p className="mt-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          {company.occupation || 'No occupation'}
        </p>

        <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
          <MapPin className="h-3 w-3 text-slate-400" />
          {company.location || 'No location'}
        </div>
      </div>
    </Link>
  )
}

export default CompaniesPage
