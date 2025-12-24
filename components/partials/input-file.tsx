import React, { ComponentProps } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type InputFileProps = ComponentProps<'input'>

interface SingleFileProps {
  multiple?: false
  onFileUpload: (file: File) => void
}

interface MultiFileProps {
  multiple: true
  onFileUpload: (files: File[]) => void
}

type Props = InputFileProps & (SingleFileProps | MultiFileProps)

const InputFile = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
  return (
    <input
      {...props}
      ref={ref}
      type={'file'}
      className={cn(props.className)}
      onChange={(e) => {
        const fileList = e.target.files

        if (!fileList || fileList.length === 0) {
          toast.error('No file selected')
          return
        }

        const files = Array.from(fileList)

        if (props.multiple) {
          props.onFileUpload(files)
        } else {
          const singleFile = files[0] || null
          props.onFileUpload(singleFile)
        }
      }}
    />
  )
})

InputFile.displayName = 'InputFile'

export default InputFile
