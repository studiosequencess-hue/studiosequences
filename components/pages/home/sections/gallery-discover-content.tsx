'use client'

import React from 'react'
import { PLACEHOLDER_IMAGES } from '@/lib/defaults'
import ImagesGridGallery from '@/components/partials/images-grid-gallery'
import { UserImage } from '@/lib/models'
import { useImagePreviewStore } from '@/store'
import Loader from '@/components/partials/loader'

const GalleryDiscoverContent: React.FC = () => {
  const {
    loadingDiscoverImages,
    setLoadingDiscoverImages,
    discoverImages,
    setDiscoverImages,
  } = useImagePreviewStore()

  React.useEffect(() => {
    setLoadingDiscoverImages(true)
    new Promise<UserImage[]>((resolve) =>
      setTimeout(
        () =>
          resolve(
            PLACEHOLDER_IMAGES.map((url) => ({
              url,
            })),
          ),
        2000,
      ),
    )
      .then(setDiscoverImages)
      .finally(() => setLoadingDiscoverImages(false))
  }, [])

  if (loadingDiscoverImages) return <Loader />

  return (
    <ImagesGridGallery
      images={discoverImages}
      rows={8}
      cols={10}
      largeImagesCount={5}
      rowHeight={150}
      gap={{
        x: 2,
        y: 2,
      }}
    />
  )
}

export default GalleryDiscoverContent
