import type { Metadata } from 'next'
import { getTeam, getAboutPage } from '@/lib/payload-data'
import { Button } from '@/components/ui/Button'
import { ArrowRight, MapPin, Users } from 'lucide-react'
import { IconByName } from '@/components/ui/IconByName'

export const revalidate = 60

const DEFAULT_VALUES = [
  { icon: 'Target', title: 'Результат, а не процесс', description: 'Фокус на метриках: охваты, лиды, продажи. Не на количестве постов или красоте отчётов.' },
  { icon: 'Zap', title: 'Системный подход', description: 'Не надеемся на удачу и вирусность. Строим систему, которая даёт предсказуемый результат.' },
  { icon: 'Users', title: 'Партнёрство', description: 'Работаем как часть вашей команды. Погружаемся в бизнес и становимся заинтересованы в результате.' },
  { icon: 'MapPin', title: 'Глобальность', description: 'Работаем с клиентами из России, СНГ, MENA, LATAM и Европы. Контент на любых языках.' },
]

const DEFAULT_STATS = [
  { value: '50+', label: 'Запущенных проектов' },
  { value: '20М+', label: 'Просмотров в месяц' },
  { value: '15+', label: 'Ниш клиентов' },
  { value: '8', label: 'Стран присутствия' },
]

const DEFAULT_REGIONS = ['Россия', 'СНГ (Казахстан, Беларусь)', 'MENA (ОАЭ, Дубай)', 'LATAM', 'Европа', 'США']

export async function generateMetadata(): Promise<Metadata> {
  const page = await getAboutPage()
  const meta = (page as any)?.meta
  const title = meta?.title ?? 'О нас — Команда Content Hunter'
  const description = meta?.description ?? 'Команда Content Hunter: эксперты по контент-заводам и массовой дистрибуции видеоконтента.'
  const image = meta?.ogImage && typeof meta.ogImage === 'object' ? (meta.ogImage as { url?: string }).url : undefined
  return { title, description, openGraph: { title, description, images: image ? [image] : undefined } }
}

