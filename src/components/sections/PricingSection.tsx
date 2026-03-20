import { Button } from '@/components/ui/Button'
import { ArrowRight, Check, Star } from 'lucide-react'
import { FadeInView, StaggerContainer, StaggerItem } from '@/components/animations/fade-in-view'

function formatPrice(price: number, currency: string = 'RUB'): string {
  const symbols: Record<string, string> = { RUB: '₽', USD: '$', EUR: '€' }
  return price.toLocaleString('ru-RU') + ' ' + (symbols[currency] || currency)
}

export function PricingSection({ plans }: { plans: any[] }) {
  if (!plans?.length) return null
  return (
    <section id="pricing" className="section bg-neutral-50">
      <div className="container">
        <FadeInView direction="up" className="text-center mb-16">
          <h2 className="heading-2 text-neutral-900 mb-4">Оплата за публикации</h2>
          <p className="text-lead max-w-2xl mx-auto">
            Бесплатная настройка оборудования. Гарантия результата в договоре.
          </p>
        </FadeInView>
        <StaggerContainer stagger={0.08} className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan: any) => (
            <StaggerItem key={plan.id} direction="up">
              <div className={`relative rounded-2xl border-2 p-6 h-full flex flex-col ${
                plan.isPopular ? 'border-primary-500 bg-primary-50/50' : 'border-neutral-200 bg-white'
              }`}>
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-primary-500 text-white text-sm font-medium">
                      <Star className="w-4 h-4" />
                      Популярный
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-neutral-900">
                      {formatPrice(plan.price, plan.currency)}
                    </span>
                    <span className="text-neutral-500 text-sm">/{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6 flex-1">
                  {(plan.features || []).map((feature: any, index: number) => {
                    const text = typeof feature === 'string' ? feature : feature.feature
                    return (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-4 h-4 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="text-neutral-700">{text}</span>
                      </li>
                    )
                  })}
                </ul>
                <Button
                  href={plan.ctaLink || '/contact'}
                  variant={plan.isPopular ? 'primary' : 'outline'}
                  className="w-full"
                >
                  {plan.ctaText || 'Выбрать тариф'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
