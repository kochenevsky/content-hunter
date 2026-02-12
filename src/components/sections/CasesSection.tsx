'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatNumber, formatCurrency } from '@/lib/utils'
import { FadeInView, StaggerContainer, StaggerItem } from '@/components/animations/fade-in-view'
import { TiltCard } from '@/components/animations/tilt-card'
import { GlowCard } from '@/components/animations/glow-effect'

const nicheLabels: Record<string, string> = {
  ecommerce: 'E-commerce',
  edu: 'Онлайн-школы',
  expert: 'Эксперты',
  horeca: 'HoReCa',
  beauty: 'Beauty',
  travel: 'Тревел',
  realestate: 'Недвижимость',
  digital: 'Digital / IT',
  other: 'Другое',
}

interface CasesSectionProps {
  cases?: any[]
}

export function CasesSection({ cases }: CasesSectionProps) {
  const displayCases = cases && cases.length > 0 ? cases.slice(0, 3) : []

  if (displayCases.length === 0) return null

  return (
    <section className="section bg-white">
      <div className="container">
        <FadeInView direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="heading-2 text-neutral-900 mb-4">
                Кейсы клиентов
              </h2>
              <p className="text-lead max-w-xl">
                Реальные результаты в разных нишах — от e-commerce до онлайн-школ
              </p>
            </div>
            <Button href="/cases" variant="ghost" className="mt-4 md:mt-0">
              Все кейсы
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </FadeInView>

        <StaggerContainer stagger={0.15} className="grid md:grid-cols-3 gap-8">
          {displayCases.map((caseItem: any) => (
            <StaggerItem key={caseItem.id} direction="up">
              <TiltCard maxTilt={5} className="h-full">
                <GlowCard
                  className="rounded-2xl h-full"
                  glowColor="rgba(239, 68, 68, 0.1)"
                  glowSize={250}
                >
                  <Link
                    href={`/cases/${caseItem.slug}`}
                    className="group block h-full"
                  >
                    <div className="rounded-2xl bg-neutral-50 border border-neutral-200 overflow-hidden hover:border-neutral-300 transition-all duration-300 h-full">
                      {/* Image placeholder */}
                      <div className="h-48 bg-neutral-200 group-hover:bg-neutral-300 transition-colors overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300 group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      
                      <div className="p-6">
                        {/* Badge */}
                        <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-3">
                          {nicheLabels[caseItem.niche] || caseItem.niche}
                        </span>
                        
                        {/* Title */}
                        <h3 className="heading-4 text-neutral-900 mb-4 group-hover:text-primary-600 transition-colors">
                          {caseItem.title}
                        </h3>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-2xl font-bold text-neutral-900">
                              {formatNumber(caseItem.views)}
                            </p>
                            <p className="text-sm text-neutral-500">просмотров</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-neutral-900">
                              {formatCurrency(caseItem.revenue, caseItem.currency)}
                            </p>
                            <p className="text-sm text-neutral-500">выручка</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </GlowCard>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
