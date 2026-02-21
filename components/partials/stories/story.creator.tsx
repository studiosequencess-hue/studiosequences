'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Image as ImageIcon, Loader2, X } from 'lucide-react'
import ReactPlayer from 'react-player'

type Props = {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

const StoryCreator: React.FC<Props> = ({ open, onClose, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', file.type.startsWith('video') ? 'video' : 'image')

    try {
      const res = await fetch('/api/stories/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        onSuccess()
        onClose()
        setFile(null)
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Story</DialogTitle>
        </DialogHeader>

        {!file ? (
          <div
            className="hover:bg-muted/10 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition"
            onClick={() => inputRef.current?.click()}
          >
            <ImageIcon className="text-muted-foreground mb-4 h-12 w-12" />
            <p className="text-muted-foreground text-sm">
              Click to upload photo or video
            </p>
            <input
              ref={inputRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        ) : (
          <div className="relative">
            {file.type.startsWith('video/') ? (
              <ReactPlayer
                src={URL.createObjectURL(file)}
                controls
                className={'mx-auto h-64 w-full'}
              />
            ) : (
              <Image
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="h-64 w-full rounded-lg object-cover"
              />
            )}
            <button
              onClick={() => {
                setFile(null)
              }}
              className="absolute top-2 right-2 rounded-full bg-black/50 p-1 text-white"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={uploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file || uploading}>
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Share Story'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default StoryCreator
