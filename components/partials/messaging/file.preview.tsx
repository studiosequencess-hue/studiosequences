import React from 'react'
import { FileIcon, X } from 'lucide-react'

interface Props {
  url: string
  name: string
  type: string
  onRemove?: () => void
  compact?: boolean
}

const FilePreview: React.FC<Props> = (props) => {
  const isImage = props.type === 'image'
  const isVideo = props.type === 'video'

  if (isImage) {
    return (
      <div
        className={`group relative ${props.compact ? 'h-20 w-20' : 'max-w-md'}`}
      >
        <img
          src={props.url}
          alt={props.name}
          className={`rounded-lg object-cover ${props.compact ? 'h-full w-full' : 'max-h-60 w-auto'}`}
        />
        {props.onRemove && (
          <button
            onClick={props.onRemove}
            className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition group-hover:opacity-100"
          >
            <X size={14} />
          </button>
        )}
      </div>
    )
  }

  if (isVideo) {
    return (
      <div className={`relative ${props.compact ? 'h-20 w-20' : 'max-w-md'}`}>
        <video
          src={props.url}
          className={`rounded-lg ${props.compact ? 'h-full w-full object-cover' : 'max-h-60 w-auto'}`}
          controls={!props.compact}
        />
        {props.compact && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/30">
            <span className="text-xs text-white">VIDEO</span>
          </div>
        )}
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
      className={`bg-muted flex items-center gap-3 rounded-lg p-3 ${props.compact ? 'w-40' : 'max-w-md'}`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
        <FileIcon size={20} className="text-blue-600" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{props.name}</div>
        <div className="text-muted-foreground text-xs">{extension} File</div>
      </div>
      {props.onRemove && (
        <button
          onClick={props.onRemove}
          className="text-muted-foreground hover:text-red-500"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}

export default FilePreview
