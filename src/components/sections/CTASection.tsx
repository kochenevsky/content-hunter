'use client'

import { UtmLink } from '@/components/ui/UtmLink'
import { ArrowRight, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FadeInView, StaggerContainer, StaggerItem } from '@/components/animations/fade-in-view'
import { MagneticButton } from '@/components/animations/magnetic-button'
import { AnimatedGrid } from '@/components/animations/parallax-section'

const DEFAULT_GUARANTEES = ['KPI по охватам в договоре', 'Бесплатный аудит', 'Первые результаты через 1.5 месяца']

export type CTASectionProps = {
  headline?: string | null
  headlineHighlight?: string | null
  text?: string | null
  guarantees?: Array<{ item?: string } | string> | null
  primaryButtonText?: string | null
  primaryButtonLink?: string | null
  secondaryButtonText?: string | null
  telegramLink?: string | null
}

export function CTASection({ headline, headlineHighlight, text, guarantees: g, primaryButtonText, primaryButtonLink, secondaryButtonText, telegramLink }: CTASectionProps = {}) {
  const guarantees = g?.length ? g.map(x => typeof x === 'string' ? x : (x as { item?: string }).item || '').filter(Boolean) : DEFAULT_GUARANTEES
  return (
    <section className="relative section-hero bg-neutral-950 text-white overflow-hidden">
      {/* Animated background */}
      <AnimatedGrid />
      
      {/* Glow — статичный для производительности */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500 rounded-full blur-[200px] opacity-10" />

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <FadeInView direction="up">
            <h2 className="heading-1 text-white mb-6">
              {headline || 'Готовы запустить'}
              <br />
              <span className="text-primary-500">{headlineHighlight || 'контент-завод?'}</span>
            </h2>
          </FadeInView>

          <FadeInView direction="up" delay={0.15}>
            <p className="text-xl text-neutral-400 mb-10">
              {text || 'Получите бесплатную консультацию и узнайте, сколько просмотров и лидов вы можете получать ежемесячно.'}
            </p>
          </FadeInView>

          <FadeInView direction="up" delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MagneticButton strength={0.2}>
                <UtmLink
                  href={primaryButtonLink || '/contact'}
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg bg-primary-500 hover:bg-primary-600 text-white transition-colors relative group overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative flex items-center">
                    {primaryButtonText || 'Получить консультацию'}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </UtmLink>
              </MagneticButton>
              <MagneticButton strength={0.15}>
                <UtmLink
                  href={telegramLink || 'https://t.me/contenthunter_bot'}
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg border border-neutral-700 text-white hover:border-neutral-500 bg-transparent transition-colors"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {secondaryButtonText || 'Написать в Telegram'}
                </UtmLink>
              </MagneticButton>
            </div>
          </FadeInView>

          {/* Trust indicators */}
          <FadeInView direction="up" delay={0.45}>
            <div className="mt-12 pt-12 border-t border-neutral-800">
              <p className="text-neutral-500 mb-4">Гарантии:</p>
              <StaggerContainer stagger={0.1} className="flex flex-wrap justify-center gap-6 text-sm text-neutral-400">
                {guarantees.map((g, index) => (
                  <StaggerItem key={index} direction="up">
                    <span className="flex items-center gap-1.5">
                      <span className="text-primary-500">&#10003;</span> {g}
                    </span>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </FadeInView>
        </div>
      </div>
    </section>
  )
}
