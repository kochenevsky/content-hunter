'use client'

import { Check, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { FadeInView, StaggerContainer, StaggerItem } from '@/components/animations/fade-in-view'

const DEFAULT_COMPARISONS = [
  { title: 'SMM-агентства', description: 'Ведут 1-2 блога, публикуют 1-2 поста в день и надеются на «вирусный» эффект', cons: ['Долго ждать результата', 'Непредсказуемые охваты', 'Часто нецелевая аудитория'] },
  { title: 'ИИ-платформы', description: 'Создают красивые ролики, которые не приводят клиентов', cons: ['Слабые конверсии', 'Риск блокировок', 'Нет сетки аккаунтов'] },
  { title: 'Фрилансеры', description: 'Нет технологической инфраструктуры и системного подхода', cons: ['Хаотичные публикации', 'Нестабильное качество', 'Нет масштабирования'] },
]

const DEFAULT_ADVANTAGES = [
  'Массовая выкладка через прогретые аккаунты',
  'Детальная аналитика и отчетность',
  'Гарантия охватов в договоре',
  'Настройка и обслуживание оборудования',
  'Первые публикации через 10 дней',
]

export type ComparisonSectionProps = {
  title?: string | null
  subtitle?: string | null
  competitors?: Array<{ title?: string; description?: string; cons?: Array<{ item?: string } | string> }> | null
  ourAdvantages?: Array<{ item?: string } | string> | null
}

export function ComparisonSection({ title, subtitle, competitors, ourAdvantages: adv }: ComparisonSectionProps = {}) {
  const comparisons = competitors?.length ? competitors.map(c => ({
    title: c.title || '',
    description: c.description || '',
    cons: (c.cons || []).map(x => typeof x === 'string' ? x : (x as { item?: string }).item || '').filter(Boolean),
  })) : DEFAULT_COMPARISONS
  const ourAdvantages = adv?.length ? adv.map(a => typeof a === 'string' ? a : (a as { item?: string }).item || '').filter(Boolean) : DEFAULT_ADVANTAGES

  return (
    <section id="comparison" className="section bg-white overflow-hidden">
      <div className="container">
        <FadeInView direction="up" className="text-center mb-16">
          <h2 className="heading-2 text-neutral-900 mb-4">
            {title || 'Чем мы отличаемся'}
          </h2>
          <p className="text-lead max-w-2xl mx-auto">
            {subtitle || 'Делаем массовую выкладку ваших роликов и даем гарантию результата.'}
          </p>
        </FadeInView>

        {/* Competitors */}
        <StaggerContainer stagger={0.12} className="grid md:grid-cols-3 gap-6 mb-12">
          {comparisons.map((item, index) => (
            <StaggerItem key={index} direction="left">
              <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 h-full">
                <h3 className="heading-4 text-neutral-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-neutral-600 text-sm mb-4">
                  {item.description}
                </p>
                <ul className="space-y-2">
                  {item.cons.map((con, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-neutral-500">
                      <X className="w-4 h-4 text-red-500 flex-shrink-0" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Our advantages */}
        <FadeInView direction="right" delay={0.3}>
          <motion.div
            className="p-8 rounded-2xl bg-neutral-950 text-white relative overflow-hidden"
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.25 }}
          >
            {/* Subtle glow */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary-500/10 rounded-full blur-[80px]" />
            
            <div className="flex flex-col lg:flex-row lg:items-center gap-8 relative z-10">
              <div className="lg:w-1/3">
                <h3 className="heading-3 text-white mb-2">Content Hunter</h3>
                <p className="text-neutral-400">
                  Системный подход к контенту с гарантией результата
                </p>
              </div>
              <div className="lg:w-2/3">
                <StaggerContainer stagger={0.08} className="grid md:grid-cols-2 gap-4">
                  {ourAdvantages.map((advantage, index) => (
                    <StaggerItem key={index} direction="right">
                      <li className="flex items-center gap-3 list-none">
                        <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-neutral-300">{advantage}</span>
                      </li>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </div>
          </motion.div>
        </FadeInView>
      </div>
    </section>
  )
}
