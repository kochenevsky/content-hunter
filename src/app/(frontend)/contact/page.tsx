import type { Metadata } from 'next'
import { ContactForm } from '@/components/forms/ContactForm'
import { MessageCircle, Mail, MapPin, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Консультация — Связаться с нами',
  description: 'Получите бесплатную консультацию по запуску контент-завода. Ответим в течение 2 часов.',
}

const contacts = [
  {
    icon: MessageCircle,
    title: 'Telegram',
    value: '@contenthunter',
    href: 'https://t.me/contenthunter',
    description: 'Основной канал связи',
  },
  {
    icon: Mail,
    title: 'Email',
    value: 'hello@contenthunter.ru',
    href: 'mailto:hello@contenthunter.ru',
    description: 'Для официальных запросов',
  },
  {
    icon: MapPin,
    title: 'География',
    value: 'Россия, СНГ, MENA',
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

const guarantees = [
  'Бесплатный аудит вашего контента',
  'Расчёт потенциальных охватов',
  'Индивидуальная стратегия',
  'KPI в договоре',
]

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-neutral-950 text-white">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="heading-display text-white mb-6">
              Получите
              <br />
              <span className="text-primary-500">консультацию</span>
            </h1>
            <p className="text-xl text-neutral-400">
              Расскажите о вашем проекте, и мы подготовим индивидуальное 
              предложение с расчётом потенциальных охватов и стоимости.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Form */}
            <div>
              <h2 className="heading-2 text-neutral-900 mb-6">
                Оставьте заявку
              </h2>
              <p className="text-neutral-600 mb-8">
                Заполните форму, и мы свяжемся с вами в течение 2 часов 
                в рабочее время.
              </p>
              
              <ContactForm />
            </div>

            {/* Sidebar */}
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
