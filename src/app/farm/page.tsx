import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'
import { StickyCta } from './_components/StickyCta'

export const metadata = {
  title: 'Контент-ферма — масштабируй SMM',
  description: 'Система публикации рилсов через сеть аккаунтов. Гарантируем просмотры в договоре.',
}

export default function FarmPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-neutral-950 text-white overflow-hidden">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="heading-display text-white mb-6 break-words !text-4xl md:!text-7xl">
              Масштабируйте свой SMM через контент-ферму
            </h1>
            <p className="text-xl text-neutral-400 mb-4">
              Ведёте блог и публикуете классные рилсы, но набирается мало просмотров?
            </p>
            <p className="text-xl text-neutral-400 mb-8">
              Контент-ферма — это система, в которой ваши рилсы публикуются через сеть аккаунтов
              и набирают кратно больше просмотров.
            </p>
            <ul className="space-y-2 mb-10 text-neutral-300 text-lg">
              {[
                'Регистрируем 30+ аккаунтов',
                'Настраиваем их под вашу ЦА',
                'Публикуем 1000+ роликов в месяц',
                'Гарантируем просмотры в договоре',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-primary-500 mt-1">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-neutral-400 mb-10">
              Без увеличения команды. Без хаоса. Сделаем всё под ключ, с отчётностью.
            </p>
            <StickyCta href="https://sbsite.pro//eu_site_calc_1" size="lg">
              Сделать расчёт стоимости
              <ArrowRight className="w-5 h-5 ml-2" />
            </StickyCta>
          </div>
        </div>
      </section>

      {/* Ceiling section */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="heading-1 text-neutral-900 mb-10">
              Вы упёрлись в потолок
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
                  С контент-фермой
                </p>
                <p className="text-lg text-neutral-300">
                  30 роликов × 30 копий × 30 аккаунтов
                </p>
                <p className="text-4xl font-bold text-white mt-2">
                  = 1 000 000 просмотров
                </p>
              </div>
            </div>

            <p className="text-xl text-neutral-600 mb-8">
              Воспользуйтесь нашим калькулятором, чтобы рассчитать:
            </p>
            <ul className="space-y-2 mb-10 text-neutral-600 text-lg">
              {[
                'Сколько аккаунтов нужно в вашей нише',
                'Сколько будет публикаций каждый месяц',
                'Какие охваты и просмотры даст система',
                'Какие бюджеты нужны для запуска',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-primary-500 mt-1">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <StickyCta href="https://sbsite.pro//eu_site_calc_1" size="lg">
              Получить калькулятор
              <ArrowRight className="w-5 h-5 ml-2" />
            </StickyCta>
          </div>
        </div>
      </section>
    </>
  )
}
