import { AlertTriangle, TrendingDown, Clock } from 'lucide-react'

const problems = [
  {
    icon: TrendingDown,
    title: 'Охваты падают',
    description: 'Контента стало слишком много. Один аккаунт не даёт нужного охвата.',
  },
  {
    icon: Clock,
    title: 'Ждёте вирусного ролика',
    description: 'Вероятность «залёта» — 0,00001%. Это лотерея, а не стратегия.',
  },
  {
    icon: AlertTriangle,
    title: 'SMM не окупается',
    description: 'Бюджет уходит, а лидов и продаж с контента нет.',
  },
]

export function ProblemSection() {
  return (
    <section className="section bg-white">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="heading-2 text-neutral-900 mb-4">
            Почему ваш SMM не приносит результатов
          </h2>
          <p className="text-lead">
            Контент перестал быть дефицитом. Его слишком много.
            Все ждут один вирусный ролик и надеются на «залёт».
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => {
            const Icon = problem.icon
            return (
              <div
                key={index}
                className="p-8 rounded-2xl bg-neutral-50 border border-neutral-200"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="heading-4 text-neutral-900 mb-3">
                  {problem.title}
                </h3>
                <p className="text-neutral-600">
                  {problem.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
