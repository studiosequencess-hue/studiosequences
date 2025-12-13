'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { useImagePreviewStore } from '@/store'
import SafeImage from '@/components/partials/safe-image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { BsThreeDots } from 'react-icons/bs'
import { IoIosLink } from 'react-icons/io'
import { format } from 'date-fns'
import { FaBookmark, FaComment, FaHeart } from 'react-icons/fa6'
import { BiRepost } from 'react-icons/bi'
import HoverComponent from '@/components/partials/hover-card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'

const ImagePreviewDialog = () => {
  const { open, image, closePreview } = useImagePreviewStore()

  const date = new Date(2022, 7, 8, 7, 12)

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) {
          closePreview()
        }
      }}
    >
      <DialogContent
        className={
          'flex h-full w-full max-w-full! gap-0 rounded-none border-none bg-transparent p-0'
        }
        showCloseButton={false}
      >
        <div
          className={
            'flex flex-1 items-center justify-center p-4 backdrop-blur-xs'
          }
          onClick={closePreview}
        >
          <div className={'relative h-96 w-96'}>
            {image && (
              <SafeImage
                src={image.url}
                alt={''}
                fill
                className={'h-full w-full object-contain'}
              />
            )}
          </div>
        </div>
        <div
          className={
            'bg-background text-foreground flex w-96 flex-col gap-3 p-4'
          }
        >
          {/*Avatar & Dropdown menu*/}
          <div className={'flex items-start gap-4'}>
            <div className={'flex flex-1 items-center gap-2'}>
              <Avatar
                className={
                  'border-foreground hover:border-accent-blue h-14 w-14 cursor-pointer border'
                }
              >
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <div className={'flex w-full flex-col gap-1'}>
                <DialogTitle className={'line-clamp-1 text-sm/none break-all'}>
                  Username
                </DialogTitle>
                <DialogDescription
                  className={
                    'hover:text-muted-foreground/80 line-clamp-1 cursor-pointer text-sm/none break-all'
                  }
                >
                  @username
                </DialogDescription>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <BsThreeDots />
              </DropdownMenuTrigger>
              <DropdownMenuContent side={'bottom'} align={'end'}>
                <DropdownMenuItem>
                  <IoIosLink /> Copy Link
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/*Description & Tags*/}
          <div className={'flex flex-col gap-1 text-sm/5'}>
            <div className={'line-clamp-6 wrap-break-word'}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias
              earum expedita natus quis quisquam sit suscipit tempore. Ab
              commodi deleniti fuga quidem totam? Aliquam animi aperiam,
              assumenda commodi cum debitis dicta dolores eaque et ex impedit in
              labore mollitia necessitatibus officia quae qui recusandae
              suscipit ullam, vel! Doloremque, libero qui.
            </div>
            <div className={'flex flex-wrap gap-2'}>
              {['#tag1', '#tag2', '#tag3', '#tag4', '#tag5', '#tag6'].map(
                (tag, tagIndex) => (
                  <div
                    key={`tag-${tagIndex}`}
                    className={
                      'text-accent-blue hover:text-accent-blue/80 cursor-pointer'
                    }
                  >
                    {tag}
                  </div>
                ),
              )}
            </div>
          </div>
          {/*Date & Time*/}
          <div className={'mt-4 flex items-center gap-2 text-sm/none'}>
            <span>{format(date, 'HH:mm b')}</span>
            <div className={'bg-muted-foreground h-1 w-1 rounded-full'} />
            <span>{format(date, 'MMM dd, yyyy')}</span>
          </div>
          {/*Likes*/}
          <div className={'border-foreground border-y py-4 text-sm/none'}>
            13 likes
          </div>
          {/*Buttons*/}
          <div className={'grid grid-cols-5 gap-2'}>
            <HoverComponent
              trigger={<FaComment size={18} />}
              content={'Comment'}
            />
            <HoverComponent
              trigger={<BiRepost size={20} />}
              content={'Repost'}
            />
            <HoverComponent trigger={<FaHeart size={18} />} content={'Like'} />
            <HoverComponent
              trigger={<FaBookmark size={18} />}
              content={'Bookmark'}
            />
            <HoverComponent
              trigger={<IoIosLink size={18} />}
              content={'Copy Link'}
            />
          </div>
          {/*Comments*/}
          <ScrollArea className={'mt-4 w-full flex-1'}>
            <div
              className={'flex h-64 flex-col items-center justify-center gap-3'}
            >
              <h1 className={'text-base/none'}>Nothing yet here</h1>
              <p className={'text-muted-foreground text-xs/none'}>
                Make your own comment
              </p>
              <Button size={'sm'} variant={'default'} className={'mt-2'}>
                Comment
              </Button>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ImagePreviewDialog
