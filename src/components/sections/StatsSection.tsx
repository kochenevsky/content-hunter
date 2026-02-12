'use client'

import { FadeInView } from '@/components/animations/fade-in-view'
import { AnimatedCounter } from '@/components/animations/animated-counter'

const DEFAULT_STATS = [
  { value: 50, suffix: '+', label: 'Запущенных проектов' },
  { value: 20, suffix: 'М+', label: 'Просмотров в месяц' },
  { value: 15, suffix: '+', label: 'Ниш клиентов' },
  { value: 8, suffix: '', label: 'Стран присутствия' },
]

export type StatsSectionProps = {
  items?: Array<{ value?: number; suffix?: string; label?: string }> | null
}

export function StatsSection({ items }: StatsSectionProps = {}) {
  const stats = items?.length ? items.map(s => ({
    value: Number(s.value) || 0,
    suffix: String(s.suffix || ''),
    label: String(s.label || ''),
  })) : DEFAULT_STATS

  return (
    <section className="py-16 bg-white border-y border-neutral-200">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <FadeInView key={index} direction="up" delay={index * 0.1}>
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-neutral-900">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} duration={2.5} />
                </p>
                <p className="text-neutral-600 mt-2">{stat.label}</p>
              </div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  )
}
