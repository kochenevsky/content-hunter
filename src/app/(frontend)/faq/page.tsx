import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { FAQAccordion } from '@/components/ui/FAQAccordion'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'FAQ — Частые вопросы',
  description: 'Ответы на частые вопросы о контент-заводе, процессе работы, гарантиях и стоимости.',
}

// Временные данные
const mockFAQ = [
  {
    id: '1',
    category: 'general',
    question: 'Что такое контент-завод?',
    answer: 'Контент-завод — это инфраструктура для массового производства и дистрибуции короткого видеоконтента. Вместо одного блога и надежды на вирусный ролик, мы создаём систему из десятков аккаунтов, которая гарантирует охваты за счёт объёма публикаций.',
    order: 1,
  },
  {
    id: '2',
    category: 'general',
    question: 'Чем вы отличаетесь от SMM-агентства?',
    answer: 'SMM-агентства ведут 1-2 блога и надеются на органический рост. Мы строим промышленную систему дистрибуции: один ролик превращаем в десятки уникальных версий и публикуем через сетку аккаунтов. Результат — гарантированные охваты, а не лотерея.',
    order: 2,
  },
  {
    id: '3',
    category: 'process',
    question: 'Как происходит процесс работы?',
    answer: 'Начинаем с аудита и стратегии (3-5 дней). Затем разворачиваем инфраструктуру: создаём и прогреваем аккаунты (1-2 недели). После этого запускаем производство контента и массовую публикацию. Первые результаты — через 1.5 месяца.',
    order: 3,
  },
  {
    id: '4',
    category: 'process',
    question: 'Кто создаёт контент?',
    answer: 'Контент создаёт наша команда: сценаристы, операторы, монтажёры. Для съёмок можем привлекать ваших спикеров или использовать AI-аватары и нейросети. Каждый ролик уникализируется под разные аккаунты.',
    order: 4,
  },
  {
    id: '5',
    category: 'results',
    question: 'Какие гарантии результата?',
    answer: 'Прописываем KPI по охватам в договоре. Если за оговоренный срок не достигаем целей — продлеваем работу бесплатно до достижения результата. Это возможно благодаря системному подходу: мы не надеемся на удачу, а работаем с математикой.',
    order: 5,
  },
  {
    id: '6',
    category: 'results',
    question: 'Через сколько будут первые результаты?',
    answer: 'Первые публикации — через 1-2 недели после старта. Стабильный поток охватов формируется к 1.5 месяцам. Полноценные результаты с аналитикой конверсий — через 2-3 месяца работы.',
    order: 6,
  },
  {
    id: '7',
    category: 'pricing',
    question: 'Сколько стоит запуск контент-завода?',
    answer: 'Стартовый тариф — от 150 000 ₽/мес. Включает 20 роликов, 10 аккаунтов и 500K+ просмотров. Для крупных проектов и агентств рассчитываем индивидуальную стоимость под задачи.',
    order: 7,
  },
  {
    id: '8',
    category: 'pricing',
    question: 'Что входит в стоимость?',
    answer: 'Полный цикл: стратегия и аудит, создание сценариев, производство роликов, уникализация контента, публикация через сетку аккаунтов, аналитика и оптимизация, отчётность и поддержка.',
    order: 8,
  },
  {
    id: '9',
    category: 'technical',
    question: 'На каких платформах работаете?',
    answer: 'Instagram Reels, TikTok, YouTube Shorts, VK Клипы, Facebook Reels. Можем добавить любую платформу под ваши задачи. Обычно работаем на 2-3 платформах одновременно.',
    order: 9,
  },
  {
    id: '10',
    category: 'technical',
    question: 'Как вы обходите ограничения платформ?',
    answer: 'Используем прогретые аккаунты, уникализируем каждый ролик (звук, визуал, текст), соблюдаем лимиты публикаций, работаем с разных устройств и геолокаций. Наш подход — масштабирование без нарушения правил платформ.',
    order: 10,
  },
  {
    id: '11',
    category: 'niches',
    question: 'С какими нишами работаете?',
    answer: 'B2C-бизнес с широкой аудиторией: e-commerce, онлайн-школы, beauty, HoReCa, недвижимость, туризм, эксперты и коучи. Минимальный бюджет на маркетинг — от 200 000 ₽/мес.',
    order: 11,
  },
  {
    id: '12',
    category: 'niches',
    question: 'Работаете ли с B2B?',
    answer: 'B2B — сложнее, но возможно. Нужна узкая специализация контента и таргетированная дистрибуция. Обсуждаем на консультации, подходит ли контент-завод для вашей B2B-ниши.',
    order: 12,
  },
]

const categories = [
  { id: 'general', label: 'Общие вопросы' },
  { id: 'process', label: 'Процесс работы' },
  { id: 'results', label: 'Результаты и гарантии' },
  { id: 'pricing', label: 'Стоимость' },
  { id: 'technical', label: 'Технические вопросы' },
  { id: 'niches', label: 'Ниши и клиенты' },
]

async function getFAQ() {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'faq',
      sort: 'order',
      limit: 100,
    })
    
    if (result.docs.length > 0) {
      return result.docs
    }
  } catch (error) {
    console.error('Error fetching FAQ:', error)
  }
  
  return mockFAQ
}

export default async function FAQPage() {
  const faqItems = await getFAQ()

  // Группируем по категориям
  const groupedFAQ = categories.map(category => ({
    ...category,
    items: faqItems.filter((item: any) => item.category === category.id),
  })).filter(group => group.items.length > 0)

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-neutral-950 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="heading-display text-white mb-6">
              Частые
              <br />
              <span className="text-primary-500">вопросы</span>
            </h1>
            <p className="text-xl text-neutral-400">
              Ответы на вопросы о контент-заводе, процессе работы, 
              гарантиях и стоимости.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto space-y-12">
            {groupedFAQ.map((group) => (
              <div key={group.id}>
                <h2 className="heading-3 text-neutral-900 mb-6">
                  {group.label}
                </h2>
                <FAQAccordion items={group.items} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-neutral-950 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-2 text-white mb-6">
              Остались вопросы?
            </h2>
            <p className="text-xl text-neutral-400 mb-10">
              Получите бесплатную консультацию и мы ответим на все ваши вопросы.
            </p>
            <Button href="/contact" size="lg">
              Получить консультацию
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
