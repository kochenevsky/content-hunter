import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { formatNumber, formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, ArrowRight, ExternalLink, TrendingUp, Eye, FileText, Clock } from 'lucide-react'

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

// Временные данные для демонстрации
const mockCases: Record<string, any> = {
  'online-shop-clothes': {
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
    description: `
      <h3>Задача</h3>
      <p>Онлайн-магазин женской одежды из Москвы хотел увеличить охваты и продажи через социальные сети. До нас вели один Instagram-аккаунт с 15К подписчиками и получали 2-3 заказа в неделю с контента.</p>
      
      <h3>Решение</h3>
      <p>Развернули контент-завод: 25 аккаунтов в Instagram и TikTok, 50 роликов в месяц с уникализацией под каждый профиль. Контент фокусировался на образах, лукбуках и распаковках.</p>
      
      <h3>Результат</h3>
      <p>За 2 месяца работы достигли 14.1М просмотров. Конверсия в переходы на сайт — 0.47%. Выручка с контента выросла до 1.9М рублей в месяц.</p>
    `,
    socialLinks: [
      { platform: 'instagram', url: '#' },
      { platform: 'tiktok', url: '#' },
    ],
  },
  'programming-school': {
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
    description: `
      <h3>Задача</h3>
      <p>Онлайн-школа программирования искала способ снизить стоимость лида с таргетированной рекламы. CPL через Facebook Ads достигал 1500 рублей.</p>
      
      <h3>Решение</h3>
      <p>Запустили контент-завод с фокусом на образовательный контент: мини-уроки, разборы кода, истории успеха выпускников. 20 аккаунтов, 40 роликов в месяц.</p>
      
      <h3>Результат</h3>
      <p>2.1М просмотров за 3 месяца. 5000+ переходов на лендинг. 1200 заявок на курсы. Выручка 12М рублей. CPL снизился до 400 рублей.</p>
    `,
    socialLinks: [
      { platform: 'youtube', url: '#' },
      { platform: 'tiktok', url: '#' },
    ],
  },
  'beauty-salon': {
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
    description: `
      <h3>Задача</h3>
      <p>Сеть салонов красоты в Санкт-Петербурге хотела увеличить поток клиентов без увеличения бюджета на рекламу.</p>
      
      <h3>Решение</h3>
      <p>Контент-завод с акцентом на до/после, процессы работы мастеров, отзывы клиентов. 15 аккаунтов, 30 роликов в месяц.</p>
      
      <h3>Результат</h3>
      <p>700K просмотров за 2 месяца. 2600 переходов в директ. 390 записей на услуги. Выручка 4.2М рублей.</p>
    `,
    socialLinks: [
      { platform: 'instagram', url: '#' },
    ],
  },
}

type Props = {
  params: Promise<{ slug: string }>
}

async function getCase(slug: string) {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'cases',
      where: { 
        slug: { equals: slug },
        published: { equals: true },
      },
      limit: 1,
    })
    
    if (result.docs.length > 0) {
      return result.docs[0]
    }
  } catch (error) {
    console.error('Error fetching case:', error)
  }
  
  // Возвращаем mock данные если не найдено в БД
  return mockCases[slug] || null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const caseData = await getCase(slug)
  
  if (!caseData) {
    return {
      title: 'Кейс не найден',
    }
  }
  
  return {
    title: `${caseData.title} — Кейс Content Hunter`,
    description: `${formatNumber(caseData.views)} просмотров, ${formatCurrency(caseData.revenue, caseData.currency)} выручки за ${caseData.duration}`,
  }
}

export default async function CaseDetailPage({ params }: Props) {
  const { slug } = await params
  const caseData = await getCase(slug)
  
  if (!caseData) {
    notFound()
  }

  const stats = [
    { icon: Eye, label: 'Просмотров', value: formatNumber(caseData.views) },
    { icon: FileText, label: 'Публикаций', value: formatNumber(caseData.publications) },
    { icon: TrendingUp, label: 'Выручка', value: formatCurrency(caseData.revenue, caseData.currency) },
    { icon: Clock, label: 'Срок', value: caseData.duration },
  ]

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-neutral-950 text-white">
        <div className="container">
          <Link
            href="/cases"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Все кейсы
          </Link>
          
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 text-sm font-medium mb-4">
              {nicheLabels[caseData.niche] || caseData.niche}
            </span>
            <h1 className="heading-display text-white mb-6">
              {caseData.title}
            </h1>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
                  <Icon className="w-6 h-6 text-primary-500 mb-3" />
                  <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-neutral-400 text-sm">{stat.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Image placeholder */}
              <div className="aspect-video bg-neutral-100 rounded-2xl mb-8 flex items-center justify-center">
                <span className="text-neutral-400">Изображение кейса</span>
              </div>
              
              {/* Description */}
              <div 
                className="prose prose-lg max-w-none prose-headings:text-neutral-900 prose-p:text-neutral-600 prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-4"
                dangerouslySetInnerHTML={{ __html: caseData.description || '' }}
              />

              {/* Additional metrics */}
              <div className="mt-12 p-6 rounded-2xl bg-neutral-50 border border-neutral-200">
                <h3 className="heading-4 text-neutral-900 mb-6">Детальные метрики</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-2xl font-bold text-neutral-900">{caseData.ctr}%</p>
                    <p className="text-sm text-neutral-500">CTR</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-neutral-900">{caseData.conversion}%</p>
                    <p className="text-sm text-neutral-500">Конверсия в лид</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-neutral-900">{formatNumber(caseData.publications)}</p>
                    <p className="text-sm text-neutral-500">Публикаций</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-neutral-900">{caseData.duration}</p>
                    <p className="text-sm text-neutral-500">Срок работы</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* CTA Card */}
                <div className="p-6 rounded-2xl bg-neutral-950 text-white">
                  <h3 className="text-xl font-semibold mb-4">
                    Хотите такой же результат?
                  </h3>
                  <p className="text-neutral-400 mb-6">
                    Получите бесплатную консультацию и узнайте, как это может работать в вашей нише.
                  </p>
                  <Button href="/contact" className="w-full">
                    Получить консультацию
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                {/* Social Links */}
                {caseData.socialLinks && caseData.socialLinks.length > 0 && (
                  <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200">
                    <h3 className="font-semibold text-neutral-900 mb-4">
                      Ссылки на аккаунты
                    </h3>
                    <div className="space-y-3">
                      {caseData.socialLinks.map((link: any, index: number) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-neutral-600 hover:text-primary-600 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span className="capitalize">{link.platform}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Cases */}
      <section className="section bg-neutral-50">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="heading-2 text-neutral-900">Другие кейсы</h2>
            <Button href="/cases" variant="ghost">
              Все кейсы
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <p className="text-neutral-600">
            Посмотрите другие примеры успешных проектов в разных нишах.
          </p>
        </div>
      </section>
    </>
  )
}
