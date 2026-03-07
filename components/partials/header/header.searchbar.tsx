'use client'

import React, { useState } from 'react'
import { IoSearch } from 'react-icons/io5'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Spinner } from '@/components/ui/spinner'
import { searchAllUsers } from '@/lib/actions.user'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { UserRole } from '@/lib/constants'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useDebouncedValue } from '@tanstack/react-pacer'
import { cn } from '@/lib/utils'

const HeaderSearchbar = () => {
  const [searchValue, setSearchValue] = useState('')
  const searchInputRef = React.useRef<HTMLInputElement>(null)
  const router = useRouter()

  const [debouncedSearchValue] = useDebouncedValue(searchValue, {
    wait: 500,
  })

  const searchQuery = useQuery({
    queryKey: ['search-users', debouncedSearchValue],
    queryFn: async () => {
      if (!debouncedSearchValue) return []

      const response = await searchAllUsers(debouncedSearchValue)

      return response.status == 'success' ? response.data : []
    },
    placeholderData: (previousData) => previousData,
  })

  const users = React.useMemo(() => {
    return (searchQuery.data || []).filter(
      (item) => item.role == UserRole.User.toString(),
    )
  }, [searchQuery.data])

  const companies = React.useMemo(() => {
    return (searchQuery.data || []).filter(
      (item) => item.role == UserRole.Company.toString(),
    )
  }, [searchQuery.data])

  React.useEffect(() => {
    ;(searchQuery.data || []).forEach((item) => {
      router.prefetch(`/users/${item.id}`)
    })
  }, [searchQuery.data, router])

  return (
    <Popover open={(searchQuery.data || []).length > 0}>
      <PopoverTrigger asChild>
        <InputGroup className={'w-96'}>
          <InputGroupInput
            ref={searchInputRef}
            placeholder="Search..."
            onChange={(e) => setSearchValue(e.target.value.trim())}
          />
          <InputGroupAddon>
            <IoSearch />
          </InputGroupAddon>
          <InputGroupAddon align={'inline-end'}>
            <Spinner
              className={cn(
                searchQuery.isFetching ? 'opacity-100' : 'opacity-0',
              )}
            />
          </InputGroupAddon>
        </InputGroup>
      </PopoverTrigger>
      <PopoverContent
        align={'start'}
        side={'bottom'}
        className={'w-96 p-1'}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {users.length > 0 && (
              <CommandGroup heading="Users">
                {users.map((item, itemIndex) => (
                  <CommandItem
                    key={`results-users-${itemIndex}`}
                    onSelect={() => {
                      router.push(`/users/${item.id}`)
                      if (searchInputRef.current) {
                        searchInputRef.current.value = ''
                      }
                    }}
                  >
                    <div
                      className={
                        'flex cursor-pointer flex-col gap-0.5 text-xs/none'
                      }
                    >
                      <span>
                        {[item.firstName, item.lastName].join(' ').trim() ||
                          item.email}
                      </span>
                      {item.username && (
                        <span className={'text-muted-foreground'}>
                          @{item.username}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {companies.length > 0 && (
              <CommandGroup heading="Companies">
                {companies.map((item, itemIndex) => (
                  <CommandItem
                    key={`results-companies-${itemIndex}`}
                    onSelect={() => {
                      router.push(`/users/${item.id}`)
                      if (searchInputRef.current) {
                        searchInputRef.current.value = ''
                      }
                    }}
                  >
                    <div className={'flex flex-col gap-0.5 text-xs/none'}>
                      <span>
                        {[item.lastName].join(' ').trim() || item.email}
                      </span>
                      {item.username && (
                        <span className={'text-muted-foreground'}>
                          @{item.username}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default HeaderSearchbar
