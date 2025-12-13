import React from 'react'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

type Props = {
  wrapperClassName?: string
  spinnerClassName?: string
}

const Loader: React.FC<Props> = (props) => {
  return (
    <div
      className={cn(
        'flex h-44 w-full items-center justify-center',
        props.spinnerClassName,
      )}
    >
      <Spinner className={cn(props.spinnerClassName)} />
    </div>
  )
}

export default Loader
