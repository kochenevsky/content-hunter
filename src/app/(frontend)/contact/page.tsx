import type { Metadata } from 'next'
import { MessageCircle, MapPin, Clock } from 'lucide-react'
import { getPageBySlug, getSettings } from '@/lib/payload-data'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('contact')
  const meta = (page as any)?.meta
  const title = meta?.title ?? 'Контакты — Связаться с нами'
  const description = meta?.description ?? 'Свяжитесь с нами по Telegram, WhatsApp. Ответим в течение 2 часов.'
  const image = meta?.ogImage && typeof meta.ogImage === 'object' ? (meta.ogImage as { url?: string }).url : undefined
  return { title, description, openGraph: { title, description, images: image ? [image] : undefined } }
}

function buildContacts(settings: Awaited<ReturnType<typeof getSettings>>) {
  const c = settings?.contacts
  const fmt = (v: string) => v?.replace(/^@/, '').trim() || null
  return [
    {
      icon: MessageCircle,
      title: 'Telegram-бот',
      value: c?.telegramBot ? (c.telegramBot.startsWith('http') ? c.telegramBot : `@${fmt(c.telegramBot)}`) : 'Основной канал связи',
      href: c?.telegramBot ? (c.telegramBot.startsWith('http') ? c.telegramBot : `https://t.me/${fmt(c.telegramBot)}`) : null,
      description: c?.telegramBot ? 'Основной канал связи' : 'Ссылка будет отправлена после заявки',
    },
    {
      icon: MessageCircle,
      title: 'Telegram-менеджер',
      value: c?.telegram ? (c.telegram.startsWith('http') ? 'Telegram' : `@${fmt(c.telegram)}`) : 'Персональный контакт',
      href: c?.telegram ? (c.telegram.startsWith('http') ? c.telegram : `https://t.me/${fmt(c.telegram)}`) : null,
      description: c?.telegram ? 'Персональный контакт' : 'Контакт будет предоставлен',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      value: c?.whatsapp ? (c.whatsapp.startsWith('http') ? 'WhatsApp' : c.whatsapp) : 'Дополнительно',
      href: c?.whatsapp ? (c.whatsapp.startsWith('http') ? c.whatsapp : `https://wa.me/${c.whatsapp.replace(/\D/g, '')}`) : null,
      description: c?.whatsapp ? 'Дополнительно' : 'Контакт будет предоставлен',
    },
    {
      icon: MapPin,
      title: 'География',
      value: 'Россия, СНГ, MENA, LATAM, Европа, США',
      href: null,
      description: 'Работаем удалённо',
    },
    {
      icon: Clock,
      title: 'Время ответа',
      value: 'До 2 часов',
      href: null,
      description: 'В рабочее время',
    },
  ]
}

const guarantees = [
  'Бесплатный аудит вашего контента',
  'Расчёт потенциальных охватов',
  'Индивидуальная стратегия',
  'KPI в договоре',
]

export default async function ContactPage() {
  const [page, settings] = await Promise.all([
    getPageBySlug('contact'),
    getSettings(),
  ])

  const heroHeadline = (page as any)?.hero?.headline
  const heroSubheadline = (page as any)?.hero?.subheadline
  const contacts = buildContacts(settings)
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-neutral-950 text-white">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="heading-display text-white mb-6">
              {typeof heroHeadline === 'string' ? (
                heroHeadline
              ) : (
                <>
                  Получите
                  <br />
                  <span className="text-primary-500">консультацию</span>
                </>
              )}
            </h1>
            <p className="text-xl text-neutral-400">
              {heroSubheadline || 'Свяжитесь с нами по Telegram или WhatsApp — подготовим индивидуальное предложение с расчётом потенциальных охватов и стоимости.'}
            </p>
          </div>
        </div>
      </section>

      {/* Contacts Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-2xl">
            <div className="space-y-8">
              {/* Contacts */}
              <div className="p-8 rounded-2xl bg-neutral-50 border border-neutral-200">
                <h3 className="heading-4 text-neutral-900 mb-6">
                  Контакты
                </h3>
                <div className="space-y-6">
                  {contacts.map((contact, index) => {
                    const Icon = contact.icon
                    const Content = (
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white border border-neutral-200 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-neutral-600" />
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500">{contact.title}</p>
                          <p className="font-medium text-neutral-900">{contact.value}</p>
                          <p className="text-sm text-neutral-500">{contact.description}</p>
                        </div>
                      </div>
                    )
                    
                    if (contact.href) {
                      return (
                        <a
                          key={index}
                          href={contact.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block hover:bg-neutral-100 -mx-4 px-4 py-2 rounded-lg transition-colors"
                        >
                          {Content}
                        </a>
                      )
                    }
                    
                    return <div key={index}>{Content}</div>
                  })}
                </div>
              </div>

              {/* Guarantees */}
              <div className="p-8 rounded-2xl bg-neutral-950 text-white">
                <h3 className="text-xl font-semibold mb-6">
                  Что вы получите
                </h3>
                <ul className="space-y-4">
                  {guarantees.map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-neutral-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div className="p-8 rounded-2xl bg-neutral-50 border border-neutral-200">
                <h3 className="heading-4 text-neutral-900 mb-4">
                  Реквизиты
                </h3>
                <div className="text-sm text-neutral-600 space-y-1">
                  <p><strong>Компания:</strong> ОАО «Дженго»</p>
                  <p><strong>Бренд:</strong> Content Hunter</p>
                  <p><strong>Основатель:</strong> Кирилл Попов</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
