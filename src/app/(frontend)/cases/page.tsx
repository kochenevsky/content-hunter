import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getCases } from '@/lib/payload-data'
import { formatNumber, formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'
import { VideoExamplesSection } from '@/components/sections/VideoExamplesSection'

export const revalidate = 60

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
                  {/* Обложка */}
                  <div className="h-48 relative bg-neutral-200 overflow-hidden">
                    {caseItem.image && typeof caseItem.image === 'object' && caseItem.image.url ? (
                      <Image
                        src={caseItem.image.url}
                        alt={typeof caseItem.title === 'string' ? caseItem.title : String(caseItem.title?.ru ?? caseItem.title?.en ?? '')}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300 group-hover:from-neutral-300 group-hover:to-neutral-400 flex items-center justify-center">
                        <span className="text-neutral-500 text-sm">Изображение</span>
                      </div>
                    )}
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
