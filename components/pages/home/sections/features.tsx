import React from 'react'
import { cn } from '@/lib/utils'

type Feature = {
  icon: React.ReactNode
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: (
      <svg
        className="h-8 w-8 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        ></path>
      </svg>
    ),
    title: 'Portfolio Showcase',
    description:
      'Beautiful, customizable portfolios that highlight your best work with professional presentation.',
  },
  {
    icon: (
      <svg
        className="h-8 w-8 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        ></path>
      </svg>
    ),
    title: 'Advanced Search',
    description:
      'Find the perfect talent or opportunities with location-based search and detailed filtering.',
  },
  {
    icon: (
      <svg
        className="h-8 w-8 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        ></path>
      </svg>
    ),
    title: 'Professional Network',
    description:
      'Connect with peers, mentors, and industry leaders in the creative community.',
  },
  {
    icon: (
      <svg
        className="h-8 w-8 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        ></path>
      </svg>
    ),
    title: 'Job Opportunities',
    description:
      'Find freelance, contract, and full-time opportunities tailored to your skills.',
  },
  {
    icon: (
      <svg
        className="h-8 w-8 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        ></path>
      </svg>
    ),
    title: 'Analytics & Insights',
    description:
      'Track your portfolio performance and gain insights into industry trends.',
  },
  {
    icon: (
      <svg
        className="h-8 w-8 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        ></path>
      </svg>
    ),
    title: 'Privacy & Security',
    description:
      'Control your content visibility and protect your intellectual property.',
  },
]

const Features = () => {
  return (
    <section className="bg-pattern px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h3 className="font-display mb-4 text-4xl font-bold">
            Why Choose Studio Sequence?
          </h3>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            Professional tools designed specifically for creative industries
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature: Feature, index: number) => (
            <FeatureCard
              key={`feature-${index}`}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

type FeatureCardProps = {
  icon: React.ReactNode
  title: string
  description: string
  iconClassName?: string
  titleClassName?: string
  descriptionClassName?: string
}
const FeatureCard: React.FC<FeatureCardProps> = (props) => {
  return (
    <div className="rounded-2xl bg-white/95 p-8 text-center shadow-lg backdrop-blur-[10px] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div
        className={cn(
          'bg-primary-dark mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full',
          props.iconClassName,
        )}
      >
        {props.icon}
      </div>
      <h4
        className={cn(
          'font-display mb-3 text-xl font-bold',
          props.titleClassName,
        )}
      >
        {props.title}
      </h4>
      <p className={cn('text-gray-600', props.descriptionClassName)}>
        {props.description}
      </p>
    </div>
  )
}

export default Features
