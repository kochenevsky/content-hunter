import type { Metadata } from 'next'
import { getFAQ, getFAQPage } from '@/lib/payload-data'
import { FAQAccordion } from '@/components/ui/FAQAccordion'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'

export const revalidate = 60

const DEFAULT_CATEGORIES = [
  { id: 'general', label: 'Общие вопросы' },
  { id: 'process', label: 'Процесс работы' },
  { id: 'results', label: 'Результаты и гарантии' },
  { id: 'pricing', label: 'Стоимость' },
  { id: 'technical', label: 'Технические вопросы' },
  { id: 'niches', label: 'Ниши и клиенты' },
]

export async function generateMetadata(): Promise<Metadata> {
  const page = await getFAQPage()
  const meta = (page as any)?.meta
  const title = meta?.title ?? 'FAQ — Частые вопросы'
  const description = meta?.description ?? 'Ответы на частые вопросы о контент-заводе, процессе работы, гарантиях и стоимости.'
  const image = meta?.ogImage && typeof meta.ogImage === 'object' ? (meta.ogImage as { url?: string }).url : undefined
  return { title, description, openGraph: { title, description, images: image ? [image] : undefined } }
}

export default async function FAQPage() {
  const [faqItems, page] = await Promise.all([getFAQ(), getFAQPage()])
  const p = page as any
  const hero = p?.hero
  const cta = p?.cta
  const categories = p?.categories?.length ? p.categories : DEFAULT_CATEGORIES

  // Группируем по категориям
  const groupedFAQ = categories.map((category: any) => ({
    ...category,
    items: faqItems.filter((item: any) => item.category === category.id),
  })).filter((group: any) => group.items.length > 0)

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-neutral-950 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="heading-display text-white mb-6">
              {hero?.headline || 'Частые'}
              {hero?.headlineHighlight && <><br /><span className="text-primary-500">{hero.headlineHighlight}</span></>}
              {!hero?.headlineHighlight && <><br /><span className="text-primary-500">вопросы</span></>}
            </h1>
            <p className="text-xl text-neutral-400">
              {hero?.subheadline || 'Ответы на вопросы о контент-заводе, процессе работы, гарантиях и стоимости.'}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto space-y-12">
            {groupedFAQ.map((group: { id: string; label: string; items: { id?: string | number; question?: string; answer?: string }[] }) => (
              <div key={group.id}>
                <h2 className="heading-3 text-neutral-900 mb-6">
                  {group.label}
                </h2>
                <FAQAccordion items={group.items.map((i) => ({ id: i.id ?? '', question: i.question ?? '', answer: i.answer ?? '' }))} />
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
              {cta?.headline || 'Остались вопросы?'}
            </h2>
            <p className="text-xl text-neutral-400 mb-10">
              {cta?.text || 'Получите бесплатную консультацию и мы ответим на все ваши вопросы.'}
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
