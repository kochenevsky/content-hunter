import type { Metadata } from 'next'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Check } from 'lucide-react'
import { IconByName } from '@/components/ui/IconByName'
import { getServicesPage } from '@/lib/payload-data'

export const revalidate = 60

const DEFAULT_FORMATS = [
  { icon: 'Video', title: 'Reels / Stories', description: 'Instagram и Facebook — основной канал для B2C', platforms: ['Instagram', 'Facebook'] },
  { icon: 'Zap', title: 'Shorts', description: 'YouTube Shorts — быстрорастущий формат с огромным охватом', platforms: ['YouTube'] },
  { icon: 'TrendingUp', title: 'TikTok', description: 'Вирусный потенциал и молодая платежеспособная аудитория', platforms: ['TikTok'] },
  { icon: 'Globe', title: 'VK Клипы', description: 'Для российской аудитории и B2B-сегмента', platforms: ['VK'] },
]

const DEFAULT_STAGES = [
  { number: '01', title: 'Аудит и стратегия', description: 'Анализируем вашу нишу, конкурентов, целевую аудиторию. Строим контент-стратегию с конкретными KPI.', duration: '3-5 дней' },
  { number: '02', title: 'Создание инфраструктуры', description: 'Разворачиваем сетку аккаунтов, настраиваем автоматизацию публикаций, прогреваем профили.', duration: '1-2 недели' },
  { number: '03', title: 'Производство контента', description: 'Создаём сценарии, снимаем или генерируем видео, монтируем с уникализацией под каждый аккаунт.', duration: 'Постоянно' },
  { number: '04', title: 'Массовая дистрибуция', description: 'Публикуем контент через сетку аккаунтов на всех платформах по оптимальному расписанию.', duration: 'Ежедневно' },
  { number: '05', title: 'Аналитика и оптимизация', description: 'Отслеживаем метрики, A/B тестируем форматы, масштабируем то, что работает.', duration: 'Еженедельно' },
]

const DEFAULT_BENEFITS = [
  'Гарантия охватов в договоре',
  'Первые результаты через 1.5 месяца',
  'Полный цикл: от идеи до аналитики',
  'Работаем на вашу воронку продаж',
  'Масштабирование без потери качества',
  'Прозрачная отчётность',
]

const DEFAULT_SCALING = [
  { icon: 'Users', title: '20+ аккаунтов', description: 'Сетка прогретых аккаунтов на каждой платформе' },
  { icon: 'Repeat', title: '1000+ публикаций/мес', description: 'Массовая дистрибуция одного ролика в разных версиях' },
  { icon: 'Target', title: '1М+ просмотров', description: 'Гарантированный охват за счёт объёма публикаций' },
  { icon: 'BarChart3', title: 'ROI tracking', description: 'Отслеживание конверсий и влияния на продажи' },
]

export async function generateMetadata(): Promise<Metadata> {
  const page = await getServicesPage()
  const meta = (page as any)?.meta
  const title = meta?.title ?? 'Услуги — Контент-завод под ключ'
  const description = meta?.description ?? 'Запускаем контент-заводы для бизнеса. Полный цикл от стратегии до публикации на десятках аккаунтов.'
  const image = meta?.ogImage && typeof meta.ogImage === 'object' ? (meta.ogImage as { url?: string }).url : undefined
  return { title, description, openGraph: { title, description, images: image ? [image] : undefined } }
}

