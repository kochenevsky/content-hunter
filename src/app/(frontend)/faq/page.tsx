import type { Metadata } from 'next'
import { getFAQ } from '@/lib/payload-data'
import { FAQAccordion } from '@/components/ui/FAQAccordion'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'FAQ — Частые вопросы',
  description: 'Ответы на частые вопросы о контент-заводе, процессе работы, гарантиях и стоимости.',
}

const categories = [
  { id: 'general', label: 'Общие вопросы' },
  { id: 'process', label: 'Процесс работы' },
  { id: 'results', label: 'Результаты и гарантии' },
  { id: 'pricing', label: 'Стоимость' },
  { id: 'technical', label: 'Технические вопросы' },
  { id: 'niches', label: 'Ниши и клиенты' },
]

export default async function FAQPage() {
  const faqItems = await getFAQ()

  // Группируем по категориям
  const groupedFAQ = categories.map(category => ({
    ...category,
    items: faqItems.filter((item: any) => item.category === category.id),
  })).filter(group => group.items.length > 0)

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-neutral-950 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="heading-display text-white mb-6">
              Частые
              <br />
              <span className="text-primary-500">вопросы</span>
            </h1>
            <p className="text-xl text-neutral-400">
              Ответы на вопросы о контент-заводе, процессе работы, 
              гарантиях и стоимости.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto space-y-12">
            {groupedFAQ.map((group) => (
              <div key={group.id}>
                <h2 className="heading-3 text-neutral-900 mb-6">
                  {group.label}
                </h2>
                <FAQAccordion items={group.items} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-neutral-950 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-2 text-white mb-6">
              Остались вопросы?
            </h2>
            <p className="text-xl text-neutral-400 mb-10">
              Получите бесплатную консультацию и мы ответим на все ваши вопросы.
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
