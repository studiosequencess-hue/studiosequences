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
import { DBUser } from '@/lib/models'
import { toast } from 'sonner'
import debounce from 'debounce'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { UserRole } from '@/lib/constants'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store'

const HeaderSearchbar = () => {
  const { user } = useAuthStore()
  const [searchValue, setSearchValue] = useState('')
  const [results, setResults] = React.useState<DBUser[]>([])
  const [searching, setSearching] = React.useState<boolean>(false)
  const searchInputRef = React.useRef<HTMLInputElement>(null)
  const router = useRouter()

  const searchHandler = async () => {
    if (searching) return
    if (searchValue.length == 0) return
    setSearching(true)

    const usersResponse = await searchAllUsers(searchValue)

    if (usersResponse.status == 'error') {
      toast.error(usersResponse.message)
    } else {
      setResults(usersResponse.data.filter((item) => item.id != user?.id))
    }

    setSearching(false)
  }

  const debouncedSearchHandler = debounce(searchHandler, 500)

  const users = React.useMemo(() => {
    return results.filter((item) => item.role == UserRole.User.toString())
  }, [results])

  const companies = React.useMemo(() => {
    return results.filter((item) => item.role == UserRole.Company.toString())
  }, [results])

  React.useEffect(() => {
    results.forEach((item) => {
      router.prefetch(`/users/${item.id}`)
    })
  }, [results, router])

  return (
    <Popover
      open={results.length > 0}
      onOpenChange={(state) => {
        if (!state) {
          setResults([])
        }
      }}
      modal={true}
    >
      <PopoverTrigger asChild>
        <InputGroup className={'w-96'}>
          <InputGroupInput
            ref={searchInputRef}
            placeholder="Search..."
            onChange={(e) => setSearchValue(e.target.value.trim())}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                debouncedSearchHandler()
              }
            }}
          />
          <InputGroupAddon>
            <IoSearch />
          </InputGroupAddon>
          <InputGroupAddon align={'inline-end'}>
            {searching ? (
              <Spinner />
            ) : (
              <Button
                size={'sm'}
                variant={'secondary'}
                onClick={() => {
                  debouncedSearchHandler()
                }}
              >
                Search
              </Button>
            )}
          </InputGroupAddon>
        </InputGroup>
      </PopoverTrigger>
      <PopoverContent align={'start'} side={'bottom'} className={'w-96 p-1'}>
        <Command>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {users.length > 0 && (
              <CommandGroup heading="Users">
                {users.map((item, itemIndex) => (
                  <CommandItem
                    key={`results-users-${itemIndex}`}
                    onSelect={() => {
                      setResults([])
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
                        {[item.first_name, item.last_name].join(' ').trim() ||
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
                      setResults([])
                      router.push(`/users/${item.id}`)
                      if (searchInputRef.current) {
                        searchInputRef.current.value = ''
                      }
                    }}
                  >
                    <div className={'flex flex-col gap-0.5 text-xs/none'}>
                      <span>
                        {[item.company_name].join(' ').trim() || item.email}
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
