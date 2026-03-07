import React from 'react'
import { Button } from '@/components/ui/button'

const HeroSection = () => {
  return (
    <section
      id={'home-hero-section'}
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      <div className="mx-auto max-w-6xl px-6 text-center text-white">
        <h2 className="font-display animate-fade-in mb-6 text-6xl font-bold md:text-8xl">
          Where Creative
          <br />
          <span className="text-accent-terracotta">Professionals</span> Connect
        </h2>
        <p className="animate-slide-up mx-auto mb-8 max-w-3xl text-xl text-gray-200 md:text-2xl">
          Discover exceptional talent, showcase your work, and build meaningful
          connections in the creative industry. From VFX artists to animation
          studios, find your next collaboration.
        </p>
        <div className="animate-slide-up flex flex-col justify-center gap-4 sm:flex-row">
          <Button className="bg-accent-terracotta hover:bg-opacity-90 rounded-lg px-8 py-4 text-lg font-medium text-white transition-all">
            Discover Talent
          </Button>
          <Button className="hover:text-primary-dark rounded-lg border-2 border-white bg-transparent px-8 py-4 text-lg font-medium text-white transition-all hover:bg-white">
            Join Platform
          </Button>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
