import dynamic from 'next/dynamic'
import { HeroSection } from '@/components/sections/HeroSection'
import { ProblemSection } from '@/components/sections/ProblemSection'
import { SolutionSection } from '@/components/sections/SolutionSection'
import { StatsSection } from '@/components/sections/StatsSection'

// Lazy load below-the-fold sections
const VideoExamplesSection = dynamic(() => import('@/components/sections/VideoExamplesSection').then(m => ({ default: m.VideoExamplesSection })), { ssr: true })
const HowItWorksSection = dynamic(() => import('@/components/sections/HowItWorksSection').then(m => ({ default: m.HowItWorksSection })), { ssr: true })
const CasesSection = dynamic(() => import('@/components/sections/CasesSection').then(m => ({ default: m.CasesSection })), { ssr: true })
const NichesSection = dynamic(() => import('@/components/sections/NichesSection').then(m => ({ default: m.NichesSection })), { ssr: true })
const ComparisonSection = dynamic(() => import('@/components/sections/ComparisonSection').then(m => ({ default: m.ComparisonSection })), { ssr: true })
const CTASection = dynamic(() => import('@/components/sections/CTASection').then(m => ({ default: m.CTASection })), { ssr: true })

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <StatsSection />
      <VideoExamplesSection />
      <HowItWorksSection />
      <CasesSection />
      <NichesSection />
      <ComparisonSection />
      <CTASection />
    </>
  )
}
