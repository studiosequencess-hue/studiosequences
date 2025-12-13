import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import GalleryDiscoverContent from '@/components/pages/home/gallery-discover-content'
import ImagePreviewDialog from '@/components/pages/home/image-preview-dialog'
import GalleryLatestContent from '@/components/pages/home/gallery-latest-content'

const GridPreview = () => {
  return (
    <div className={'py-8'}>
      <ImagePreviewDialog />

      <Tabs defaultValue="discover">
        <TabsList className={'mx-auto w-fit gap-3'}>
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
          <TabsTrigger value="latest">Latest</TabsTrigger>
        </TabsList>
        <TabsContent value="discover">
          <GalleryDiscoverContent />
        </TabsContent>
        <TabsContent value="following">
          <div className={'flex h-44 w-full items-center justify-center'}>
            Please login to see your following.
          </div>
        </TabsContent>
        <TabsContent value="latest">
          <GalleryLatestContent />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default GridPreview
