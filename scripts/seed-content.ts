// @ts-nocheck
/**
 * Seed-скрипт: загружает весь контент с фронтенда в БД Payload CMS.
 * Запуск: pnpm seed:content
 */
import { getPayload } from 'payload'
import config from '@payload-config'

// ─── Helpers ──────────────────────────────────────────────────────
function richText(text: string) {
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', text, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
          textFormat: 0,
          textStyle: '',
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

// ─── Data ─────────────────────────────────────────────────────────

const teamData = [
  { name: 'Кирилл Попов', role: 'Основатель, публичное лицо бренда', bio: 'Публичное лицо Content Hunter. Точки контакта: личный Telegram, Telegram-менеджер, Telegram-бот.', order: 1 },
  { name: 'Роман Абрамов', role: 'Техническая часть', bio: 'Отвечает за технологическую инфраструктуру контент-заводов и дистрибуции.', order: 2 },
  { name: 'Олег Ежков', role: 'Маркетинг, смыслы', bio: 'Маркетинг и контент-стратегии. Смыслы и позиционирование бренда.', order: 3 },
]

const faqData = [
  { category: 'general', question: 'Что такое контент-завод?', answer: 'Контент-завод — это инфраструктура для массового производства и дистрибуции короткого видеоконтента. Вместо одного блога и надежды на вирусный ролик, мы создаём систему из десятков аккаунтов, которая гарантирует охваты за счёт объёма публикаций.', order: 1 },
  { category: 'general', question: 'Чем вы отличаетесь от SMM-агентства?', answer: 'SMM-агентства ведут 1-2 блога и надеются на органический рост. Мы строим промышленную систему дистрибуции: один ролик превращаем в десятки уникальных версий и публикуем через сетку аккаунтов. Результат — гарантированные охваты, а не лотерея.', order: 2 },
  { category: 'process', question: 'Как происходит процесс работы?', answer: 'Начинаем с аудита и стратегии (3-5 дней). Затем разворачиваем инфраструктуру: создаём и прогреваем аккаунты (1-2 недели). После этого запускаем производство контента и массовую публикацию. Первые результаты — через 1.5 месяца.', order: 3 },
  { category: 'process', question: 'Кто создаёт контент?', answer: 'Контент создаёт наша команда: сценаристы, операторы, монтажёры. Для съёмок можем привлекать ваших спикеров или использовать AI-аватары и нейросети. Каждый ролик уникализируется под разные аккаунты.', order: 4 },
  { category: 'results', question: 'Какие гарантии результата?', answer: 'Прописываем KPI по охватам в договоре. Если за оговоренный срок не достигаем целей — продлеваем работу бесплатно до достижения результата. Это возможно благодаря системному подходу: мы не надеемся на удачу, а работаем с математикой.', order: 5 },
  { category: 'results', question: 'Через сколько будут первые результаты?', answer: 'Первые публикации — через 1-2 недели после старта. Стабильный поток охватов формируется к 1.5 месяцам. Полноценные результаты с аналитикой конверсий — через 2-3 месяца работы.', order: 6 },
  { category: 'pricing', question: 'Сколько стоит запуск контент-завода?', answer: 'Стартовый тариф — от 150 000 ₽/мес. Включает 20 роликов, 10 аккаунтов и 500K+ просмотров. Для крупных проектов и агентств рассчитываем индивидуальную стоимость под задачи.', order: 7 },
  { category: 'pricing', question: 'Что входит в стоимость?', answer: 'Полный цикл: стратегия и аудит, создание сценариев, производство роликов, уникализация контента, публикация через сетку аккаунтов, аналитика и оптимизация, отчётность и поддержка.', order: 8 },
  { category: 'technical', question: 'На каких платформах работаете?', answer: 'Instagram Reels, TikTok, YouTube Shorts, VK Клипы, Facebook Reels. Можем добавить любую платформу под ваши задачи. Обычно работаем на 2-3 платформах одновременно.', order: 9 },
  { category: 'technical', question: 'Как вы обходите ограничения платформ?', answer: 'Используем прогретые аккаунты, уникализируем каждый ролик (звук, визуал, текст), соблюдаем лимиты публикаций, работаем с разных устройств и геолокаций. Наш подход — масштабирование без нарушения правил платформ.', order: 10 },
  { category: 'niches', question: 'С какими нишами работаете?', answer: 'B2C-бизнес с широкой аудиторией: e-commerce, онлайн-школы, beauty, HoReCa, недвижимость, туризм, эксперты и коучи. Минимальный бюджет на маркетинг — от 200 000 ₽/мес.', order: 11 },
  { category: 'niches', question: 'Работаете ли с B2B?', answer: 'B2B — сложнее, но возможно. Нужна узкая специализация контента и таргетированная дистрибуция. Обсуждаем на консультации, подходит ли контент-завод для вашей B2B-ниши.', order: 12 },
]

const casesData = [
  { title: 'Онлайн-магазин одежды', slug: 'online-shop-clothes', niche: 'ecommerce' as const, publications: 3656, views: 14100000, revenue: 1900000, currency: 'RUB' as const, ctr: 0.47, conversion: 19, duration: '—', order: 1 },
  { title: 'Школа программирования', slug: 'programming-school', niche: 'edu' as const, publications: 2145, views: 2100000, revenue: 12000000, currency: 'RUB' as const, ctr: 1.2, conversion: 25, duration: '—', order: 2 },
  { title: 'Салон красоты', slug: 'beauty-salon', niche: 'beauty' as const, publications: 1293, views: 700000, revenue: 4200000, currency: 'RUB' as const, ctr: 0.8, conversion: 16, duration: '—', order: 3 },
  { title: 'Ремонт офисов (Москва)', slug: 'office-renovation-moscow', niche: 'other' as const, publications: 530, views: 253000, revenue: 6000000, currency: 'RUB' as const, ctr: 0.4, conversion: 7, duration: '1.5 месяца', order: 4 },
  { title: 'Студия дизайна интерьера (Москва)', slug: 'interior-design-studio-moscow', niche: 'other' as const, publications: 430, views: 280000, revenue: 8100000, currency: 'RUB' as const, ctr: 0.8, conversion: 11, duration: '1.5 месяца', order: 5 },
  { title: 'Компьютерные кресла (Ozon)', slug: 'gaming-chairs-ozon', niche: 'ecommerce' as const, publications: 1053, views: 592000, revenue: 2300000, currency: 'RUB' as const, ctr: 2, conversion: 25, duration: '2 месяца', order: 6 },
  { title: 'Юридическое агентство (Беларусь)', slug: 'legal-agency-belarus', niche: 'other' as const, publications: 521, views: 360000, revenue: 920000, currency: 'RUB' as const, ctr: 0.6, conversion: 13, duration: '—', order: 7 },
  { title: 'Психолог для родителей', slug: 'psychologist-parents', niche: 'expert' as const, publications: 346, views: 245000, revenue: 490000, currency: 'RUB' as const, ctr: 2.1, conversion: 11, duration: '1.5 месяца', order: 8 },
  { title: 'Эксперт бизнес-партнёрства (ОАЭ)', slug: 'business-partnership-expert-uae', niche: 'expert' as const, publications: 563, views: 320000, revenue: 1500000, currency: 'RUB' as const, ctr: 0.7, conversion: 9, duration: '—', order: 9 },
  { title: 'Инвестиции (Великобритания)', slug: 'investments-uk', niche: 'expert' as const, publications: 940, views: 570000, revenue: 2200000, currency: 'RUB' as const, ctr: 1.4, conversion: 8, duration: '2 месяца', order: 10 },
  { title: 'Глэмпинг (Казань)', slug: 'glamping-kazan', niche: 'travel' as const, publications: 540, views: 320000, revenue: 2500000, currency: 'RUB' as const, ctr: 2.5, conversion: 14, duration: '—', order: 11 },
  { title: 'Тур-агентство (Европа)', slug: 'travel-agency-europe', niche: 'travel' as const, publications: 1841, views: 1200000, revenue: 3000000, currency: 'RUB' as const, ctr: 1.2, conversion: 18, duration: '—', order: 12 },
  { title: 'Digital-агентство (Астана)', slug: 'digital-agency-astana', niche: 'digital' as const, publications: 340, views: 275000, revenue: 31000, currency: 'USD' as const, ctr: 0.8, conversion: 10, duration: '1.5 месяца', order: 13 },
  { title: 'Школа языков (Казахстан)', slug: 'language-school-kazakhstan', niche: 'edu' as const, publications: 985, views: 553000, revenue: 80000, currency: 'USD' as const, ctr: 1.2, conversion: 18, duration: '2.5 месяца', order: 14 },
]

const pricingData = [
  {
    name: 'Стартовый', price: 150000, currency: 'RUB' as const, period: 'месяц', isPopular: false, order: 1,
    features: [
      { feature: '20 роликов в месяц', included: true },
      { feature: '10 аккаунтов', included: true },
      { feature: '200+ публикаций', included: true },
      { feature: '500K+ просмотров', included: true },
      { feature: 'Отчётность раз в неделю', included: true },
      { feature: 'Telegram-поддержка', included: true },
    ],
  },
  {
    name: 'Бизнес', price: 300000, currency: 'RUB' as const, period: 'месяц', isPopular: true, order: 2,
    features: [
      { feature: '50 роликов в месяц', included: true },
      { feature: '20 аккаунтов', included: true },
      { feature: '1000+ публикаций', included: true },
      { feature: '2М+ просмотров', included: true },
      { feature: 'Отчётность 2 раза в неделю', included: true },
      { feature: 'Выделенный менеджер', included: true },
      { feature: 'A/B тестирование', included: true },
      { feature: 'Интеграция с CRM', included: true },
    ],
  },
  {
    name: 'Масштаб', price: 500000, currency: 'RUB' as const, period: 'месяц', isPopular: false, order: 3,
    features: [
      { feature: '100 роликов в месяц', included: true },
      { feature: '40+ аккаунтов', included: true },
      { feature: '4000+ публикаций', included: true },
      { feature: '5М+ просмотров', included: true },
      { feature: 'Ежедневная отчётность', included: true },
      { feature: 'Выделенная команда', included: true },
      { feature: 'Стратегические сессии', included: true },
      { feature: 'Мультиязычный контент', included: true },
      { feature: 'Приоритетная поддержка', included: true },
    ],
  },
]

const blogData = [
  { title: 'Почему один блог больше не работает: математика охватов в 2024', slug: 'why-one-blog-doesnt-work', category: 'analysis' as const, excerpt: 'Разбираем, почему классический SMM с одним аккаунтом перестал приносить результаты и как контент-завод решает эту проблему.', publishedAt: '2024-01-15' },
  { title: 'Как мы сделали 14 млн просмотров для онлайн-магазина за 2 месяца', slug: 'case-14m-views-ecommerce', category: 'cases' as const, excerpt: 'Подробный разбор кейса: стратегия, инфраструктура, контент и результаты запуска контент-завода для e-commerce.', publishedAt: '2024-01-10' },
  { title: '5 мифов о контент-заводах, которые мешают вам масштабироваться', slug: '5-myths-about-content-factories', category: 'myths' as const, excerpt: 'Разбираем популярные заблуждения: от "это спам" до "алгоритмы заблокируют" — и объясняем, как на самом деле.', publishedAt: '2024-01-05' },
  { title: 'Как правильно уникализировать контент для разных аккаунтов', slug: 'how-to-uniqualize-content', category: 'guides' as const, excerpt: 'Пошаговый гайд по уникализации роликов: звук, визуал, текст, хештеги — всё, чтобы платформы не посчитали контент дублем.', publishedAt: '2024-01-01' },
  { title: 'ROI контент-завода vs таргетированная реклама: сравнение каналов', slug: 'content-factory-vs-paid-ads', category: 'analysis' as const, excerpt: 'Считаем экономику: когда контент-завод выгоднее таргета, а когда лучше комбинировать оба канала.', publishedAt: '2023-12-25' },
  { title: 'Процесс создания 50 роликов в месяц: от сценария до публикации', slug: 'content-production-process', category: 'process' as const, excerpt: 'Заглядываем внутрь контент-завода: как организована работа, какие инструменты используем и как масштабируем производство.', publishedAt: '2023-12-20' },
]

// ─── Seed Function ────────────────────────────────────────────────

async function seed() {
  console.log('🌱 Начинаем заполнение БД...\n')

  const payload = await getPayload({ config })

  // 1. Team
  console.log('👥 Команда...')
  for (const member of teamData) {
    try {
      const existing = await payload.find({ collection: 'team', where: { name: { equals: member.name } }, limit: 1 })
      if (existing.docs.length > 0) { console.log(`  ✓ ${member.name} — уже есть`); continue }
      await payload.create({ collection: 'team', data: { ...member, bio: richText(member.bio) } as any })
      console.log(`  + ${member.name}`)
    } catch (e: any) { console.log(`  ✗ ${member.name}: ${e.message}`) }
  }

  // 2. FAQ
  console.log('\n❓ FAQ...')
  for (const item of faqData) {
    try {
      const existing = await payload.find({ collection: 'faq', where: { question: { equals: item.question } }, limit: 1 })
      if (existing.docs.length > 0) { console.log(`  ✓ FAQ #${item.order} — уже есть`); continue }
      await payload.create({ collection: 'faq', data: item })
      console.log(`  + FAQ #${item.order}: ${item.question.substring(0, 50)}...`)
    } catch (e: any) { console.log(`  ✗ FAQ #${item.order}: ${e.message}`) }
  }

  // 3. Cases
  console.log('\n📊 Кейсы...')
  for (const c of casesData) {
    try {
      const existing = await payload.find({ collection: 'cases', where: { slug: { equals: c.slug } }, limit: 1 })
      if (existing.docs.length > 0) { console.log(`  ✓ ${c.title} — уже есть`); continue }
      await payload.create({ collection: 'cases', data: { ...c, published: true } as any })
      console.log(`  + ${c.title}`)
    } catch (e: any) { console.log(`  ✗ ${c.title}: ${e.message}`) }
  }

  // 4. Pricing
  console.log('\n💰 Тарифы...')
  for (const plan of pricingData) {
    try {
      const existing = await payload.find({ collection: 'pricing', where: { name: { equals: plan.name } }, limit: 1 })
      if (existing.docs.length > 0) { console.log(`  ✓ ${plan.name} — уже есть`); continue }
      await payload.create({ collection: 'pricing', data: plan as any })
      console.log(`  + ${plan.name} (${plan.price} ₽)`)
    } catch (e: any) { console.log(`  ✗ ${plan.name}: ${e.message}`) }
  }

  // 5. Blog Posts
  console.log('\n📝 Статьи...')
  // Найдём автора (Кирилл Попов)
  const authorResult = await payload.find({ collection: 'team', where: { name: { equals: 'Кирилл Попов' } }, limit: 1 })
  const authorId = authorResult.docs[0]?.id

  for (const post of blogData) {
    try {
      const existing = await payload.find({ collection: 'blog-posts', where: { slug: { equals: post.slug } }, limit: 1 })
      if (existing.docs.length > 0) { console.log(`  ✓ ${post.title.substring(0, 50)} — уже есть`); continue }
      await payload.create({
        collection: 'blog-posts',
        data: {
          ...post,
          content: richText(post.excerpt),
          published: true,
          ...(authorId ? { author: authorId } : {}),
        } as any,
      })
      console.log(`  + ${post.title.substring(0, 60)}...`)
    } catch (e: any) { console.log(`  ✗ ${post.slug}: ${e.message}`) }
  }

  // 6. Globals — Header
  console.log('\n🔝 Шапка сайта...')
  try {
    await payload.updateGlobal({
      slug: 'header',
      data: {
        navigation: [
          { label: 'Кейсы', link: '/cases' },
          { label: 'Услуги', link: '/services' },
          { label: 'Тарифы', link: '/pricing' },
          { label: 'Блог', link: '/blog' },
          { label: 'О нас', link: '/about' },
          { label: 'FAQ', link: '/faq' },
        ],
        ctaButton: { text: 'Получить консультацию', link: '/contact' },
      },
    })
    console.log('  ✓ Header обновлён')
  } catch (e: any) { console.log(`  ✗ Header: ${e.message}`) }

  // 7. Globals — Footer
  console.log('\n🔻 Подвал сайта...')
  try {
    await payload.updateGlobal({
      slug: 'footer',
      data: {
        description: 'Content Hunter — конструктор контент-заводов и контент-ферм «под ключ». Гарантия охватов в договоре.',
        navigation: [
          { label: 'Кейсы', link: '/cases' },
          { label: 'Услуги', link: '/services' },
          { label: 'Тарифы', link: '/pricing' },
          { label: 'Блог', link: '/blog' },
          { label: 'О нас', link: '/about' },
          { label: 'FAQ', link: '/faq' },
          { label: 'Контакты', link: '/contact' },
        ],
        social: [
          { platform: 'telegram', url: 'https://t.me/contenthunter_bot' },
          { platform: 'instagram', url: 'https://instagram.com/contenthunter' },
          { platform: 'youtube', url: 'https://youtube.com/@contenthunter' },
        ],
        copyright: '© 2024 Content Hunter. ОАО «Дженго»',
      },
    })
    console.log('  ✓ Footer обновлён')
  } catch (e: any) { console.log(`  ✗ Footer: ${e.message}`) }

  // 8. Globals — Settings
  console.log('\n⚙️  Настройки сайта...')
  try {
    await payload.updateGlobal({
      slug: 'settings',
      data: {
        siteName: 'Content Hunter',
        siteDescription: 'Конструктор контент-заводов и контент-ферм «под ключ». Гарантия охватов в договоре.',
        defaultMeta: {
          title: 'Content Hunter — Контент-завод под ключ',
          description: 'Разворачиваем инфраструктуру по созданию и массовой дистрибуции коротких видео. 50+ проектов, 20М+ просмотров, гарантия в договоре.',
        },
        contacts: {
          telegramBot: 'https://t.me/contenthunter_bot',
        },
      },
    })
    console.log('  ✓ Settings обновлены')
  } catch (e: any) { console.log(`  ✗ Settings: ${e.message}`) }

  console.log('\n✅ Заполнение БД завершено!\n')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Ошибка seed:', err)
  process.exit(1)
})
