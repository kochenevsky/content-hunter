import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { getHomePage } from '@/lib/payload-data'
// import { getCases } from '@/lib/payload-data'
import { HeroSection } from '@/components/sections/HeroSection'
import { ProblemSection } from '@/components/sections/ProblemSection'
import { SolutionSection } from '@/components/sections/SolutionSection'
import { StatsSection } from '@/components/sections/StatsSection'

// Инвалидация по revalidatePath после сохранения в админке; 30 сек — запасной вариант
export const revalidate = 30

// Lazy load below-the-fold sections
const VideoExamplesSection = dynamic(() => import('@/components/sections/VideoExamplesSection').then(m => ({ default: m.VideoExamplesSection })), { ssr: true })
// const HowItWorksSection = dynamic(() => import('@/components/sections/HowItWorksSection').then(m => ({ default: m.HowItWorksSection })), { ssr: true })
// const CasesSection = dynamic(() => import('@/components/sections/CasesSection').then(m => ({ default: m.CasesSection })), { ssr: true })
const NichesSection = dynamic(() => import('@/components/sections/NichesSection').then(m => ({ default: m.NichesSection })), { ssr: true })
const ComparisonSection = dynamic(() => import('@/components/sections/ComparisonSection').then(m => ({ default: m.ComparisonSection })), { ssr: true })
const CTASection = dynamic(() => import('@/components/sections/CTASection').then(m => ({ default: m.CTASection })), { ssr: true })

export async function generateMetadata(): Promise<Metadata> {
  const home = await getHomePage()
  const meta = home?.meta
  const title = meta?.title ?? 'Content Hunter — Контент-завод под ключ'
  const description = meta?.description ?? 'Разворачиваем инфраструктуру по созданию и массовой дистрибуции контента. Гарантия охватов в договоре.'
  const image = meta?.ogImage && typeof meta.ogImage === 'object' ? (meta.ogImage as { url?: string }).url : undefined
  return { title, description, openGraph: { title, description, images: image ? [image] : undefined } }
}

export default async function HomePage() {
  // const [cases, home] = await Promise.all([getCases(3), getHomePage()])
  const home = await getHomePage()
  const h = home as any

  return (
    <>
      <HeroSection
        headline={h?.hero?.headline}
        subheadline={h?.hero?.subheadline}
        primaryButtonText={h?.hero?.primaryButtonText}
        primaryButtonLink={h?.hero?.primaryButtonLink}
        secondaryButtonText={h?.hero?.secondaryButtonText}
        secondaryButtonLink={h?.hero?.secondaryButtonLink}
        stats={h?.hero?.stats}
        cycleWords={h?.hero?.cycleWords}
        videoCards={h?.hero?.videoCards}
      />
      <ProblemSection
        title={h?.problem?.title}
        text={h?.problem?.text}
        items={h?.problem?.items}
      />
      <SolutionSection
        title={h?.solution?.title}
        titleHighlight={h?.solution?.titleHighlight}
        formula={h?.solution?.formula}
        text={h?.solution?.text}
        checklist={h?.solution?.checklist}
        formulaStats={h?.solution?.formulaStats}
      />
      <StatsSection items={h?.stats?.items} />
      <VideoExamplesSection
        title={h?.videoExamples?.title}
        subtitle={h?.videoExamples?.subtitle}
        items={h?.videoExamples?.items}
      />
      <NichesSection
        title={h?.niches?.title}
        subtitle={h?.niches?.subtitle}
        items={h?.niches?.items}
      />
      <ComparisonSection
        title={h?.comparison?.title}
        subtitle={h?.comparison?.subtitle}
        competitors={h?.comparison?.competitors}
        ourAdvantages={h?.comparison?.ourAdvantages}
      />
      <CTASection
        headline={h?.cta?.headline}
        headlineHighlight={h?.cta?.headlineHighlight}
        text={h?.cta?.text}
        guarantees={h?.cta?.guarantees}
        primaryButtonText={h?.cta?.primaryButtonText}
        primaryButtonLink={h?.cta?.primaryButtonLink}
        secondaryButtonText={h?.cta?.secondaryButtonText}
        telegramLink={h?.cta?.telegramLink}
      />
    </>
  )
}
