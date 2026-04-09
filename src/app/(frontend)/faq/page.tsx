import type { Metadata } from 'next'
import { FAQAccordion } from '@/components/ui/FAQAccordion'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'

export const revalidate = 60

// ========== ДАННЫЕ FAQ ==========
const FAQ_ITEMS = [
  // Общие вопросы
  { id: 1, category: 'general', question: 'Что такое контент-ферма?', answer: 'Это система аккаунтов, через которые ваши ролики публикуются массово и автоматически, увеличивая общий охват.' },
  { id: 2, category: 'general', question: 'Что делает платформа?', answer: 'Вы загружаете ролики — платформа автоматически публикует их в сеть аккаунтов, собирает статистику и управляет масштабированием.' },
  { id: 3, category: 'general', question: 'Нужно ли снимать больше контента?', answer: 'Нет. Используются уже существующие ролики, которые масштабируются через систему.' },
  { id: 4, category: 'general', question: 'Это SMM или реклама?', answer: 'Нет. Это отдельная модель распространения контента — через масштаб публикаций, а не через рекламу или ведение одного аккаунта.' },
  
  // Результаты и гарантии
  { id: 5, category: 'results', question: 'Что я получу в итоге?', answer: 'Рост общего охвата контента и увеличение количества касаний с аудиторией за счёт масштабирования публикаций.' },
  { id: 6, category: 'results', question: 'Откуда берутся просмотры?', answer: 'Из рекомендаций соцсетей — за счёт правильной настройки аккаунтов и регулярной публикации.' },
  { id: 7, category: 'results', question: 'Вы гарантируете просмотры?', answer: 'Да, минимальный объём просмотров фиксируется и при необходимости докручивается за счёт дополнительных публикаций.' },
  { id: 8, category: 'results', question: 'Будут ли заявки и продажи?', answer: 'Платформа отвечает за охват и трафик. Результат в заявках зависит от ниши, продукта и самого контента.' },
  
  // Процесс работы (как начать)
  { id: 9, category: 'process', question: 'Сколько времени занимает запуск?', answer: 'В среднем 5–7 дней — на настройку и прогрев аккаунтов.' },
  { id: 10, category: 'process', question: 'Что нужно от меня?', answer: '— ролики\n— базовая информация о бизнесе\n\nВсё остальное делает система.' },
  { id: 11, category: 'process', question: 'Можно ли запустить в любой нише?', answer: 'Подходит для большинства ниш, где есть видеоконтент и спрос в соцсетях.' },
  
  // Стоимость
  { id: 12, category: 'pricing', question: 'Сколько стоит?', answer: 'От 25 000 ₽ в месяц — в зависимости от объёма публикаций и конфигурации системы.' },
  { id: 13, category: 'pricing', question: 'Почему такая цена?', answer: 'Вы получаете инфраструктуру (аккаунты, устройства, софт) и систему масштабирования контента, а не просто услугу SMM.' },
  { id: 14, category: 'pricing', question: 'Есть ли бесплатный вариант?', answer: 'Да, возможен формат с бесплатным созданием системы — с оплатой только за публикации и просмотры.' },
  
  // Безопасность и риски
  { id: 15, category: 'technical', question: 'Это точно безопасно для бизнеса?', answer: 'Система настраивается индивидуально под нишу и работает через распределённую сеть аккаунтов.' },
  { id: 16, category: 'technical', question: 'Не заблокируют ли аккаунты?', answer: 'Аккаунты проходят прогрев и работают в рамках нормальной активности, что снижает риски блокировок.' },
  { id: 17, category: 'technical', question: 'Подойдёт ли это моей нише?', answer: 'Чтобы это понять, лучше рассчитать параметры через калькулятор — он покажет, как система будет работать именно у вас.' },
  
  // Подробнее о процессах
  { id: 18, category: 'process_details', question: 'Нужно ли постоянно участвовать?', answer: 'Нет. После запуска вы просто загружаете ролики, всё остальное автоматизировано.' },
  { id: 19, category: 'process_details', question: 'Можно ли отслеживать результаты?', answer: 'Да, в платформе есть аналитика по публикациям и просмотрам.' },
  { id: 20, category: 'process_details', question: 'Можно ли масштабировать дальше?', answer: 'Да, систему можно увеличивать по количеству аккаунтов и объёму публикаций.' },
  
  // Отличия и разница
  { id: 21, category: 'differences', question: 'Чем это отличается от обычного SMM?', answer: 'В SMM вы работаете с одним аккаунтом. Здесь — с системой аккаунтов и масштабом.' },
  { id: 22, category: 'differences', question: 'Чем это отличается от рекламы?', answer: 'Реклама даёт платный трафик. Здесь — органический охват через масштабирование контента.' },
]

// ========== КАТЕГОРИИ ==========
const CATEGORIES = [
  { id: 'general', label: 'Общие вопросы' },
  { id: 'results', label: 'Результаты и гарантии' },
  { id: 'process', label: 'Как начать' },
  { id: 'pricing', label: 'Тарифы' },
  { id: 'technical', label: 'Безопасность и риски' },
  { id: 'process_details', label: 'Подробнее о процессах' },
  { id: 'differences', label: 'Отличия и разница' },
]

// ========== ДАННЫЕ СТРАНИЦЫ ==========
const PAGE_DATA = {
  meta: {
    title: 'FAQ — Частые вопросы о контент-ферме',
    description: 'Ответы на частые вопросы о контент-ферме, процессе работы, гарантиях, стоимости и безопасности.',
  },
  hero: {
    headline: 'Частые',
    headlineHighlight: 'вопросы',
    subheadline: 'Ответы на вопросы о контент-ферме, процессе работы, гарантиях и стоимости.',
  },
  cta: {
    headline: 'Остались вопросы?',
    text: 'Получите бесплатную консультацию и мы ответим на все ваши вопросы.',
    buttonText: 'Получить консультацию',
    buttonLink: '/contact',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: PAGE_DATA.meta.title,
    description: PAGE_DATA.meta.description,
    openGraph: {
      title: PAGE_DATA.meta.title,
      description: PAGE_DATA.meta.description,
    },
  }
}

export default async function FAQPage() {
  // Группируем вопросы по категориям
  const groupedFAQ = CATEGORIES.map((category) => ({
    ...category,
    items: FAQ_ITEMS.filter((item) => item.category === category.id),
  })).filter((group) => group.items.length > 0)

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-neutral-950 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="heading-display text-white mb-6">
              {PAGE_DATA.hero.headline}
              <br />
              <span className="text-primary-500">{PAGE_DATA.hero.headlineHighlight}</span>
            </h1>
            <p className="text-xl text-neutral-400">
              {PAGE_DATA.hero.subheadline}
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
                <FAQAccordion 
                  items={group.items.map((item) => ({
                    id: String(item.id),
                    question: item.question,
                    answer: item.answer,
                  }))} 
                />
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
              {PAGE_DATA.cta.headline}
            </h2>
            <p className="text-xl text-neutral-400 mb-10">
              {PAGE_DATA.cta.text}
            </p>
            <Button href={PAGE_DATA.cta.buttonLink} size="lg">
              {PAGE_DATA.cta.buttonText}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
