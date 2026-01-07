'use client'

import React from 'react'
import { ProjectMember } from '@/lib/models'
import Loader from '@/components/partials/loader'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { LuUser } from 'react-icons/lu'
import { FaMinus, FaPlus } from 'react-icons/fa6'
import ProjectFormMembersSearchbar from '@/components/partials/projects/project.form.members.searchbar'

type Props = {
  members: ProjectMember[]
  setMembers: (members: ProjectMember[]) => void
  activeMemberIndex: number
  setActiveMemberIndex: (index: number) => void
  membersLoading: boolean
}

const ProjectFormMembers: React.FC<Props> = ({
  members,
  setMembers,
  activeMemberIndex,
  setActiveMemberIndex,
  membersLoading,
}) => {
  return (
    <div className={'flex w-full flex-col gap-2'}>
      <ProjectFormMembersSearchbar
        memberIds={members.map((item) => item.user_id)}
        onSelect={(member) => setMembers([...members, member])}
      />
      {membersLoading ? (
        <Loader />
      ) : members.length === 0 ? (
        <Empty className="mx-4 border border-dashed">
          <EmptyHeader>
            <EmptyTitle>No Members</EmptyTitle>
            <EmptyDescription>Add members to your project</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className={'flex flex-col gap-2 px-4'}>
          <div className={'flex items-center justify-between gap-4'}>
            <span>Files</span>
            <Button
              variant={'secondary'}
              size={'icon-sm'}
              className={'h-fit w-fit rounded-sm p-1'}
            >
              <FaPlus />
            </Button>
          </div>
          <ScrollArea
            className={cn(
              'border-foreground w-full rounded-sm border',
              'h-[calc(100vh-500px)]',
            )}
          >
            <div className={'flex flex-col'}>
              {members.map((member, memberIndex) => (
                <div
                  id={`member-${memberIndex}`}
                  key={`member-${memberIndex}`}
                  className={cn(
                    'hover:bg-foreground/10 flex cursor-pointer items-start gap-4 p-2 pr-4',
                    activeMemberIndex == memberIndex && 'bg-foreground/10',
                  )}
                  onClick={() => setActiveMemberIndex(memberIndex)}
                >
                  <div className={'flex grow items-start gap-2'}>
                    <div className={'py-1'}>
                      <LuUser size={20} />
                    </div>

                    <div className={'flex w-64 flex-col gap-2 text-xs/none'}>
                      <span className={'text-muted-foreground truncate'}>
                        {[member.user?.first_name, member.user?.last_name]
                          .join(' ')
                          .toLowerCase()
                          .trim() || 'No name'}
                      </span>
                      <span className={'truncate'}>
                        {member.user?.occupation || 'No occupation'}
                      </span>
                      <span className={'truncate'}>
                        {member.department || 'No department'}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant={'destructive'}
                    size={'icon-sm'}
                    className={'h-fit w-fit rounded-sm p-1'}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setMembers(members.filter((_, i) => i != memberIndex))
                    }}
                  >
                    <FaMinus />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}

export default ProjectFormMembers
