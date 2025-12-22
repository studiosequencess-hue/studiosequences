import React from 'react'
import SafeImage from '@/components/partials/safe-image'

const ExampleCreativeWorks = () => {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h3 className="font-display mb-4 text-4xl font-bold">
            Featured Creative Work
          </h3>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            Explore exceptional work from talented professionals and studios
            worldwide
          </p>
        </div>

        <div className="masonry-grid">
          <div className="masonry-item portfolio-card overflow-hidden rounded-xl shadow-lg">
            <div className="relative">
              <div className={'relative h-64 w-full'}>
                <SafeImage
                  src="/images/project-1.jpg"
                  alt="Alex Chen's VFX Work"
                  className={'h-64 w-full'}
                />
              </div>
              <div className="absolute top-4 left-4">
                <span className="verified-badge">Verified</span>
              </div>
              <div className="absolute right-4 bottom-4 left-4">
                <div className="bg-opacity-70 rounded-lg bg-black p-3 text-white">
                  <h4 className="mb-1 font-semibold">Cyberpunk City VFX</h4>
                  <p className="text-sm opacity-90">
                    Environmental Effects • Maya, Houdini
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="mb-3 flex items-center">
                <SafeImage
                  src="/images/avatar-1.jpg"
                  alt="Alex Chen"
                  className="mr-3 h-10 w-10 rounded-full"
                />
                <div>
                  <h5 className="font-semibold">Alex Chen</h5>
                  <p className="text-sm text-gray-600">Senior VFX Artist</p>
                </div>
              </div>
              <p className="mb-3 text-sm text-gray-700">
                Dynamic cityscape with advanced particle systems and atmospheric
                effects for feature film.
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Available for projects</span>
                <span>Vancouver, BC</span>
              </div>
            </div>
          </div>

          <div className="masonry-item portfolio-card overflow-hidden rounded-xl shadow-lg">
            <div className="relative">
              <SafeImage
                src="/images/project-2.jpg"
                alt="Maria Santos Character Design"
                className="h-80 w-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="verified-badge">Verified</span>
              </div>
              <div className="absolute right-4 bottom-4 left-4">
                <div className="bg-opacity-70 rounded-lg bg-black p-3 text-white">
                  <h4 className="mb-1 font-semibold">
                    Fantasy Character Concepts
                  </h4>
                  <p className="text-sm opacity-90">
                    Character Design • Photoshop, ZBrush
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="mb-3 flex items-center">
                <SafeImage
                  src="/images/avatar-2.jpg"
                  alt="Maria Santos"
                  className="mr-3 h-10 w-10 rounded-full"
                />
                <div>
                  <h5 className="font-semibold">Maria Santos</h5>
                  <p className="text-sm text-gray-600">Character Designer</p>
                </div>
              </div>
              <p className="mb-3 text-sm text-gray-700">
                Original character designs with expressive features and
                compelling storytelling elements.
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Available soon</span>
                <span>Los Angeles, CA</span>
              </div>
            </div>
          </div>

          <div className="masonry-item portfolio-card overflow-hidden rounded-xl shadow-lg">
            <div className="relative">
              <SafeImage
                src="/images/project-3.jpg"
                alt="David Kim Motion Graphics"
                className="h-56 w-full object-cover"
              />
              <div className="absolute right-4 bottom-4 left-4">
                <div className="bg-opacity-70 rounded-lg bg-black p-3 text-white">
                  <h4 className="mb-1 font-semibold">
                    Abstract Motion Graphics
                  </h4>
                  <p className="text-sm opacity-90">
                    Motion Design • After Effects, C4D
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="mb-3 flex items-center">
                <SafeImage
                  src="/images/avatar-3.jpg"
                  alt="David Kim"
                  className="mr-3 h-10 w-10 rounded-full"
                />
                <div>
                  <h5 className="font-semibold">David Kim</h5>
                  <p className="text-sm text-gray-600">Motion Designer</p>
                </div>
              </div>
              <p className="mb-3 text-sm text-gray-700">
                Dynamic visual effects and typography for commercial projects
                and broadcast design.
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Available for projects</span>
                <span>New York, NY</span>
              </div>
            </div>
          </div>

          <div className="masonry-item portfolio-card overflow-hidden rounded-xl shadow-lg">
            <div className="relative">
              <SafeImage
                src="/images/hero-company.jpg"
                alt="Sun Creature Studio Work"
                className="h-48 w-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <SafeImage
                  src="/images/company-logo-1.png"
                  alt="Sun Creature"
                  className="h-12 w-12 rounded-lg bg-white p-2"
                />
              </div>
              <div className="absolute top-4 right-4">
                <span className="verified-badge">Verified</span>
              </div>
              <div className="absolute right-4 bottom-4 left-4">
                <div className="bg-opacity-70 rounded-lg bg-black p-3 text-white">
                  <h4 className="mb-1 font-semibold">What If...? Season 3</h4>
                  <p className="text-sm opacity-90">
                    TV Series • 2D FX Animation
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h5 className="mb-2 text-lg font-semibold">
                Sun Creature Studio
              </h5>
              <p className="mb-3 text-sm text-gray-600">
                Animation Studio • Copenhagen, Denmark
              </p>
              <p className="mb-3 text-sm text-gray-700">
                2D FX animation for Marvel Studios&apos; animated series
                featuring alternate realities and dynamic action sequences.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">50+ employees</span>
                <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
                  Hiring
                </span>
              </div>
            </div>
          </div>

          <div className="masonry-item portfolio-card overflow-hidden rounded-xl shadow-lg">
            <div className="relative">
              <SafeImage
                src="/images/project-1.jpg"
                alt="Sarah Johnson 3D Work"
                className="h-72 w-full object-cover"
              />
              <div className="bg-opacity-90 absolute top-4 right-4 rounded-full bg-white p-2">
                <svg
                  className="h-4 w-4 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <div className="absolute right-4 bottom-4 left-4">
                <div className="bg-opacity-70 rounded-lg bg-black p-3 text-white">
                  <h4 className="mb-1 font-semibold">3D Environment Design</h4>
                  <p className="text-sm opacity-90">
                    Environment Art • Blender, Substance
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="mb-3 flex items-center">
                <SafeImage
                  src="/images/avatar-1.jpg"
                  alt="Sarah Johnson"
                  className="mr-3 h-10 w-10 rounded-full"
                />
                <div>
                  <h5 className="font-semibold">Sarah Johnson</h5>
                  <p className="text-sm text-gray-600">3D Artist</p>
                </div>
              </div>
              <p className="mb-3 text-sm text-gray-700">
                Immersive 3D environments and characters for games and virtual
                production pipelines.
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Available for projects</span>
                <span>Toronto, ON</span>
              </div>
            </div>
          </div>

          <div className="masonry-item portfolio-card overflow-hidden rounded-xl shadow-lg">
            <div className="relative">
              <SafeImage
                src="/images/project-2.jpg"
                alt="Elena Rodriguez Storyboards"
                className="h-64 w-full object-cover"
              />
              <div className="absolute right-4 bottom-4 left-4">
                <div className="bg-opacity-70 rounded-lg bg-black p-3 text-white">
                  <h4 className="mb-1 font-semibold">Storyboard Sequences</h4>
                  <p className="text-sm opacity-90">
                    Storyboarding • Storyboard Pro
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="mb-3 flex items-center">
                <SafeImage
                  src="/images/avatar-2.jpg"
                  alt="Elena Rodriguez"
                  className="mr-3 h-10 w-10 rounded-full"
                />
                <div>
                  <h5 className="font-semibold">Elena Rodriguez</h5>
                  <p className="text-sm text-gray-600">Storyboard Artist</p>
                </div>
              </div>
              <p className="mb-3 text-sm text-gray-700">
                Visual storytelling through dynamic storyboards and concept art
                for film and animation.
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Available soon</span>
                <span>Montreal, QC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ExampleCreativeWorks
