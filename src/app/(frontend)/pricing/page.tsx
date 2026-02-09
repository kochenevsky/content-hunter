import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Check, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Тарифы — Стоимость контент-завода',
  description: 'Выберите подходящий тариф для запуска контент-завода. Гарантия результата в договоре.',
}

// Временные данные для демонстрации
const mockPricing = [
  {
    id: '1',
    name: 'Стартовый',
    price: 150000,
    currency: 'RUB',
    period: 'месяц',
    isPopular: false,
    features: [
      '20 роликов в месяц',
      '10 аккаунтов',
      '200+ публикаций',
      '500K+ просмотров',
      'Отчётность раз в неделю',
      'Telegram-поддержка',
    ],
    order: 1,
  },
  {
    id: '2',
    name: 'Бизнес',
    price: 300000,
    currency: 'RUB',
    period: 'месяц',
    isPopular: true,
    features: [
      '50 роликов в месяц',
      '20 аккаунтов',
      '1000+ публикаций',
      '2М+ просмотров',
      'Отчётность 2 раза в неделю',
      'Выделенный менеджер',
      'A/B тестирование',
      'Интеграция с CRM',
    ],
    order: 2,
  },
  {
    id: '3',
    name: 'Масштаб',
    price: 500000,
    currency: 'RUB',
    period: 'месяц',
    isPopular: false,
    features: [
      '100 роликов в месяц',
      '40+ аккаунтов',
      '4000+ публикаций',
      '5М+ просмотров',
      'Ежедневная отчётность',
      'Выделенная команда',
      'Стратегические сессии',
      'Мультиязычный контент',
      'Приоритетная поддержка',
    ],
    order: 3,
  },
]

const faqItems = [
  {
    question: 'Что входит в стоимость?',
    answer: 'Полный цикл: стратегия, сценарии, производство роликов, уникализация, публикация через сетку аккаунтов, аналитика и оптимизация.',
  },
  {
    question: 'Какие гарантии?',
    answer: 'KPI по охватам прописываем в договоре. Если не достигаем — продлеваем работу бесплатно до достижения результата.',
  },
  {
    question: 'Как быстро будут результаты?',
    answer: 'Первые публикации через 1-2 недели после старта. Стабильные охваты через 1.5 месяца работы.',
  },
  {
    question: 'Можно ли масштабировать?',
    answer: 'Да, тарифы легко масштабируются. Добавляем аккаунты, платформы, увеличиваем объём контента.',
  },
]

async function getPricing() {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'pricing',
      sort: 'order',
      limit: 10,
    })
    
    if (result.docs.length > 0) {
      return result.docs
    }
  } catch (error) {
    console.error('Error fetching pricing:', error)
  }
  
  return mockPricing
}

function formatPrice(price: number, currency: string = 'RUB'): string {
  const symbols: Record<string, string> = {
    RUB: '₽',
    USD: '$',
    EUR: '€',
  }
  
  return price.toLocaleString('ru-RU') + ' ' + (symbols[currency] || currency)
}

export default async function PricingPage() {
  const pricing = await getPricing()

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-neutral-950 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="heading-display text-white mb-6">
              Тарифы
            </h1>
            <p className="text-xl text-neutral-400">
              Выберите подходящий тариф для вашего бизнеса. 
              Все тарифы включают гарантию результата в договоре.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricing.map((plan: any) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 p-8 ${
                  plan.isPopular
                    ? 'border-primary-500 bg-primary-50/50'
                    : 'border-neutral-200 bg-white'
                }`}
              >
                {/* Popular badge */}
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-primary-500 text-white text-sm font-medium">
                      <Star className="w-4 h-4" />
                      Популярный
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-neutral-900">
                      {formatPrice(plan.price, plan.currency)}
                    </span>
                    <span className="text-neutral-500">/{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {(plan.features || []).map((feature: any, index: number) => {
                    const featureText = typeof feature === 'string' ? feature : feature.feature
                    return (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-neutral-700">{featureText}</span>
                      </li>
                    )
                  })}
                </ul>

                {/* CTA */}
                <Button
                  href="/contact"
                  variant={plan.isPopular ? 'primary' : 'outline'}
                  className="w-full"
                >
                  Выбрать тариф
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ))}
          </div>

          {/* Custom pricing */}
          <div className="mt-12 p-8 rounded-2xl bg-neutral-950 text-white max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Нужен индивидуальный тариф?</h3>
                <p className="text-neutral-400">
                  Для крупных проектов и агентств — рассчитаем стоимость под ваши задачи.
                </p>
              </div>
              <Button href="/contact" className="flex-shrink-0">
                Обсудить
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-neutral-50">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="heading-2 text-neutral-900 text-center mb-12">
              Частые вопросы по тарифам
            </h2>

            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-white border border-neutral-200"
                >
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    {item.question}
                  </h3>
                  <p className="text-neutral-600">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-1 text-neutral-900 mb-6">
              Готовы начать?
            </h2>
            <p className="text-xl text-neutral-600 mb-10">
              Получите бесплатную консультацию и расчёт под ваш проект.
            </p>
            <Button href="/contact" size="lg">
              Получить консультацию
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
