import React from 'react'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type ErrorProps = {
  title: string
  description: string
}
const Error: React.FC<ErrorProps> = (props) => {
  return (
    <Empty className={'min-h-screen'}>
      <EmptyHeader>
        <EmptyTitle>{props.title}</EmptyTitle>
        <EmptyDescription>{props.description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link href={'/'}>
          <Button>Home</Button>
        </Link>
      </EmptyContent>
    </Empty>
  )
}

const NotFound = () => {
  return (
    <Error
      title={'404 - Not Found'}
      description={"The page you\'re looking for doesn't exist."}
    />
  )
}

const EmptyPage = {
  NotFound,
  Error,
}

export default EmptyPage
