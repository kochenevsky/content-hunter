'use client'

import { Check, ArrowRight } from 'lucide-react'
import { FadeInView, StaggerContainer, StaggerItem } from '@/components/animations/fade-in-view'
import { AnimatedCounter } from '@/components/animations/animated-counter'

const DEFAULT_CHECKLIST = [
  'Один ролик превращаем в несколько уникальных версий',
  'Публикуем через сетку из 20+ аккаунтов',
  'Охватываем все платформы: Reels, Shorts, TikTok',
  'Получаем стабильный поток целевых просмотров',
]

const DEFAULT_FORMULA_STATS = [
  { value: 50, label: 'роликов/мес' },
  { value: 20, label: 'аккаунтов' },
  { value: 1000, label: 'публикаций' },
  { value: 1500000, label: 'просмотров' },
]

export type SolutionSectionProps = {
  title?: string | null
  titleHighlight?: string | null
  formula?: string | null
  text?: string | null
  checklist?: Array<{ item?: string } | string> | null
  formulaStats?: Array<{ value?: number; label?: string }> | null
}

export function SolutionSection({ title, titleHighlight, formula, text, checklist, formulaStats }: SolutionSectionProps = {}) {
  const checklistItems = checklist?.length ? checklist.map(c => typeof c === 'string' ? c : (c as { item?: string }).item || '').filter(Boolean) : DEFAULT_CHECKLIST
  const stats = formulaStats?.length ? formulaStats.map(s => ({ value: Number(s.value) || 0, label: s.label || '' })) : DEFAULT_FORMULA_STATS
  return (
    <section className="section bg-neutral-950 text-white overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Text */}
          <FadeInView direction="left">
            <div>
              <h2 className="heading-2 text-white mb-6">
                {title || 'Холодная математика'}
                <br />
                <span className="text-primary-500">{titleHighlight || 'вместо надежды'}</span>
              </h2>
              
              <div className="space-y-6 mb-8">
                <p className="text-xl text-neutral-300">
                  {formula || '1000 роликов × 1000 просмотров = 1 000 000 гарантированных просмотров'}
                </p>
                <p className="text-xl text-white font-semibold">
                  {text || 'Один ролик → несколько копий → несколько аккаунтов → несколько платформ. Масштабируем не производство ради производства, а охваты, трафик и результат.'}
                </p>
              </div>

              <StaggerContainer stagger={0.1} className="space-y-4">
                {checklistItems.map((item, index) => (
                  <StaggerItem key={index} direction="left">
                    <li className="flex items-start gap-3 list-none">
                      <Check className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                      <span className="text-neutral-300">{item}</span>
                    </li>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </FadeInView>

          {/* Right side - Visual */}
          <FadeInView direction="right" delay={0.2}>
            <div className="relative">
              <div className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800">
                {/* Formula */}
                <div className="text-center mb-8">
                  <p className="text-sm text-neutral-500 uppercase tracking-wider mb-4">
                    Формула результата
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-xl md:text-2xl font-bold">
                    <span className="text-neutral-400">1 ролик</span>
                    <ArrowRight className="w-5 h-5 text-primary-500" />
                    <span className="text-neutral-400">несколько копий</span>
                    <ArrowRight className="w-5 h-5 text-primary-500" />
                    <span className="text-neutral-400">несколько аккаунтов</span>
                    <ArrowRight className="w-5 h-5 text-primary-500" />
                    <span className="text-primary-500">несколько платформ</span>
                  </div>
                  <p className="text-neutral-500 mt-4">охваты и трафик, а не надежда на вирус</p>
                </div>

                {/* Monthly stats with animated counters */}
                <div className="grid grid-cols-2 gap-4 pt-8 border-t border-neutral-800">
                  {stats.slice(0, 3).map((stat, index) => (
                    <div key={index} className="text-center p-4 rounded-xl bg-neutral-800/50">
                      <p className="text-3xl font-bold text-white">
                        <AnimatedCounter target={stat.value} />
                      </p>
                      <p className="text-sm text-neutral-500">{stat.label}</p>
                    </div>
                  ))}
                  {stats.length >= 4 ? (
                    <div className="text-center p-4 rounded-xl bg-primary-500/20 border border-primary-500/30">
                      <p className="text-3xl font-bold text-primary-500">
                        <AnimatedCounter target={stats[3].value} suffix={stats[3].value === 1 ? 'М+' : ''} />
                      </p>
                      <p className="text-sm text-primary-400">{stats[3].label}</p>
                    </div>
                  ) : (
                    <div className="text-center p-4 rounded-xl bg-primary-500/20 border border-primary-500/30">
                      <p className="text-3xl font-bold text-primary-500">
                        <AnimatedCounter target={1} suffix="М+" />
                      </p>
                      <p className="text-sm text-primary-400">просмотров</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </FadeInView>
        </div>
      </div>
    </section>
  )
}
