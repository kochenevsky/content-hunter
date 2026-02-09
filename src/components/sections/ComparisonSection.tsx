import { Check, X } from 'lucide-react'

const comparisons = [
  {
    title: 'SMM-агентства',
    description: 'Ведут 1-2 блога, публикуют 1-2 поста в день и надеются на «вирусный» эффект',
    cons: [
      'Долго ждать результата',
      'Непредсказуемые охваты',
      'Часто нецелевая аудитория',
    ],
  },
  {
    title: 'Видеопродакшены',
    description: 'Создают только видеоконтент без дистрибуции и аналитики',
    cons: [
      'Нет публикации',
      'Нет прогрева аккаунтов',
      'Нет работы на результат',
    ],
  },
  {
    title: 'Фрилансеры',
    description: 'Нет технологической инфраструктуры и системного подхода',
    cons: [
      'Хаотичные публикации',
      'Нестабильное качество',
      'Нет масштабирования',
    ],
  },
]

const ourAdvantages = [
  'Массовая дистрибуция через сетку аккаунтов',
  'Полный цикл: от стратегии до аналитики',
  'Гарантия охватов в договоре',
  'Фабричный подход = предсказуемый результат',
  'Быстрый старт: первые публикации через 1-2 недели',
]

export function ComparisonSection() {
  return (
    <section className="section bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="heading-2 text-neutral-900 mb-4">
            Чем мы отличаемся
          </h2>
          <p className="text-lead max-w-2xl mx-auto">
            Content Hunter — это не SMM-агентство и не видеопродакшен.
            Это контент-завод с гарантией результата.
          </p>
        </div>

        {/* Competitors */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {comparisons.map((item, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200"
            >
              <h3 className="heading-4 text-neutral-900 mb-2">
                {item.title}
              </h3>
              <p className="text-neutral-600 text-sm mb-4">
                {item.description}
              </p>
              <ul className="space-y-2">
                {item.cons.map((con, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-neutral-500">
                    <X className="w-4 h-4 text-red-500" />
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Our advantages */}
        <div className="p-8 rounded-2xl bg-neutral-950 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center gap-8">
            <div className="lg:w-1/3">
              <h3 className="heading-3 text-white mb-2">Content Hunter</h3>
              <p className="text-neutral-400">
                Системный подход к контенту с гарантией результата
              </p>
            </div>
            <div className="lg:w-2/3">
              <ul className="grid md:grid-cols-2 gap-4">
                {ourAdvantages.map((advantage, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-neutral-300">{advantage}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
