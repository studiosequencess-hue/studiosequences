'use client'

import React from 'react'
import { cn, shuffleArray } from '@/lib/utils'
import SafeImage from '@/components/partials/safe-image'
import { UserImage } from '@/lib/models'
import { useImagePreviewStore } from '@/store'
import Loader from '@/components/partials/loader'

type LayoutItem = {
  i: number
  x: number
  y: number
  w: number
  h: number
  minW: number
  minH: number
}

type Layout = LayoutItem[]

const generateLayout = (
  MAX_ROWS: number,
  MAX_COLS: number,
  LARGE_ITEMS: number,
): { layout: Layout; count: number } => {
  const TOTAL_ITEMS = LARGE_ITEMS + (MAX_COLS * MAX_ROWS - LARGE_ITEMS * 4)
  const layout: Layout = []

  const occupied = Array(MAX_ROWS)
    .fill(0)
    .map(() => Array(MAX_COLS).fill(false))

  let itemCounter = 0

  const markOccupancy = (x: number, y: number, w: number, h: number) => {
    for (let r = y; r < y + h; r++) {
      for (let c = x; c < x + w; c++) {
        if (r < MAX_ROWS && c < MAX_COLS) {
          occupied[r][c] = true
        }
      }
    }
  }

  // Fixed X coordinates to ensure non-overlapping columns: [0, 2, 4, 6, 8]
  const fixedXCoords = [0, 2, 4, 6, 8]

  // Possible Y coordinates (2 rows high, so max start row is 8 - 2 = 6): [0, 1, 2, 3, 4, 5, 6]
  const possibleYCoords = [0, 1, 2, 3, 4, 5, 6]

  // Shuffle Y coordinates to ensure randomness
  shuffleArray(possibleYCoords)

  const selectedYCoords = possibleYCoords.slice(0, LARGE_ITEMS)

  // Combine fixed X with random, unique Y to create 5 guaranteed non-column-overlapping placements
  for (let i = 0; i < LARGE_ITEMS; i++) {
    const x = fixedXCoords[i]
    const y = selectedYCoords[i]

    const item: LayoutItem = {
      i: ++itemCounter,
      x,
      y,
      w: 2,
      h: 2,
      minW: 2,
      minH: 2,
    }
    markOccupancy(x, y, 2, 2)
    layout.push(item)
  }

  const largeItemsPlaced = itemCounter

  // --- Phase 2: Compact Placement of 1x1 items ---
  let smallItemsToPlace = TOTAL_ITEMS - largeItemsPlaced

  // Iterate over every single cell (y then x for perfect top-down, left-to-right filling)
  for (let y = 0; y < MAX_ROWS; y++) {
    for (let x = 0; x < MAX_COLS; x++) {
      if (smallItemsToPlace > 0 && !occupied[y][x]) {
        const item = {
          i: ++itemCounter,
          x,
          y,
          w: 1,
          h: 1,
          minW: 1,
          minH: 1,
        }
        markOccupancy(x, y, 1, 1)
        layout.push(item)
        smallItemsToPlace--
      }
    }
  }

  // Sort the final layout by index 'i' for consistent rendering order (1, 2, 3...)
  layout.sort((a, b) => Number(a.i) - Number(b.i))

  return { layout, count: layout.length }
}

const GridItem = ({
  src,
  index,
  w,
  h,
}: {
  src: string
  index: number
  w: number
  h: number
}) => {
  const isLarge = w === 2 && h === 2

  return (
    <div
      className={`relative cursor-pointer overflow-hidden ${isLarge ? 'col-span-2 row-span-2' : 'col-span-1'} h-full w-full`}
      style={{
        border: '1px solid #1f2937',
        backgroundColor: '#374151',
        height: '100%',
      }}
    >
      <SafeImage
        src={src}
        alt={`grid-item-${index}`}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
    </div>
  )
}

type Props = {
  rows: number
  cols: number
  largeImagesCount: number
  rowHeight: number
  images: UserImage[]
  gap?: {
    x?: number
    y?: number
  }
}

const ImagesGridGallery: React.FC<Props> = (props) => {
  const { showPreview } = useImagePreviewStore()
  const [loading, setLoading] = React.useState(true)
  const [layout, setLayout] = React.useState<Layout | null>(null)

  const totalHeightPx = props.rows * props.rowHeight
  const gapX = props.gap?.x || 0
  const gapY = props.gap?.y || 0

  React.useEffect(() => {
    setLoading(true)
    const { layout: newLayout } = generateLayout(
      props.rows,
      props.cols,
      props.largeImagesCount,
    )

    setLayout(newLayout)
    setLoading(false)
  }, [props.rows, props.cols, props.largeImagesCount])

  return (
    <div className="h-fit">
      <div
        className={cn('mx-auto grid w-full overflow-hidden')}
        style={{
          height: `${totalHeightPx}px`,
          gridTemplateColumns: 'repeat(${props.cols}, minmax(0, 1fr))',
          gridAutoRows: `${props.rowHeight}px`,
          rowGap: `${gapY}px`,
          columnGap: `${gapX}px`,
        }}
      >
        {loading ? (
          <Loader />
        ) : (
          layout?.map((item, itemIndex) => {
            const colStart = item.x + 1
            const colSpan = item.w
            const rowStart = item.y + 1
            const rowSpan = item.h

            const imageItem = props.images[itemIndex % props.images.length]

            return (
              <div
                key={`grid-item-${itemIndex}`}
                style={{
                  gridColumn: `${colStart} / span ${colSpan}`,
                  gridRow: `${rowStart} / span ${rowSpan}`,
                }}
                onClick={() => {
                  showPreview(imageItem)
                }}
              >
                <GridItem
                  src={imageItem.url}
                  index={itemIndex}
                  w={item.w}
                  h={item.h}
                />
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default ImagesGridGallery
