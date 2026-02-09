import type { Metadata } from 'next'
import { Button } from '@/components/ui/Button'
import { 
  ArrowRight, 
  Check, 
  Video, 
  Users, 
  BarChart3, 
  Zap,
  Target,
  Repeat,
  TrendingUp,
  Globe
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Услуги — Контент-завод под ключ',
  description: 'Запускаем контент-заводы для бизнеса. Полный цикл от стратегии до публикации на десятках аккаунтов.',
}

const formats = [
  {
    icon: Video,
    title: 'Reels / Stories',
    description: 'Instagram и Facebook — основной канал для B2C',
    platforms: ['Instagram', 'Facebook'],
  },
  {
    icon: Zap,
    title: 'Shorts',
    description: 'YouTube Shorts — быстрорастущий формат с огромным охватом',
    platforms: ['YouTube'],
  },
  {
    icon: TrendingUp,
    title: 'TikTok',
    description: 'Вирусный потенциал и молодая платежеспособная аудитория',
    platforms: ['TikTok'],
  },
  {
    icon: Globe,
    title: 'VK Клипы',
    description: 'Для российской аудитории и B2B-сегмента',
    platforms: ['VK'],
  },
]

const stages = [
  {
    number: '01',
    title: 'Аудит и стратегия',
    description: 'Анализируем вашу нишу, конкурентов, целевую аудиторию. Строим контент-стратегию с конкретными KPI.',
    duration: '3-5 дней',
  },
  {
    number: '02',
    title: 'Создание инфраструктуры',
    description: 'Разворачиваем сетку аккаунтов, настраиваем автоматизацию публикаций, прогреваем профили.',
    duration: '1-2 недели',
  },
  {
    number: '03',
    title: 'Производство контента',
    description: 'Создаём сценарии, снимаем или генерируем видео, монтируем с уникализацией под каждый аккаунт.',
    duration: 'Постоянно',
  },
  {
    number: '04',
    title: 'Массовая дистрибуция',
    description: 'Публикуем контент через сетку аккаунтов на всех платформах по оптимальному расписанию.',
    duration: 'Ежедневно',
  },
  {
    number: '05',
    title: 'Аналитика и оптимизация',
    description: 'Отслеживаем метрики, A/B тестируем форматы, масштабируем то, что работает.',
    duration: 'Еженедельно',
  },
]

const benefits = [
  'Гарантия охватов в договоре',
  'Первые результаты через 1.5 месяца',
  'Полный цикл: от идеи до аналитики',
  'Работаем на вашу воронку продаж',
  'Масштабирование без потери качества',
  'Прозрачная отчётность',
]

const scaling = [
  {
    icon: Users,
    title: '20+ аккаунтов',
    description: 'Сетка прогретых аккаунтов на каждой платформе',
  },
  {
    icon: Repeat,
    title: '1000+ публикаций/мес',
    description: 'Массовая дистрибуция одного ролика в разных версиях',
  },
  {
    icon: Target,
    title: '1М+ просмотров',
    description: 'Гарантированный охват за счёт объёма публикаций',
  },
  {
    icon: BarChart3,
    title: 'ROI tracking',
    description: 'Отслеживание конверсий и влияния на продажи',
  },
]

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 bg-neutral-950 text-white">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="heading-display text-white mb-6">
              Контент-завод
              <br />
              <span className="text-primary-500">под ключ</span>
            </h1>
            <p className="text-xl text-neutral-400 mb-8">
              Разворачиваем инфраструктуру для массовой дистрибуции контента — 
              от производства роликов до публикации на десятках аккаунтов.
              Не надеемся на вирусность — гарантируем результат.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button href="/contact" size="lg">
                Получить консультацию
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button href="/cases" variant="outline" size="lg" className="border-neutral-700 text-white hover:border-neutral-500">
                Смотреть кейсы
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
                Что такое контент-завод?
              </h2>
              <p className="text-lg text-neutral-600 mb-6">
                Контент-завод — это инфраструктура для массового производства и дистрибуции 
                короткого видеоконтента. Вместо того чтобы вести один блог и надеяться на 
                вирусный ролик, мы создаём систему, которая гарантирует охваты.
              </p>
              <p className="text-lg text-neutral-600 mb-8">
                <strong className="text-neutral-900">Принцип прост:</strong> 1 ролик × 20 уникальных версий × 
                20 аккаунтов = 400 публикаций с одного сценария. При конверсии 0.5% в 
                просмотры это 2+ миллиона охвата ежемесячно.
              </p>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
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
                <p className="text-sm text-neutral-500 uppercase tracking-wider mb-2">
                  Формула результата
                </p>
                <div className="text-4xl font-bold text-neutral-900">
                  1 → 20 → 400 → 2М+
                </div>
                <p className="text-neutral-500 mt-2">ролик → версий → публикаций → просмотров</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-neutral-900">50</p>
                  <p className="text-sm text-neutral-500">роликов/мес</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-neutral-900">20+</p>
                  <p className="text-sm text-neutral-500">аккаунтов</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-neutral-900">1000+</p>
                  <p className="text-sm text-neutral-500">публикаций</p>
                </div>
                <div className="bg-primary-500 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-white">2М+</p>
                  <p className="text-sm text-primary-100">просмотров</p>
                </div>
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
              Форматы контента
            </h2>
            <p className="text-lead max-w-2xl mx-auto">
              Работаем со всеми популярными платформами короткого видео
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {formats.map((format, index) => {
              const Icon = format.icon
              return (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="heading-4 text-neutral-900 mb-2">
                    {format.title}
                  </h3>
                  <p className="text-neutral-600 text-sm mb-4">
                    {format.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {format.platforms.map((platform, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stages */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="heading-2 text-neutral-900 mb-4">
              Этапы работы
            </h2>
            <p className="text-lead max-w-2xl mx-auto">
              От первого созвона до стабильного потока охватов — 4-6 недель
            </p>
          </div>

          <div className="space-y-6">
            {stages.map((stage, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl bg-neutral-50 border border-neutral-200 hover:border-neutral-300 transition-colors"
              >
                <div className="flex-shrink-0">
                  <span className="text-5xl font-bold text-primary-500">
                    {stage.number}
                  </span>
                </div>
                <div className="flex-grow">
                  <h3 className="heading-4 text-neutral-900 mb-2">
                    {stage.title}
                  </h3>
                  <p className="text-neutral-600">
                    {stage.description}
                  </p>
                </div>
                <div className="flex-shrink-0 md:text-right">
                  <span className="inline-block px-3 py-1 bg-neutral-200 text-neutral-700 text-sm rounded-full">
                    {stage.duration}
                  </span>
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
              Масштабирование без потолка
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Контент-завод легко масштабируется: больше аккаунтов, больше роликов, 
              больше платформ — больше охватов и лидов
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {scaling.map((item, index) => {
              const Icon = item.icon
              return (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-neutral-400 text-sm">
                    {item.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-hero bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-1 text-neutral-900 mb-6">
              Готовы запустить
              <br />
              <span className="text-primary-500">контент-завод?</span>
            </h2>
            <p className="text-xl text-neutral-600 mb-10">
              Получите бесплатную консультацию и узнайте, сколько просмотров 
              и лидов вы можете получать ежемесячно.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/contact" size="lg">
                Получить консультацию
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button href="/pricing" variant="outline" size="lg">
                Смотреть тарифы
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
