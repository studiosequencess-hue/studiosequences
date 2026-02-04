import React from 'react'

type Props = {
  children: React.ReactNode
}

const LeftSidebarBlock: React.FC<Props> = (props) => {
  return (
    <div
      className={
        'bg-foreground text-background h-fit max-h-64 min-h-16 w-full overflow-hidden rounded-md'
      }
    >
      {props.children}
    </div>
  )
}

export default LeftSidebarBlock
