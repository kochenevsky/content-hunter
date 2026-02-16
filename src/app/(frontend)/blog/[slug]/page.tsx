import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, ArrowRight, Calendar, User, Clock } from 'lucide-react'

const categoryLabels: Record<string, string> = {
  cases: 'Кейсы',
  analysis: 'Аналитика',
  process: 'Процессы',
  myths: 'Разрушаем мифы',
  guides: 'Гайды',
}

// Временные данные
const mockPosts: Record<string, any> = {
  'why-one-blog-doesnt-work': {
    id: '1',
    title: 'Почему один блог больше не работает: математика охватов в 2024',
    slug: 'why-one-blog-doesnt-work',
    category: 'analysis',
    excerpt: 'Разбираем, почему классический SMM с одним аккаунтом перестал приносить результаты и как контент-завод решает эту проблему.',
    publishedAt: '2024-01-15',
    author: { name: 'Кирилл Попов' },
    readTime: '7 мин',
    content: `
      <p class="lead">Ещё 3-4 года назад можно было вести один Instagram-аккаунт, публиковать качественный контент и получать органические охваты. Сегодня эта модель не работает. Разбираемся, почему — и что с этим делать.</p>

      <h2>Что изменилось в алгоритмах</h2>
      <p>Платформы перенасыщены контентом. Instagram, TikTok, YouTube Shorts — все борются за внимание пользователя. Алгоритмы стали жёстче: органический охват одного поста редко превышает 5-10% от числа подписчиков.</p>
      <p>Это означает: если у вас 10 000 подписчиков, ваш пост увидят 500-1000 человек. Из них 0.5-1% перейдут по ссылке. Это 5-10 переходов с одного поста. Чтобы получить 100 лидов в месяц, нужно публиковать 300-600 постов.</p>

      <h2>Математика традиционного SMM</h2>
      <ul>
        <li>Один аккаунт = 1-2 поста в день = 30-60 постов в месяц</li>
        <li>Охват: 5-10% от подписчиков</li>
        <li>CTR: 0.5-1%</li>
        <li>Конверсия в лид: 2-5%</li>
      </ul>
      <p>При 10К подписчиках и 60 постах в месяц получаем: 60 × 1000 × 0.01 × 0.03 = 18 лидов. Это в лучшем случае.</p>

      <h2>Как работает контент-завод</h2>
      <p>Контент-завод решает проблему объёмом. Вместо одного аккаунта — сетка из 20+. Вместо 60 постов — 1000+ публикаций. Один ролик уникализируется и публикуется через всю сеть.</p>
      <p>Математика: 20 аккаунтов × 50 роликов × 20 версий = 1000 публикаций в месяц. При тех же конверсиях это уже 300+ лидов.</p>

      <h2>Почему это работает</h2>
      <p>Алгоритмы не видят связи между аккаунтами. Каждый ролик уникализирован: другой звук, субтитры, визуальные эффекты. Для платформы это разный контент от разных авторов.</p>
      <p>Главное — не надеяться на вирусность. Мы не ждём, что один ролик "залетит". Мы берём объёмом: 1000 роликов по 1000 просмотров = миллион охвата. Гарантированно.</p>

      <h2>Выводы</h2>
      <p>Классический SMM с одним аккаунтом — это лотерея. Контент-завод — это система. Первый подход может сработать, а может и нет. Второй даёт предсказуемый результат, который можно масштабировать.</p>
    `,
  },
  'case-14m-views-ecommerce': {
    id: '2',
    title: 'Как мы сделали 14 млн просмотров для онлайн-магазина за 2 месяца',
    slug: 'case-14m-views-ecommerce',
    category: 'cases',
    excerpt: 'Подробный разбор кейса: стратегия, инфраструктура, контент и результаты запуска контент-завода для e-commerce.',
    publishedAt: '2024-01-10',
    author: { name: 'Кирилл Попов' },
    readTime: '10 мин',
    content: `
      <p class="lead">Онлайн-магазин женской одежды из Москвы обратился к нам с задачей увеличить охваты и продажи через социальные сети. До нас вели один Instagram-аккаунт с 15К подписчиками и получали 2-3 заказа в неделю с контента.</p>

      <h2>Исходные данные</h2>
      <ul>
        <li>Ниша: женская одежда, средний чек 5000₽</li>
        <li>Один Instagram-аккаунт: 15 000 подписчиков</li>
        <li>Охват: 1000-2000 просмотров на пост</li>
        <li>Продажи с контента: 2-3 заказа в неделю</li>
        <li>Цель: увеличить охваты и продажи в 10 раз</li>
      </ul>

      <h2>Стратегия</h2>
      <p>Решили запустить контент-завод на двух платформах: Instagram Reels и TikTok. Фокус на короткие ролики с образами, лукбуками и распаковками.</p>
      <p>Инфраструктура: 25 аккаунтов (15 Instagram + 10 TikTok), 50 уникальных роликов в месяц, каждый ролик уникализируется в 20 версий.</p>

      <h2>Производство контента</h2>
      <p>Создали контент-план на 50 роликов: 20 образов, 15 лукбуков, 10 распаковок, 5 backstage. Съёмки проводили 2 раза в месяц по 1 дню.</p>
      <p>Каждый ролик проходил уникализацию: разные субтитры, звуковые дорожки, цветокоррекция, эффекты. В итоге из 50 роликов получили 1000 уникальных публикаций.</p>

      <h2>Результаты за 2 месяца</h2>
      <ul>
        <li>Публикаций: 3656</li>
        <li>Просмотров: 14 100 000</li>
        <li>Переходов на сайт: 66 300 (CTR 0.47%)</li>
        <li>Заказов: 12 600 (конверсия 19%)</li>
        <li>Выручка с контента: 1 900 000₽/месяц</li>
      </ul>

      <h2>Выводы</h2>
      <p>Контент-завод увеличил охваты в 100 раз: с 1-2К до 7М просмотров в месяц. Продажи выросли с 10 заказов до 6000+ в месяц. ROI проекта — 400%.</p>
    `,
  },
}

