import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'
import { StickyCta } from './_components/StickyCta'

export const metadata = {
  title: 'Система масштабирования SMM — Content Hunter',
  description: 'Загружай ролики — платформа распространяет их по десяткам прогретых аккаунтов автоматически. Гарантия просмотров в договоре.',
}

export default function FarmPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-neutral-950 text-white overflow-hidden">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="heading-display text-white mb-6 break-words !text-4xl md:!text-7xl">
              Вы недополучаете ×10–30 охвата с каждого ролика
            </h1>
            <p className="text-xl text-neutral-400 mb-4">
              Пока вы публикуете ролик в 1 аккаунт, его можно масштабировать в десятки аккаунтов и получать в разы больше просмотров с тем же контентом.
            </p>
            <p className="text-xl text-neutral-400 mb-8">
              Проверьте, какой охват может давать ваша ниша:
            </p>
            <ul className="space-y-2 mb-10 text-neutral-300 text-lg">
              {[
                'Cколько аккаунтов нужно',
                'Cколько публикаций можно масштабировать',
                'Rакой охват может давать система',
                'Cколько стоит запуск',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-primary-500 mt-1">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-neutral-400 mb-10">
              Иногда расчёт показывает, что масштабирование не даст эффекта. И это лучше узнать до запуска.
            </p>
            <StickyCta 
  href="https://sbsite.pro//eu_site_calc_1" 
  label="Рассчитать для моей ниши" 
  stickyLabel="Рассчитать для моей ниши"
/>
          </div>
        </div>
      </section>

      {/* Ceiling section */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="heading-1 text-neutral-900 mb-10">
              Один аккаунт — потолок. Система аккаунтов — рост.
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="p-8 rounded-2xl bg-neutral-100 border border-neutral-200">
                <p className="text-sm font-medium text-neutral-500 uppercase tracking-widest mb-4">
                  Сейчас у вас
                </p>
                <p className="text-2xl font-semibold text-neutral-900">
                  30 роликов в месяц
                </p>
                <p className="text-4xl font-bold text-neutral-400 mt-2">
                  = 30 000 просмотров
                </p>
              </div>
              <div className="p-8 rounded-2xl bg-neutral-950 border border-neutral-800 text-white">
                <p className="text-sm font-medium text-primary-400 uppercase tracking-widest mb-4">
                  С нашей платформой
                </p>
                <p className="text-lg text-neutral-300">
                  30 роликов × 30 копий × 30 аккаунтов
                </p>
                <p className="text-4xl font-bold text-white mt-2">
                  = от 1 000 000 просмотров
                </p>
              </div>
            </div>

            <p className="text-xl text-neutral-600 mb-8">
              Почему вы сейчас упираетесь в потолок
            </p>
            <ul className="space-y-2 mb-10 text-neutral-600 text-lg">
              {[
                '1 аккаунт ограничивает охват',
                'Алгоритмы не масштабируют один источник',
                'Даже хороший ролик быстро умирает',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-primary-500 mt-1">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <StickyCta 
  href="https://sbsite.pro//eu_site_calc_1" 
  label="Сделать расчеты"
  stickyLabel="Сделать расчеты"
/>
          </div>
        </div>
      </section>
    </>
  )
}