export default async function ServicesPage() {
  const page = await getServicesPage()
  const p = page as any

  const hero = p?.hero
  const whatIs = p?.whatIs
  const formatsData = p?.formats
  const stagesData = p?.stages
  const scalingData = p?.scaling
  const cta = p?.cta

  const formats = formatsData?.items?.length ? formatsData.items.map((f: any) => ({
    icon: f.icon,
    title: f.title || '',
    description: f.description || '',
    platforms: (f.platforms || []).map((x: any) => x?.name || x).filter(Boolean),
  })) : DEFAULT_FORMATS

  const stages = stagesData?.items?.length ? stagesData.items.map((s: any) => ({
    number: s.number || '',
    title: s.title || '',
    description: s.description || '',
    duration: s.duration || '',
  })) : DEFAULT_STAGES

  const benefits = whatIs?.benefits?.length ? whatIs.benefits.map((b: any) => (typeof b === 'string' ? b : b?.item) || '').filter(Boolean) : DEFAULT_BENEFITS

  const scaling = scalingData?.items?.length ? scalingData.items.map((s: any) => ({
    icon: s.icon,
    title: s.title || '',
    description: s.description || '',
  })) : DEFAULT_SCALING

  const formulaValues = whatIs?.formulaValues || [
    { value: '50', label: 'роликов/мес' },
    { value: '20+', label: 'аккаунтов' },
    { value: '1000+', label: 'публикаций' },
    { value: '2М+', label: 'просмотров' },
  ]

  type FormatItem = { icon?: string; title: string; description: string; platforms: string[] }
  type StageItem = { number: string; title: string; description: string; duration: string }
  type ScaleItem = { icon?: string; title: string; description: string }

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 bg-neutral-950 text-white">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="heading-display text-white mb-6">
              {hero?.headline || 'Контент-завод'}
              {hero?.headlineHighlight && <><br /><span className="text-primary-500">{hero.headlineHighlight}</span></>}
            </h1>
            <p className="text-xl text-neutral-400 mb-8">
              {hero?.subheadline || 'Разворачиваем инфраструктуру для массовой дистрибуции контента — от производства роликов до публикации на десятках аккаунтов. Не надеемся на вирусность — гарантируем результат.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button href={hero?.primaryButtonLink || '/contact'} size="lg">
                {hero?.primaryButtonText || 'Получить консультацию'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button href={hero?.secondaryButtonLink || '/cases'} variant="outline" size="lg" className="border-neutral-700 text-white hover:border-neutral-500">
                {hero?.secondaryButtonText || 'Смотреть кейсы'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What is Content Factory */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="heading-2 text-neutral-900 mb-6">
                {whatIs?.title || 'Что такое контент-завод?'}
              </h2>
              <div className="space-y-4 mb-8">
                {(whatIs?.paragraphs || [{ text: 'Контент-завод — это инфраструктура для массового производства и дистрибуции короткого видеоконтента. Вместо того чтобы вести один блог и надеяться на вирусный ролик, мы создаём систему, которая гарантирует охваты.' }, { text: 'Принцип прост: 1 ролик × 20 уникальных версий × 20 аккаунтов = 400 публикаций с одного сценария. При конверсии 0.5% в просмотры это 2+ миллиона охвата ежемесячно.' }]).map((para: any, i: number) => (
                  <p key={i} className="text-lg text-neutral-600">{para?.text || ''}</p>
                ))}
              </div>
              <ul className="space-y-3">
                {benefits.map((benefit: string, index: number) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-neutral-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-neutral-100 rounded-2xl p-8">
              <div className="text-center mb-8">
                <p className="text-sm text-neutral-500 uppercase tracking-wider mb-2">Формула результата</p>
                <div className="text-4xl font-bold text-neutral-900">
                  1 → 20 → 400 → 2М+
                </div>
                <p className="text-neutral-500 mt-2">ролик → версий → публикаций → просмотров</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {formulaValues.slice(0, 4).map((fv: any, i: number) => (
                  <div key={i} className={`rounded-xl p-4 text-center ${i === 3 ? 'bg-primary-500' : 'bg-white'}`}>
                    <p className={`text-2xl font-bold ${i === 3 ? 'text-white' : 'text-neutral-900'}`}>{fv.value}</p>
                    <p className={`text-sm ${i === 3 ? 'text-primary-100' : 'text-neutral-500'}`}>{fv.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formats */}
      <section className="section bg-neutral-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="heading-2 text-neutral-900 mb-4">
              {formatsData?.title || 'Форматы контента'}
            </h2>
            <p className="text-lead max-w-2xl mx-auto">
              {formatsData?.subtitle || 'Работаем со всеми популярными платформами короткого видео'}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(formats as FormatItem[]).map((format, index) => (
              <div key={index} className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4">
                  <IconByName name={format.icon} className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="heading-4 text-neutral-900 mb-2">{format.title}</h3>
                <p className="text-neutral-600 text-sm mb-4">{format.description}</p>
                <div className="flex flex-wrap gap-2">
                  {format.platforms.map((platform: string, i: number) => (
                    <span key={i} className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full">{platform}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stages */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="heading-2 text-neutral-900 mb-4">
              {stagesData?.title || 'Этапы работы'}
            </h2>
            <p className="text-lead max-w-2xl mx-auto">
              {stagesData?.subtitle || 'От первого созвона до стабильного потока охватов — 4-6 недель'}
            </p>
          </div>
          <div className="space-y-6">
            {(stages as StageItem[]).map((stage, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl bg-neutral-50 border border-neutral-200 hover:border-neutral-300 transition-colors">
                <div className="flex-shrink-0">
                  <span className="text-5xl font-bold text-primary-500">{stage.number}</span>
                </div>
                <div className="flex-grow">
                  <h3 className="heading-4 text-neutral-900 mb-2">{stage.title}</h3>
                  <p className="text-neutral-600">{stage.description}</p>
                </div>
                <div className="flex-shrink-0 md:text-right">
                  <span className="inline-block px-3 py-1 bg-neutral-200 text-neutral-700 text-sm rounded-full">{stage.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scaling */}
      <section className="section bg-neutral-950 text-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="heading-2 text-white mb-4">
              {scalingData?.title || 'Масштабирование без потолка'}
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              {scalingData?.subtitle || 'Контент-завод легко масштабируется: больше аккаунтов, больше роликов, больше платформ — больше охватов и лидов'}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(scaling as ScaleItem[]).map((item, index) => (
              <div key={index} className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
                <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center mb-4">
                  <IconByName name={item.icon} className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-neutral-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-hero bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-1 text-neutral-900 mb-6">
              {cta?.headline || 'Готовы запустить'}
              {cta?.headlineHighlight && <><br /><span className="text-primary-500">{cta.headlineHighlight}</span></>}
            </h2>
            <p className="text-xl text-neutral-600 mb-10">
              {cta?.text || 'Получите бесплатную консультацию и узнайте, сколько просмотров и лидов вы можете получать ежемесячно.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href={cta?.primaryButtonLink || '/contact'} size="lg">
                {cta?.primaryButtonText || 'Получить консультацию'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button href={cta?.secondaryButtonLink || '/pricing'} variant="outline" size="lg">
                {cta?.secondaryButtonText || 'Смотреть тарифы'}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