type Props = {
  params: Promise<{ slug: string }>
}

async function getBlogPost(slug: string) {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'blog-posts',
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
    console.error('Error fetching blog post:', error)
  }
  
  return mockPosts[slug] || null
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)
  
  if (!post) {
    return {
      title: 'Статья не найдена',
    }
  }
  
  return {
    title: `${post.title} — Блог Content Hunter`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  
  if (!post) {
    notFound()
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-neutral-950 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Все статьи
            </Link>
            
            <span className="inline-block px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 text-sm font-medium mb-4">
              {categoryLabels[post.category] || post.category}
            </span>
            
            <h1 className="heading-1 text-white mb-6">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-neutral-400">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(post.publishedAt)}
              </span>
              {post.author && (
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {post.author.name}
                </span>
              )}
              {post.readTime && (
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Article */}
            <article className="lg:col-span-2">
              {/* Featured Image placeholder */}
              <div className="aspect-video bg-neutral-100 rounded-2xl mb-8 flex items-center justify-center">
                <span className="text-neutral-400">Изображение статьи</span>
              </div>
              
              {/* Content */}
              <div 
                className="prose prose-lg max-w-none prose-headings:text-neutral-900 prose-p:text-neutral-600 prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-10 prose-h2:mb-4 prose-ul:text-neutral-600 prose-li:marker:text-primary-500 prose-lead:text-xl prose-lead:text-neutral-700"
                dangerouslySetInnerHTML={{ __html: post.content || '' }}
              />
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* CTA Card */}
                <div className="p-6 rounded-2xl bg-neutral-950 text-white">
                  <h3 className="text-xl font-semibold mb-4">
                    Хотите такой же результат?
                  </h3>
                  <p className="text-neutral-400 mb-6">
                    Получите бесплатную консультацию и узнайте, как это может работать в вашей нише.
                  </p>
                  <Button href={(post as any).ctaLink || '/contact'} className="w-full">
                    {typeof (post as any).ctaText === 'string' ? (post as any).ctaText : ((post as any).ctaText as Record<string, string> | null)?.ru || 'Получить консультацию'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                {/* Related */}
                <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <h3 className="font-semibold text-neutral-900 mb-4">
                    Читайте также
                  </h3>
                  <ul className="space-y-4">
                    <li>
                      <Link href="/cases" className="text-neutral-600 hover:text-primary-600 transition-colors">
                        Все кейсы клиентов →
                      </Link>
                    </li>
                    <li>
                      <Link href="/services" className="text-neutral-600 hover:text-primary-600 transition-colors">
                        Что такое контент-завод →
                      </Link>
                    </li>
                    <li>
                      <Link href="/pricing" className="text-neutral-600 hover:text-primary-600 transition-colors">
                        Тарифы и стоимость →
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-neutral-50">
        <div className="container">
          <div className="flex items-center justify-between">
            <Button href="/blog" variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Все статьи
            </Button>
            <Button href={(post as any).ctaLink || '/contact'}>
              {typeof (post as any).ctaText === 'string' ? (post as any).ctaText : ((post as any).ctaText as Record<string, string> | null)?.ru || 'Получить консультацию'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
