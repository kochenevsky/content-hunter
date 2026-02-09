'use client'

import { 
  Target, 
  FileText, 
  Video, 
  Scissors, 
  Share2, 
  BarChart3 
} from 'lucide-react'
import { motion } from 'framer-motion'
import { FadeInView, StaggerContainer, StaggerItem } from '@/components/animations/fade-in-view'

const steps = [
  {
    icon: Target,
    title: 'Стратегия',
    description: 'Анализируем нишу, конкурентов, строим архитектуру контент-системы',
  },
  {
    icon: FileText,
    title: 'Сценарии',
    description: 'AI + редактура: создаём сценарии, адаптированные под каждую платформу',
  },
  {
    icon: Video,
    title: 'Съёмка',
    description: 'Производим контент: живая съёмка, аватары или AI-генерация',
  },
  {
    icon: Scissors,
    title: 'Монтаж',
    description: 'Профессиональный монтаж с уникализацией под каждый аккаунт',
  },
  {
    icon: Share2,
    title: 'Публикация',
    description: 'Массовая публикация через сетку аккаунтов на всех платформах',
  },
  {
    icon: BarChart3,
    title: 'Аналитика',
    description: 'Отслеживаем метрики, оптимизируем стратегию под результат',
  },
]

export function HowItWorksSection() {
  return (
    <section className="section bg-neutral-50">
      <div className="container">
        <FadeInView direction="up" className="text-center mb-16">
          <h2 className="heading-2 text-neutral-900 mb-4">
            Как работает контент-завод
          </h2>
          <p className="text-lead max-w-2xl mx-auto">
            Полный цикл от идеи до публикации и аналитики
          </p>
        </FadeInView>

        <StaggerContainer stagger={0.12} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <StaggerItem key={index} direction="up">
                <motion.div
                  className="relative p-8 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-300 hover:shadow-lg transition-all duration-300 h-full"
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  {/* Step number */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-sm font-medium text-neutral-500">
                    {index + 1}
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="heading-4 text-neutral-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-neutral-600">
                    {step.description}
                  </p>

                  {/* Connecting line */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-4 top-1/2 w-8 h-px bg-neutral-300 z-10" />
                  )}
                </motion.div>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </div>
    </section>
  )
}
