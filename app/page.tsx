import HeroSection from '@/components/pages/home/hero-section'
import CtaSection from '@/components/pages/home/cta-section'
import StatsSection from '@/components/pages/home/stats-section'
import Features from '@/components/pages/home/features'
import ExampleCreativeWorks from '@/components/pages/home/example-creative-works'

export default function Home() {
  return (
    <div className={'flex flex-col'}>
      <HeroSection />
      <ExampleCreativeWorks />
      <Features />
      <StatsSection />
      <CtaSection />
    </div>
  )
}
