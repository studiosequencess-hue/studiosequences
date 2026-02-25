import React from 'react'
import Image from 'next/image'
import { FileIcon, X } from 'lucide-react'

interface Props {
  url: string
  name: string
  type: string
  onRemove?: () => void
}

const FilePreview: React.FC<Props> = (props) => {
  const isImage = props.type === 'image'
  const isVideo = props.type === 'video'

  if (isImage) {
    return (
      <div className={`group relative size-20`}>
        <Image
          src={props.url}
          alt={props.name}
          fill
          className={`rounded-lg object-cover`}
        />
        {props.onRemove && (
          <button
            onClick={props.onRemove}
            className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white opacity-0 shadow-sm transition group-hover:opacity-100"
          >
            <X size={14} />
          </button>
        )}
      </div>
    )
  }

  if (isVideo) {
    return (
      <div className={`relative`}>
        <video src={props.url} className={`rounded-lg`} controls />
        {props.onRemove && (
          <button
            onClick={props.onRemove}
            className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white"
          >
            <X size={14} />
          </button>
        )}
      </div>
    )
  }

  // Other files
  const extension = props.name.split('.').pop()?.toUpperCase()

  return (
    <div
      className={`flex max-w-sm items-center gap-3 rounded-lg border bg-gray-50 p-3`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
        <FileIcon size={20} className="text-blue-600" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{props.name}</div>
        <div className="text-xs text-gray-500">{extension} File</div>
      </div>
      {props.onRemove && (
        <button
          onClick={props.onRemove}
          className="text-gray-400 hover:text-red-500"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}

export default FilePreview
