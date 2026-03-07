import React from 'react'

const StatsSection = () => {
  return (
    <section id={'home-stats-section'} className="px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 text-center md:grid-cols-4">
          <div>
            <div className="mb-2 text-4xl font-bold">10,000+</div>
            <div className="text-lg">Creative Professionals</div>
          </div>
          <div>
            <div className="mb-2 text-4xl font-bold">2,500+</div>
            <div className="text-lg">Companies & Studios</div>
          </div>
          <div>
            <div className="mb-2 text-4xl font-bold">50,000+</div>
            <div className="text-lg">Portfolio Projects</div>
          </div>
          <div>
            <div className="mb-2 text-4xl font-bold">15,000+</div>
            <div className="text-lg">Job Opportunities</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StatsSection
