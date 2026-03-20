'use client'

import { ShoppingBag, GraduationCap, User, Utensils, Sparkles, Plane, Building2, Stethoscope } from 'lucide-react'
import { motion } from 'framer-motion'
import { FadeInView, StaggerContainer, StaggerItem } from '@/components/animations/fade-in-view'
import { TiltCard } from '@/components/animations/tilt-card'
import { GlowCard } from '@/components/animations/glow-effect'
import { getIcon } from '@/lib/icon-map'

const DEFAULT_NICHES = [
  { icon: ShoppingBag, name: 'E-commerce', description: 'Маркетплейсы, онлайн-магазины' },
  { icon: GraduationCap, name: 'SaaS', description: 'Сервисы, приложения' },
  { icon: User, name: 'Эксперты', description: 'Коучи, психологи, блогеры' },
  { icon: Utensils, name: 'HoReCa', description: 'Рестораны, кафе, отели' },
  { icon: Sparkles, name: 'Beauty', description: 'Салоны красоты, косметология' },
  { icon: Plane, name: 'Онлайн-школы', description: 'Курсы, образовательные проекты' },
  { icon: Building2, name: 'Недвижимость', description: 'Агентства, застройщики' },
  { icon: Stethoscope, name: 'Клиники', description: 'Мед.центры, стоматологии' },
]

export type NichesSectionProps = {
  title?: string | null
  subtitle?: string | null
  items?: Array<{ icon?: string; name?: string; description?: string }> | null
}

export function NichesSection({ title, subtitle, items }: NichesSectionProps = {}) {
  const niches = items?.length ? items.map(n => ({
    Icon: getIcon(n.icon) ?? ShoppingBag,
    name: n.name || '',
    description: n.description || '',
  })) : DEFAULT_NICHES.map(n => ({ Icon: n.icon, name: n.name, description: n.description }))

  return (
    <section className="section bg-neutral-50 pt-0">
      <div className="container">
        <FadeInView direction="up" className="text-center mb-16">
          <h2 className="heading-2 text-neutral-900 mb-4">
            {title || 'С кем мы работаем'}
          </h2>
          <p className="text-lead max-w-2xl mx-auto">
            {subtitle || 'B2C-бизнес с широкой аудиторией. Бюджет на маркетинг от 200 000 ₽/мес.'}
          </p>
        </FadeInView>

        <StaggerContainer stagger={0.08} className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {niches.map((niche, index) => {
            const { Icon } = niche
            return (
              <StaggerItem key={index} direction="up">
                <TiltCard maxTilt={6} className="h-full">
                  <GlowCard
                    className="rounded-2xl h-full"
                    glowColor="rgba(239, 68, 68, 0.12)"
                  >
                    <div className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-primary-300 transition-colors duration-300 text-center h-full">
                      <motion.div
                        className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center mx-auto mb-4"
                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                        transition={{ duration: 0.2 }}
                      >
                        <Icon className="w-6 h-6 text-neutral-700" />
                      </motion.div>
                      <h3 className="font-semibold text-neutral-900 mb-1">
                        {niche.name}
                      </h3>
                      <p className="text-sm text-neutral-500">
                        {niche.description}
                      </p>
                    </div>
                  </GlowCard>
                </TiltCard>
              </StaggerItem>
            )
          })}
        </StaggerContainer>

        <div className="mt-12 text-center">
          
            href="/#pricing"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg bg-primary-500 hover:bg-primary-600 text-white transition-colors"
          >
            Хочу контент-ферму
            <ArrowRight className="w-5 h-5 ml-2" />
          </a>
        </div>
      </div>
    </section>
  )
}
