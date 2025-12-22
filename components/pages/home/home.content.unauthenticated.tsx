import React from 'react'
import EventsSlider from '@/components/pages/home/partials/events.slider'
import GridPreview from '@/components/pages/home/partials/grid-preview'

const HomeContentUnauthenticated = () => {
  return (
    <div className={'flex min-h-screen flex-col pt-4'}>
      <EventsSlider />
      <GridPreview />
    </div>
  )
}

export default HomeContentUnauthenticated
