import type { Metadata } from 'next'
import { getPricing, getFAQ, getPricingPage } from '@/lib/payload-data'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Check, Star } from 'lucide-react'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPricingPage()
  const meta = (page as any)?.meta
  const title = meta?.title ?? 'Тарифы — Стоимость контент-завода'
  const description = meta?.description ?? 'Выберите подходящий тариф для запуска контент-завода. Гарантия результата в договоре.'
  const image = meta?.ogImage && typeof meta.ogImage === 'object' ? (meta.ogImage as { url?: string }).url : undefined
  return { title, description, openGraph: { title, description, images: image ? [image] : undefined } }
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
  const [pricing, allFAQ, page] = await Promise.all([
    getPricing(),
    getFAQ(),
    getPricingPage(),
  ])

  const p = page as any
  const hero = p?.hero
  const cta = p?.cta

  // Берём FAQ по категории pricing
  const pricingFAQ = allFAQ
    .filter((item: any) => item.category === 'pricing')
    .slice(0, 4)

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-neutral-950 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="heading-display text-white mb-6">
              {hero?.headline || 'Тарифы'}
            </h1>
            <p className="text-xl text-neutral-400">
              {hero?.subheadline || 'Выберите подходящий тариф для вашего бизнеса. Все тарифы включают гарантию результата в договоре.'}
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
      {pricingFAQ.length > 0 && (
        <section className="section bg-neutral-50">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="heading-2 text-neutral-900 text-center mb-12">
                Частые вопросы по тарифам
              </h2>
              <div className="space-y-6">
                {pricingFAQ.map((item: any) => (
                  <div
                    key={item.id}
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
      )}

      {/* CTA */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-1 text-neutral-900 mb-6">
              {cta?.headline || 'Готовы начать?'}
            </h2>
            <p className="text-xl text-neutral-600 mb-10">
              {cta?.text || 'Получите бесплатную консультацию и расчёт под ваш проект.'}
            </p>
            <Button href="/contact" size="lg">
              {cta?.buttonText || 'Получить консультацию'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
