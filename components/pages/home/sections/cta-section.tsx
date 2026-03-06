import React from 'react'
import { Button } from '@/components/ui/button'

const CtaSection = () => {
  return (
    <section id={'home-cta-section'} className="px-6 py-20 text-white">
      <div className="mx-auto max-w-4xl text-center">
        <h3 className="font-display mb-6 text-4xl font-bold md:text-5xl">
          Ready to Showcase Your Work?
        </h3>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-200">
          Join thousands of creative professionals and companies who trust Flare
          for their portfolio and recruitment needs.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button className="bg-accent-terracotta hover:bg-opacity-90 rounded-lg px-8 py-4 text-lg font-medium text-white transition-all">
            Create Your Portfolio
          </Button>
          <Button className="hover:text-primary-dark rounded-lg border-2 border-white bg-transparent px-8 py-4 text-lg font-medium text-white transition-all hover:bg-white">
            Browse Talent
          </Button>
        </div>
      </div>
    </section>
  )
}

export default CtaSection
