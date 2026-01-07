'use client'

import React, { useState } from 'react'
import { IoSearch } from 'react-icons/io5'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Spinner } from '@/components/ui/spinner'
import { searchOnlyUsers } from '@/lib/actions.user'
import { ProjectMember, UserInfo } from '@/lib/models'
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
import { useAuthStore } from '@/store'
import deepmerge from 'deepmerge'
import { DEFAULT_PROJECT_MEMBER } from '@/lib/defaults'

type Props = {
  memberIds: ProjectMember['user_id'][]
  onSelect: (user: ProjectMember) => void
}

const ProjectFormMembersSearchbar: React.FC<Props> = (props) => {
  const { user } = useAuthStore()
  const [searchValue, setSearchValue] = useState('')
  const [results, setResults] = React.useState<UserInfo[]>([])
  const [searching, setSearching] = React.useState<boolean>(false)
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  const searchHandler = async () => {
    if (searching) return
    if (searchValue.length == 0) return
    setSearching(true)

    const usersResponse = await searchOnlyUsers(searchValue)

    if (usersResponse.status == 'error') {
      toast.error(usersResponse.message)
    } else {
      setResults(
        usersResponse.data.filter(
          (item) => item.id != user?.id && !props.memberIds.includes(item.id),
        ),
      )
    }

    setSearching(false)
  }

  const debouncedSearchHandler = debounce(searchHandler, 500)

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
        <InputGroup className={'mx-4 w-auto'}>
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
      <PopoverContent align={'start'} side={'bottom'} className={'w-88 p-1'}>
        <Command>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {results.length > 0 && (
              <CommandGroup>
                {results.map((item, itemIndex) => (
                  <CommandItem
                    key={`results-${itemIndex}`}
                    onSelect={() => {
                      setResults([])
                      props.onSelect(
                        deepmerge(DEFAULT_PROJECT_MEMBER, {
                          user: item,
                          user_id: item.id,
                        }),
                      )
                    }}
                  >
                    <div
                      className={
                        'flex cursor-pointer flex-col gap-0.5 text-xs/none'
                      }
                    >
                      <span>{item.email}</span>
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

export default ProjectFormMembersSearchbar