export default async function AboutPage() {
  const [team, page] = await Promise.all([getTeam(), getAboutPage()])
  const p = page as any

  const hero = p?.hero
  const statsData = p?.stats?.items || DEFAULT_STATS
  const story = p?.story
  const valuesData = p?.values
  const geographyData = p?.geography
  const company = p?.company
  const cta = p?.cta

  const values = valuesData?.items?.length ? valuesData.items : DEFAULT_VALUES
  const regions = geographyData?.regions?.length ? geographyData.regions.map((r: any) => r?.name || r).filter(Boolean) : DEFAULT_REGIONS

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-neutral-950 text-white">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="heading-display text-white mb-6">
              {hero?.headline || 'О нас'}
            </h1>
            <p className="text-xl text-neutral-400">
              {hero?.subheadline || 'Content Hunter — конструктор контент-заводов и контент-ферм «под ключ». Любой бизнес или эксперт может прийти к нам, и мы возьмём на себя всю систему контента и трафика, без необходимости собирать команду внутри.'}
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white border-b border-neutral-200">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {statsData.map((stat: any, index: number) => (
              <div key={index} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-neutral-900">{stat.value}</p>
                <p className="text-neutral-600 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="heading-2 text-neutral-900 mb-6">
                {story?.title || 'Как мы начали'}
              </h2>
              <div className="space-y-4 text-neutral-600">
                {(story?.paragraphs || [
                  { text: 'Content Hunter появился из практики. Мы годами занимались SMM и видеопродакшеном, пока не поняли: классический подход «один блог — надежда на вирусность» больше не работает.' },
                  { text: 'Алгоритмы платформ стали жёстче, конкуренция за внимание выросла в десятки раз. Органический охват одного поста упал до 5-10% от подписчиков. Бизнесу нужен был другой подход.' },
                  { text: 'Мы начали экспериментировать с сетками аккаунтов, уникализацией контента, массовой дистрибуцией. И это сработало. Охваты стали предсказуемыми, лиды — стабильными.' },
                  { text: 'Так родилась концепция контент-завода: система, которая гарантирует результат за счёт объёма, а не надежды на удачу.' },
                ]).map((para: any, i: number) => (
                  <p key={i} className={i === 3 ? 'font-medium text-neutral-900' : ''}>{para?.text || ''}</p>
                ))}
              </div>
            </div>
            <div className="bg-neutral-100 rounded-2xl aspect-square flex items-center justify-center">
              <span className="text-neutral-400">Фото команды</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-neutral-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="heading-2 text-neutral-900 mb-4">
              {valuesData?.title || 'Наши принципы'}
            </h2>
            <p className="text-lead max-w-2xl mx-auto">
              {valuesData?.subtitle || 'То, во что мы верим и как работаем с каждым клиентом'}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value: any, index: number) => (
              <div key={index} className="p-6 rounded-2xl bg-white border border-neutral-200">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4">
                  <IconByName name={value.icon} className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="heading-4 text-neutral-900 mb-2">{value.title}</h3>
                <p className="text-neutral-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="heading-2 text-neutral-900 mb-4">Команда</h2>
            <p className="text-lead max-w-2xl mx-auto">
              Эксперты, которые строят контент-заводы для вашего бизнеса
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member: any) => (
              <div key={member.id} className="text-center">
                <div className="w-32 h-32 rounded-full bg-neutral-200 mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-12 h-12 text-neutral-400" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-1">{member.name}</h3>
                <p className="text-primary-600 text-sm mb-3">{member.role}</p>
                {member.bio && typeof member.bio === 'string' && (
                  <p className="text-neutral-600 text-sm mb-3">{member.bio}</p>
                )}
                {member.telegram && (
                  <a href={`https://t.me/${member.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-500 hover:text-primary-600 transition-colors">
                    {member.telegram}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Geography */}
      <section className="section bg-neutral-950 text-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="heading-2 text-white mb-6">
                {geographyData?.title || 'География'}
              </h2>
              <p className="text-xl text-neutral-400 mb-8">
                {geographyData?.text || 'Работаем по всему миру. Готовы к проектам на русском и английском языках.'}
              </p>
              <div className="flex flex-wrap gap-3">
                {regions.map((region: string, index: number) => (
                  <span key={index} className="px-4 py-2 rounded-full bg-neutral-800 text-neutral-300 text-sm">{region}</span>
                ))}
              </div>
            </div>
            <div className="bg-neutral-900 rounded-2xl aspect-video flex items-center justify-center border border-neutral-800">
              <MapPin className="w-16 h-16 text-neutral-700" />
            </div>
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <h2 className="heading-2 text-neutral-900 text-center mb-8">
              {company?.title || 'Реквизиты'}
            </h2>
            <div className="p-8 rounded-2xl bg-neutral-50 border border-neutral-200">
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-neutral-500 mb-1">Компания</p>
                  <p className="font-medium text-neutral-900">{company?.companyName || 'ОАО «Дженго»'}</p>
                </div>
                <div>
                  <p className="text-neutral-500 mb-1">Бренд</p>
                  <p className="font-medium text-neutral-900">{company?.brand || 'Content Hunter'}</p>
                </div>
                <div>
                  <p className="text-neutral-500 mb-1">Основатель</p>
                  <p className="font-medium text-neutral-900">{company?.founder || 'Кирилл Попов'}</p>
                </div>
                <div>
                  <p className="text-neutral-500 mb-1">Год основания</p>
                  <p className="font-medium text-neutral-900">{company?.year || '2022'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-neutral-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-1 text-neutral-900 mb-6">
              {cta?.headline || 'Готовы познакомиться?'}
            </h2>
            <p className="text-xl text-neutral-600 mb-10">
              {cta?.text || 'Получите бесплатную консультацию и узнайте, как мы можем помочь вашему бизнесу.'}
            </p>
            <Button href={cta?.buttonLink || '/contact'} size="lg">
              {cta?.buttonText || 'Получить консультацию'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
