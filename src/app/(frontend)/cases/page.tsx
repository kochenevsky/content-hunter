import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { formatNumber, formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'
import { VideoExamplesSection } from '@/components/sections/VideoExamplesSection'

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

// Данные из брифа Content Hunter (14 кейсов)
const mockCases = [
  { id: '1', title: 'Онлайн-магазин одежды', slug: 'online-shop-clothes', niche: 'ecommerce', publications: 3656, views: 14100000, revenue: 1900000, currency: 'RUB' as const, ctr: 0.47, conversion: 19, duration: '—' },
  { id: '2', title: 'Школа программирования', slug: 'programming-school', niche: 'edu', publications: 2145, views: 2100000, revenue: 12000000, currency: 'RUB' as const, ctr: 1.2, conversion: 25, duration: '—' },
  { id: '3', title: 'Салон красоты', slug: 'beauty-salon', niche: 'beauty', publications: 1293, views: 700000, revenue: 4200000, currency: 'RUB' as const, ctr: 0.8, conversion: 16, duration: '—' },
  { id: '4', title: 'Ремонт офисов (Москва)', slug: 'office-renovation-moscow', niche: 'other', publications: 530, views: 253000, revenue: 6000000, currency: 'RUB' as const, ctr: 0.4, conversion: 7, duration: '1.5 месяца' },
  { id: '5', title: 'Студия дизайна интерьера (Москва)', slug: 'interior-design-studio-moscow', niche: 'other', publications: 430, views: 280000, revenue: 8100000, currency: 'RUB' as const, ctr: 0.8, conversion: 11, duration: '1.5 месяца' },
  { id: '6', title: 'Компьютерные кресла (Ozon)', slug: 'gaming-chairs-ozon', niche: 'ecommerce', publications: 1053, views: 592000, revenue: 2300000, currency: 'RUB' as const, ctr: 2, conversion: 25, duration: '2 месяца' },
  { id: '7', title: 'Юридическое агентство (Беларусь)', slug: 'legal-agency-belarus', niche: 'other', publications: 521, views: 360000, revenue: 920000, currency: 'RUB' as const, ctr: 0.6, conversion: 13, duration: '—' },
  { id: '8', title: 'Психолог для родителей', slug: 'psychologist-parents', niche: 'expert', publications: 346, views: 245000, revenue: 490000, currency: 'RUB' as const, ctr: 2.1, conversion: 11, duration: '1.5 месяца' },
  { id: '9', title: 'Эксперт бизнес-партнёрства (ОАЭ)', slug: 'business-partnership-expert-uae', niche: 'expert', publications: 563, views: 320000, revenue: 1500000, currency: 'RUB' as const, ctr: 0.7, conversion: 9, duration: '—' },
  { id: '10', title: 'Инвестиции (Великобритания)', slug: 'investments-uk', niche: 'expert', publications: 940, views: 570000, revenue: 2200000, currency: 'RUB' as const, ctr: 1.4, conversion: 8, duration: '2 месяца' },
  { id: '11', title: 'Глэмпинг (Казань)', slug: 'glamping-kazan', niche: 'travel', publications: 540, views: 320000, revenue: 2500000, currency: 'RUB' as const, ctr: 2.5, conversion: 14, duration: '—' },
  { id: '12', title: 'Тур-агентство (Европа)', slug: 'travel-agency-europe', niche: 'travel', publications: 1841, views: 1200000, revenue: 3000000, currency: 'RUB' as const, ctr: 1.2, conversion: 18, duration: '—' },
  { id: '13', title: 'Digital-агентство (Астана)', slug: 'digital-agency-astana', niche: 'digital', publications: 340, views: 275000, revenue: 31000, currency: 'USD' as const, ctr: 0.8, conversion: 10, duration: '1.5 месяца' },
  { id: '14', title: 'Школа языков (Казахстан)', slug: 'language-school-kazakhstan', niche: 'edu', publications: 985, views: 553000, revenue: 80000, currency: 'USD' as const, ctr: 1.2, conversion: 18, duration: '2.5 месяца' },
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

      <VideoExamplesSection />

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
