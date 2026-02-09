import { HeroSection } from '@/components/sections/HeroSection'
import { ProblemSection } from '@/components/sections/ProblemSection'
import { SolutionSection } from '@/components/sections/SolutionSection'
import { StatsSection } from '@/components/sections/StatsSection'
import { HowItWorksSection } from '@/components/sections/HowItWorksSection'
import { CasesSection } from '@/components/sections/CasesSection'
import { NichesSection } from '@/components/sections/NichesSection'
import { ComparisonSection } from '@/components/sections/ComparisonSection'
import { CTASection } from '@/components/sections/CTASection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <StatsSection />
      <HowItWorksSection />
      <CasesSection />
      <NichesSection />
      <ComparisonSection />
      <CTASection />
    </>
  )
}
