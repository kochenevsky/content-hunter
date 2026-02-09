const stats = [
  { value: '50+', label: 'Запущенных проектов' },
  { value: '20М+', label: 'Просмотров в месяц' },
  { value: '15+', label: 'Ниш клиентов' },
  { value: '8', label: 'Стран присутствия' },
]

export function StatsSection() {
  return (
    <section className="py-16 bg-white border-y border-neutral-200">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-neutral-900">
                {stat.value}
              </p>
              <p className="text-neutral-600 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
