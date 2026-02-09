import { 
  ShoppingBag, 
  GraduationCap, 
  User, 
  Utensils, 
  Sparkles, 
  Plane,
  Building2,
  Stethoscope
} from 'lucide-react'

const niches = [
  { icon: ShoppingBag, name: 'E-commerce', description: 'Маркетплейсы, онлайн-магазины' },
  { icon: GraduationCap, name: 'Онлайн-школы', description: 'Курсы, образовательные проекты' },
  { icon: User, name: 'Эксперты', description: 'Коучи, консультанты, психологи' },
  { icon: Utensils, name: 'HoReCa', description: 'Рестораны, кафе, отели' },
  { icon: Sparkles, name: 'Beauty', description: 'Салоны красоты, косметология' },
  { icon: Plane, name: 'Тревел', description: 'Туризм, глэмпинги, агентства' },
  { icon: Building2, name: 'Недвижимость', description: 'Агентства, застройщики' },
  { icon: Stethoscope, name: 'Клиники', description: 'Медицинские центры, стоматологии' },
]

export function NichesSection() {
  return (
    <section className="section bg-neutral-50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="heading-2 text-neutral-900 mb-4">
            С кем мы работаем
          </h2>
          <p className="text-lead max-w-2xl mx-auto">
            B2C-бизнес с широкой аудиторией. Бюджет на маркетинг от 200 000 ₽/мес.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {niches.map((niche, index) => {
            const Icon = niche.icon
            return (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-primary-300 hover:shadow-md transition-all duration-300 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-neutral-700" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-1">
                  {niche.name}
                </h3>
                <p className="text-sm text-neutral-500">
                  {niche.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
