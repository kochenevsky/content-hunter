import Link from 'next/link'
import { MessageCircle, Send } from 'lucide-react'

const navigation = [
  { name: 'Услуги', href: '/services' },
  { name: 'Кейсы', href: '/cases' },
  { name: 'Тарифы', href: '/pricing' },
  { name: 'Блог', href: '/blog' },
  { name: 'О нас', href: '/about' },
  { name: 'FAQ', href: '/faq' },
]

const social = [
  { name: 'Telegram', href: '#', icon: Send },
  { name: 'WhatsApp', href: '#', icon: MessageCircle },
]

export function Footer() {
  return (
    <footer className="bg-neutral-950 text-white">
      <div className="container py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4">Content Hunter</h3>
            <p className="text-neutral-400 max-w-xs">
              Контент-завод под ключ. Масштабируем охваты через сетку аккаунтов.
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

          {/* Contacts */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">
              Контакты
            </h4>
            <div className="flex gap-4">
              {social.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="sr-only">{item.name}</span>
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-500 text-sm">
            © {new Date().getFullYear()} Content Hunter. Все права защищены.
          </p>
          <p className="text-neutral-500 text-sm">
            ОАО «Дженго»
          </p>
        </div>
      </div>
    </footer>
  )
}
