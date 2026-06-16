import Link from 'next/link'
import { UtmLink } from '@/components/ui/UtmLink'
import { Send, ExternalLink, FileSpreadsheet, Presentation, Instagram, Youtube } from 'lucide-react'

export function Footer() {
  // ВСЁ ЗАХАРДКОЖЕНО - данные из админки НЕ ИСПОЛЬЗУЮТСЯ
  return (
    <footer className="bg-neutral-950 text-white">
      <div className="container py-16 md:py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand - Content Hunter */}
          <div>
            <h3 className="text-xl font-bold mb-4">Content Hunter</h3>
            <p className="text-neutral-400 max-w-xs">
              Контент-ферма в аренду. Система автоматического и массового распространения контента в соцсетях.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">
              Навигация
            </h4>
            <ul className="space-y-3">
              <li>
                <a className="text-neutral-300 hover:text-white transition-colors" href="/#video-examples">
                  Кейсы
                </a>
              </li>
              <li>
                <a className="text-neutral-300 hover:text-white transition-colors" href="/#comparison">
                  О нас
                </a>
              </li>
              <li>
                <a className="text-neutral-300 hover:text-white transition-colors" href="/#pricing">
                  Тарифы
                </a>
              </li>
              <li>
                <a className="text-neutral-300 hover:text-white transition-colors" href="/faq">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Materials */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">
              Материалы
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://contenthunter.ru/farm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-neutral-300 hover:text-white transition-colors"
                >
                  <Presentation className="w-4 h-4 flex-shrink-0" />
                  <span>Экскурсия</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://sbsite.pro//ru_site_ch_1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-neutral-300 hover:text-white transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 flex-shrink-0" />
                  <span>Калькулятор стоимости</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">
              Соц сети
            </h4>
            <div className="flex gap-4">
              <a
                href="https://t.me/baristasss"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors"
              >
                <Send className="w-5 h-5" />
                <span className="sr-only">telegram</span>
              </a>
              <a
                href="https://www.instagram.com/popov__kirilll/"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors"
              >
                <Instagram className="w-5 h-5" />
                <span className="sr-only">instagram</span>
              </a>
              <a
                href="https://www.youtube.com/@Content_Hunter_global/"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors"
              >
                <Youtube className="w-5 h-5" />
                <span className="sr-only">youtube</span>
              </a>
            </div>
          </div>
        </div>
        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-500 text-sm">
            © 2026 Content Hunter. Все права защищены.
          </p>
          <a
            href="https://contenthunter.ru/offer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 hover:text-white text-sm transition-colors"
          >
            Оферта
          </a>
        </div>
      </div>
    </footer>
  )
}
