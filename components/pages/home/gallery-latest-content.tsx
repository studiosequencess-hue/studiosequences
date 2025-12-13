import React from 'react'
import { PLACEHOLDER_IMAGES } from '@/lib/defaults'
import ImagesGridGallery from '@/components/partials/images-grid-gallery'

const GalleryLatestContent = async () => {
  const [images] = await Promise.all([
    new Promise<string[]>((resolve) =>
      setTimeout(() => resolve(PLACEHOLDER_IMAGES), 2000),
    ),
  ])

  return (
    <ImagesGridGallery
      images={images}
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

export default GalleryLatestContent
