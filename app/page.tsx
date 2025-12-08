import HeroSection from '@/components/pages/home/hero-section'
import CtaSection from '@/components/pages/home/cta-section'
import StatsSection from '@/components/pages/home/stats-section'
import Features from '@/components/pages/home/features'
import ExampleCreativeWorks from '@/components/pages/home/example-creative-works'
import EventsSlider from '@/components/pages/home/events.slider'

export default function Home() {
  return (
    <div className={'flex min-h-screen flex-col pt-16'}>
      <EventsSlider />
      {/*<HeroSection />*/}
      {/*<ExampleCreativeWorks />*/}
      {/*<Features />*/}
      {/*<StatsSection />*/}
      {/*<CtaSection />*/}
    </div>
  )
}
