import Link from 'next/link'
import { UtmLink } from '@/components/ui/UtmLink'
import { MessageCircle, Send, ExternalLink, FileSpreadsheet, Presentation } from 'lucide-react'

const defaultNavigation = [
  { name: 'Услуги', href: '/services' },
  { name: 'Кейсы', href: '/cases' },
  { name: 'Тарифы', href: '/pricing' },
  { name: 'Блог', href: '/blog' },
  { name: 'О нас', href: '/about' },
  { name: 'FAQ', href: '/faq' },
]

// Фоллбэк для материалов
const defaultMaterials = [
  { name: 'Презентация', href: 'https://gamma.app/docs/Content-Hunter-20-ta6xnap4ulyonku?mode=doc', icon: Presentation },
  { name: 'Прайс и кейсы', href: 'https://docs.google.com/spreadsheets/d/1axwH_4ByTRGrBneCOP18ARJgsJNqXnzzxBXLdTFph9s/edit?gid=1037848601', icon: FileSpreadsheet },
]

const socialIcons: Record<string, typeof Send> = {
  telegram: Send,
  whatsapp: MessageCircle,
}

interface FooterProps {
  data?: {
    description?: string
    navigation?: Array<{ label: string; link: string }>
    materials?: Array<{ label: string; link: string }>
    social?: Array<{ platform: string; url: string }>
    copyright?: string
  } | null
}

export function Footer({ data }: FooterProps) {
  // Используем данные из БД или фоллбэк
  const navigation = data?.navigation?.length
    ? data.navigation.map(item => ({ name: item.label, href: item.link }))
    : defaultNavigation

  const description = data?.description || 'Контент-завод под ключ. Масштабируем охваты через сетку аккаунтов.'

  const social = data?.social?.length
    ? data.social.map(item => ({
        name: item.platform,
        href: item.url || '#',
        icon: socialIcons[item.platform] || Send,
      }))
    : [
        { name: 'Telegram', href: '#', icon: Send },
        { name: 'WhatsApp', href: '#', icon: MessageCircle },
      ]

  return (
    <footer className="bg-neutral-950 text-white">
      <div className="container py-16 md:py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4">Content Hunter</h3>
            <p className="text-neutral-400 max-w-xs">
              {description}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">
              Навигация
            </h4>
            <ul className="space-y-3">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-neutral-300 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Материалы (из админки или фоллбэк) */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">
              Материалы
            </h4>
            <ul className="space-y-3">
              {(data?.materials?.length ? data.materials.map((item, i) => ({
                name: item.label,
                href: item.link,
                icon: defaultMaterials[i]?.icon ?? FileSpreadsheet,
              })) : defaultMaterials).map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.name}>
                    <UtmLink
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-neutral-300 hover:text-white transition-colors"
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.name}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                    </UtmLink>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">
              Контакты
            </h4>
            <div className="flex gap-4">
              {social.map((item) => {
                const Icon = item.icon
                return (
                  <UtmLink
                    key={item.name}
                    href={item.href}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="sr-only">{item.name}</span>
                  </UtmLink>
                )
              })}
            </div>
            <p className="text-neutral-500 text-xs mt-2">Telegram-бот, Telegram-менеджер — контакт в заявке</p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-500 text-sm">
            {data?.copyright || `© ${new Date().getFullYear()} Content Hunter. Все права защищены.`}
          </p>
          <p className="text-neutral-500 text-sm">
            ОАО «Дженго»
          </p>
        </div>
      </div>
    </footer>
  )
}
