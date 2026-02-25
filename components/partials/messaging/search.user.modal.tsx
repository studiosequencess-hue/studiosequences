'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { searchUsers } from '@/lib/actions.messaging'
import { QUERY_KEYS, UserRole } from '@/lib/constants'
import { useDebouncedValue } from '@tanstack/react-pacer'
import { useMutation } from '@tanstack/react-query'
import SearchUserResult from '@/components/partials/messaging/search.user.result'
import { useConversationsStore } from '@/store'
import { UserGeneralInfoSearchResult } from '@/lib/models'

type TabOption = 'user' | 'company' | 'all'

const SearchUsersModal = () => {
  const { newConversationDialogOpen, setNewConversationDialogOpen } =
    useConversationsStore()
  const [query, setQuery] = React.useState('')
  const [activeTab, setActiveTab] = React.useState<TabOption>('all')
  const [results, setResults] = React.useState<UserGeneralInfoSearchResult[]>(
    [],
  )

  const [debouncedQuery] = useDebouncedValue(query, {
    wait: 500,
  })

  const searchMutation = useMutation({
    mutationKey: [QUERY_KEYS.SEARCH_USERS],
    mutationFn: async (queryValue: string) => {
      if (!queryValue) return []

      const res = await searchUsers(
        queryValue,
        activeTab === 'all' ? undefined : (activeTab as UserRole),
      )
      return res.status == 'success' ? res.data : []
    },
    onSuccess: (results) => {
      setResults(results)
    },
  })

  const filteredResults = React.useMemo(() => {
    return results.filter((u) =>
      activeTab == 'all' ? true : u.role == activeTab,
    )
  }, [results, activeTab])

  React.useEffect(() => {
    searchMutation.mutate(debouncedQuery)
  }, [debouncedQuery])

  return (
    <Dialog
      open={newConversationDialogOpen}
      onOpenChange={setNewConversationDialogOpen}
    >
      <DialogContent className="gap-1 sm:max-w-md">
        <DialogHeader className={'mb-4'}>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Search by name, username, or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabOption)}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="user">Users</TabsTrigger>
            <TabsTrigger value="company">Companies</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="max-h-[300px] space-y-2 overflow-y-auto">
          {searchMutation.isPending ? (
            <div className="text-muted-foreground py-4 text-center">
              Searching...
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="text-muted-foreground py-4 text-center">
              {query ? 'No results found' : 'Type to search'}
            </div>
          ) : (
            filteredResults.map((user) => (
              <SearchUserResult
                key={`search-result-${user.id}`}
                user={user}
                onClose={() => setNewConversationDialogOpen(false)}
              />
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SearchUsersModal
