import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { formatNumber, formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Кейсы — Результаты клиентов',
  description: 'Реальные результаты запуска контент-заводов в разных нишах. Просмотры, охваты, выручка.',
}

const nicheLabels: Record<string, string> = {
  ecommerce: 'E-commerce',
  edu: 'Онлайн-школы',
  expert: 'Эксперты',
  horeca: 'HoReCa',
  beauty: 'Beauty',
  travel: 'Тревел',
  realestate: 'Недвижимость',
  digital: 'Digital / IT',
  other: 'Другое',
}

// Временные данные для демонстрации (пока БД пустая)
const mockCases = [
  {
    id: '1',
    title: 'Онлайн-магазин одежды',
    slug: 'online-shop-clothes',
    niche: 'ecommerce',
    publications: 3656,
    views: 14100000,
    revenue: 1900000,
    currency: 'RUB' as const,
    ctr: 0.47,
    conversion: 19,
    duration: '2 месяца',
  },
  {
    id: '2',
    title: 'Школа программирования',
    slug: 'programming-school',
    niche: 'edu',
    publications: 2145,
    views: 2100000,
    revenue: 12000000,
    currency: 'RUB' as const,
    ctr: 0.52,
    conversion: 24,
    duration: '3 месяца',
  },
  {
    id: '3',
    title: 'Салон красоты',
    slug: 'beauty-salon',
    niche: 'beauty',
    publications: 1293,
    views: 700000,
    revenue: 4200000,
    currency: 'RUB' as const,
    ctr: 0.38,
    conversion: 15,
    duration: '2 месяца',
  },
  {
    id: '4',
    title: 'Ресторан итальянской кухни',
    slug: 'italian-restaurant',
    niche: 'horeca',
    publications: 892,
    views: 450000,
    revenue: 2800000,
    currency: 'RUB' as const,
    ctr: 0.41,
    conversion: 12,
    duration: '1.5 месяца',
  },
  {
    id: '5',
    title: 'Агентство недвижимости',
    slug: 'real-estate-agency',
    niche: 'realestate',
    publications: 1567,
    views: 890000,
    revenue: 8500000,
    currency: 'RUB' as const,
    ctr: 0.44,
    conversion: 8,
    duration: '4 месяца',
  },
  {
    id: '6',
    title: 'Туристическое агентство',
    slug: 'travel-agency',
    niche: 'travel',
    publications: 2034,
    views: 1200000,
    revenue: 5600000,
    currency: 'RUB' as const,
    ctr: 0.49,
    conversion: 18,
    duration: '3 месяца',
  },
]

async function getCases() {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'cases',
      where: { published: { equals: true } },
      sort: '-order',
      limit: 100,
    })
    
    if (result.docs.length > 0) {
      return result.docs
    }
  } catch (error) {
    console.error('Error fetching cases:', error)
  }
  
  // Возвращаем mock данные если БД пустая
  return mockCases
}

export default async function CasesPage() {
  const cases = await getCases()

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-neutral-950 text-white">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="heading-display text-white mb-6">
              Кейсы
              <br />
              <span className="text-primary-500">клиентов</span>
            </h1>
            <p className="text-xl text-neutral-400">
              Реальные результаты запуска контент-заводов в разных нишах. 
              Просмотры, охваты, выручка — всё с цифрами.
            </p>
          </div>
        </div>
      </section>

      {/* Cases Grid */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cases.map((caseItem: any) => (
              <Link
                key={caseItem.id}
                href={`/cases/${caseItem.slug}`}
                className="group block"
              >
                <div className="rounded-2xl bg-neutral-50 border border-neutral-200 overflow-hidden hover:border-neutral-300 hover:shadow-lg transition-all duration-300">
                  {/* Image placeholder */}
                  <div className="h-48 bg-gradient-to-br from-neutral-200 to-neutral-300 group-hover:from-neutral-300 group-hover:to-neutral-400 transition-colors flex items-center justify-center">
                    <span className="text-neutral-500 text-sm">Изображение</span>
                  </div>
                  
                  <div className="p-6">
                    {/* Badge */}
                    <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-3">
                      {nicheLabels[caseItem.niche] || caseItem.niche}
                    </span>
                    
                    {/* Title */}
                    <h3 className="heading-4 text-neutral-900 mb-4 group-hover:text-primary-600 transition-colors">
                      {caseItem.title}
                    </h3>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-2xl font-bold text-neutral-900">
                          {formatNumber(caseItem.views)}
                        </p>
                        <p className="text-sm text-neutral-500">просмотров</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-neutral-900">
                          {formatCurrency(caseItem.revenue, caseItem.currency)}
                        </p>
                        <p className="text-sm text-neutral-500">выручка</p>
                      </div>
                    </div>

                    {/* Additional stats */}
                    <div className="flex gap-4 pt-4 border-t border-neutral-200 text-sm text-neutral-500">
                      <span>{formatNumber(caseItem.publications)} публикаций</span>
                      <span>•</span>
                      <span>{caseItem.duration}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-neutral-950 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-2 text-white mb-6">
              Хотите такие же результаты?
            </h2>
            <p className="text-xl text-neutral-400 mb-10">
              Получите бесплатную консультацию и узнайте, как контент-завод 
              может работать в вашей нише.
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
