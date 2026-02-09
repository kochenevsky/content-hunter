import { Button } from '@/components/ui/Button'
import { ArrowRight, Play } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative bg-neutral-950 text-white pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950" />
      
      {/* Content */}
      <div className="container relative z-10">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            Гарантия охватов в договоре
          </div>

          {/* Headline */}
          <h1 className="heading-display text-white mb-6">
            Контент-завод
            <br />
            <span className="text-primary-500">под ключ</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-neutral-400 max-w-2xl mb-10">
            Разворачиваем инфраструктуру для массовой дистрибуции контента — 
            от производства роликов до публикации на десятках аккаунтов.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button href="/contact" size="lg">
              Получить консультацию
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button href="/cases" variant="outline" size="lg" className="border-neutral-700 text-white hover:border-neutral-500">
              <Play className="w-5 h-5 mr-2" />
              Смотреть кейсы
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-neutral-800">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-white">50+</p>
              <p className="text-neutral-500 mt-1">Проектов</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-white">20М+</p>
              <p className="text-neutral-500 mt-1">Просмотров/мес</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-white">8</p>
              <p className="text-neutral-500 mt-1">Стран</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
    </section>
  )
}
