// @ts-nocheck
/** Только главная страница. Запуск: pnpm seed:home */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

const homePageData = {
  hero: {
    headline: 'Контент-завод для бизнеса',
    subheadline: 'Разворачиваем систему массовой дистрибуции коротких видео.',
    stats: [{ value: '50', suffix: '+', label: 'Проектов' }, { value: '20', suffix: 'М+', label: 'Просмотров/мес' }, { value: '8', suffix: '', label: 'Стран' }],
    cycleWords: [{ word: 'под ключ' }, { word: 'с гарантией' }],
  },
  problem: {
    title: 'Почему ваш SMM не приносит результатов',
    text: 'Контент перестал быть дефицитом.',
    items: [
      { icon: 'TrendingDown', title: 'Охваты падают', description: 'Один аккаунт не даёт нужного охвата.' },
      { icon: 'Clock', title: 'Ждёте вирусного ролика', description: 'Это лотерея, а не стратегия.' },
    ],
  },
  solution: {
    title: 'Холодная математика',
    titleHighlight: 'вместо надежды',
    formula: '50 роликов × 20 аккаунтов = 1000 публикаций',
    text: 'Вместо лотереи — производство.',
    checklist: [{ item: 'Один ролик в несколько версий' }, { item: 'Публикуем через 20+ аккаунтов' }],
    formulaStats: [{ value: 50, label: 'роликов/мес' }, { value: 20, label: 'аккаунтов' }],
  },
  stats: { items: [{ value: 50, suffix: '+', label: 'Проектов' }, { value: 20, suffix: 'М+', label: 'Просмотров' }] },
  howItWorks: {
    title: 'Как работает контент-завод',
    subtitle: 'Полный цикл',
    steps: [
      { icon: 'Target', title: 'Стратегия', description: 'Анализируем нишу' },
      { icon: 'Video', title: 'Съёмка', description: 'Производим контент' },
    ],
  },
  videoExamples: {
    title: 'Примеры работ',
    subtitle: 'Реальные ролики клиентов',
    items: [
      { client: 'Booster Cap', format: 'Распаковка', instagramIds: [{ id: 'DSup4OVjRYf', label: 'Reel 1' }], youtubeIds: [{ id: 'gLKgolZi_do', label: 'Shorts 1' }] },
    ],
  },
  niches: {
    title: 'С кем работаем',
    subtitle: 'B2C-бизнес',
    items: [{ icon: 'ShoppingBag', name: 'E-commerce', description: 'Маркетплейсы' }],
  },
  comparison: {
    title: 'Чем отличаемся',
    subtitle: 'Контент-завод с гарантией.',
    competitors: [{ title: 'SMM', description: '1-2 блога', cons: [{ item: 'Долго ждать' }] }],
    ourAdvantages: [{ item: 'Массовая дистрибуция' }],
  },
  cta: {
    headline: 'Готовы запустить?',
    headlineHighlight: 'контент-завод',
    text: 'Получите бесплатный аудит.',
    guarantees: [{ item: 'KPI в договоре' }],
    primaryButtonText: 'Консультация',
    telegramLink: 'https://t.me/contenthunter_bot',
  },
}

async function main() {
  console.log('1. DATABASE_URI:', process.env.DATABASE_URI?.replace(/:[^:@]+@/, ':***@') || 'не задан')
  let payload
  try {
    payload = await getPayload({ config })
    console.log('2. Payload инициализирован')
  } catch (e: any) {
    console.error('getPayload error:', e.message)
    throw e
  }
  try {
    await payload.updateGlobal({ slug: 'home-page', data: homePageData as any })
    console.log('3. ✓ Главная страница заполнена')
  } catch (e: any) {
    console.error('updateGlobal error:', e.message)
    throw e
  }
  process.exit(0)
}

main().catch((e) => {
  console.error('Ошибка:', e.message)
  if (e.stack) console.error(e.stack)
  process.exit(1)
})
