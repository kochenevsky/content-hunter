/**
 * Seed-скрипт через REST API (dev-сервер должен быть запущен на localhost:3000)
 */

const API = 'http://localhost:3000/api'
let AUTH_TOKEN = ''

async function login() {
  const res = await fetch(`${API}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASS }),
  })
  const json = await res.json()
  if (!json.token) throw new Error('Login failed: ' + JSON.stringify(json))
  AUTH_TOKEN = json.token
  console.log('🔑 Авторизация успешна\n')
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    ...(AUTH_TOKEN ? { Authorization: `JWT ${AUTH_TOKEN}` } : {}),
  }
}

async function createDoc(collection, data) {
  const res = await fetch(`${API}/${collection}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.errors?.[0]?.message || JSON.stringify(json))
  return json.doc
}

async function findDocs(collection, query = '') {
  const res = await fetch(`${API}/${collection}?${query}`)
  const json = await res.json()
  return json.docs || []
}

async function updateGlobal(slug, data) {
  const res = await fetch(`${API}/globals/${slug}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.errors?.[0]?.message || JSON.stringify(json))
  return json.result || json
}

function richText(text) {
  return {
    root: {
      type: 'root',
      children: [{
        type: 'paragraph',
        children: [{ type: 'text', text, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
        direction: 'ltr', format: '', indent: 0, version: 1, textFormat: 0, textStyle: '',
      }],
      direction: 'ltr', format: '', indent: 0, version: 1,
    },
  }
}

// ─── Data ─────────────────────────────────────────────────

const teamData = [
  { name: 'Кирилл Попов', role: 'Основатель, публичное лицо бренда', bio: richText('Публичное лицо Content Hunter. Точки контакта: личный Telegram, Telegram-менеджер, Telegram-бот.'), order: 1 },
  { name: 'Роман Абрамов', role: 'Техническая часть', bio: richText('Отвечает за технологическую инфраструктуру контент-заводов и дистрибуции.'), order: 2 },
  { name: 'Олег Ежков', role: 'Маркетинг, смыслы', bio: richText('Маркетинг и контент-стратегии. Смыслы и позиционирование бренда.'), order: 3 },
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
  { title: 'Онлайн-магазин одежды', slug: 'online-shop-clothes', niche: 'ecommerce', publications: 3656, views: 14100000, revenue: 1900000, currency: 'RUB', ctr: 0.47, conversion: 19, duration: '—', order: 1, published: true },
  { title: 'Школа программирования', slug: 'programming-school', niche: 'edu', publications: 2145, views: 2100000, revenue: 12000000, currency: 'RUB', ctr: 1.2, conversion: 25, duration: '—', order: 2, published: true },
  { title: 'Салон красоты', slug: 'beauty-salon', niche: 'beauty', publications: 1293, views: 700000, revenue: 4200000, currency: 'RUB', ctr: 0.8, conversion: 16, duration: '—', order: 3, published: true },
  { title: 'Ремонт офисов (Москва)', slug: 'office-renovation-moscow', niche: 'other', publications: 530, views: 253000, revenue: 6000000, currency: 'RUB', ctr: 0.4, conversion: 7, duration: '1.5 месяца', order: 4, published: true },
  { title: 'Студия дизайна интерьера (Москва)', slug: 'interior-design-studio-moscow', niche: 'other', publications: 430, views: 280000, revenue: 8100000, currency: 'RUB', ctr: 0.8, conversion: 11, duration: '1.5 месяца', order: 5, published: true },
  { title: 'Компьютерные кресла (Ozon)', slug: 'gaming-chairs-ozon', niche: 'ecommerce', publications: 1053, views: 592000, revenue: 2300000, currency: 'RUB', ctr: 2, conversion: 25, duration: '2 месяца', order: 6, published: true },
  { title: 'Юридическое агентство (Беларусь)', slug: 'legal-agency-belarus', niche: 'other', publications: 521, views: 360000, revenue: 920000, currency: 'RUB', ctr: 0.6, conversion: 13, duration: '—', order: 7, published: true },
  { title: 'Психолог для родителей', slug: 'psychologist-parents', niche: 'expert', publications: 346, views: 245000, revenue: 490000, currency: 'RUB', ctr: 2.1, conversion: 11, duration: '1.5 месяца', order: 8, published: true },
  { title: 'Эксперт бизнес-партнёрства (ОАЭ)', slug: 'business-partnership-expert-uae', niche: 'expert', publications: 563, views: 320000, revenue: 1500000, currency: 'RUB', ctr: 0.7, conversion: 9, duration: '—', order: 9, published: true },
  { title: 'Инвестиции (Великобритания)', slug: 'investments-uk', niche: 'expert', publications: 940, views: 570000, revenue: 2200000, currency: 'RUB', ctr: 1.4, conversion: 8, duration: '2 месяца', order: 10, published: true },
  { title: 'Глэмпинг (Казань)', slug: 'glamping-kazan', niche: 'travel', publications: 540, views: 320000, revenue: 2500000, currency: 'RUB', ctr: 2.5, conversion: 14, duration: '—', order: 11, published: true },
  { title: 'Тур-агентство (Европа)', slug: 'travel-agency-europe', niche: 'travel', publications: 1841, views: 1200000, revenue: 3000000, currency: 'RUB', ctr: 1.2, conversion: 18, duration: '—', order: 12, published: true },
  { title: 'Digital-агентство (Астана)', slug: 'digital-agency-astana', niche: 'digital', publications: 340, views: 275000, revenue: 31000, currency: 'USD', ctr: 0.8, conversion: 10, duration: '1.5 месяца', order: 13, published: true },
  { title: 'Школа языков (Казахстан)', slug: 'language-school-kazakhstan', niche: 'edu', publications: 985, views: 553000, revenue: 80000, currency: 'USD', ctr: 1.2, conversion: 18, duration: '2.5 месяца', order: 14, published: true },
]

const pricingData = [
  { name: 'Стартовый', price: 150000, currency: 'RUB', period: 'месяц', isPopular: false, order: 1, features: [
    { feature: '20 роликов в месяц', included: true }, { feature: '10 аккаунтов', included: true },
    { feature: '200+ публикаций', included: true }, { feature: '500K+ просмотров', included: true },
    { feature: 'Отчётность раз в неделю', included: true }, { feature: 'Telegram-поддержка', included: true },
  ]},
  { name: 'Бизнес', price: 300000, currency: 'RUB', period: 'месяц', isPopular: true, order: 2, features: [
    { feature: '50 роликов в месяц', included: true }, { feature: '20 аккаунтов', included: true },
    { feature: '1000+ публикаций', included: true }, { feature: '2М+ просмотров', included: true },
    { feature: 'Отчётность 2 раза в неделю', included: true }, { feature: 'Выделенный менеджер', included: true },
    { feature: 'A/B тестирование', included: true }, { feature: 'Интеграция с CRM', included: true },
  ]},
  { name: 'Масштаб', price: 500000, currency: 'RUB', period: 'месяц', isPopular: false, order: 3, features: [
    { feature: '100 роликов в месяц', included: true }, { feature: '40+ аккаунтов', included: true },
    { feature: '4000+ публикаций', included: true }, { feature: '5М+ просмотров', included: true },
    { feature: 'Ежедневная отчётность', included: true }, { feature: 'Выделенная команда', included: true },
    { feature: 'Стратегические сессии', included: true }, { feature: 'Мультиязычный контент', included: true },
    { feature: 'Приоритетная поддержка', included: true },
  ]},
]

const blogData = [
  { title: 'Почему один блог больше не работает: математика охватов в 2024', slug: 'why-one-blog-doesnt-work', category: 'analysis', excerpt: 'Разбираем, почему классический SMM с одним аккаунтом перестал приносить результаты и как контент-завод решает эту проблему.', publishedAt: '2024-01-15', published: true },
  { title: 'Как мы сделали 14 млн просмотров для онлайн-магазина за 2 месяца', slug: 'case-14m-views-ecommerce', category: 'cases', excerpt: 'Подробный разбор кейса: стратегия, инфраструктура, контент и результаты запуска контент-завода для e-commerce.', publishedAt: '2024-01-10', published: true },
  { title: '5 мифов о контент-заводах, которые мешают вам масштабироваться', slug: '5-myths-about-content-factories', category: 'myths', excerpt: 'Разбираем популярные заблуждения: от "это спам" до "алгоритмы заблокируют" — и объясняем, как на самом деле.', publishedAt: '2024-01-05', published: true },
  { title: 'Как правильно уникализировать контент для разных аккаунтов', slug: 'how-to-uniqualize-content', category: 'guides', excerpt: 'Пошаговый гайд по уникализации роликов: звук, визуал, текст, хештеги — всё, чтобы платформы не посчитали контент дублем.', publishedAt: '2024-01-01', published: true },
  { title: 'ROI контент-завода vs таргетированная реклама: сравнение каналов', slug: 'content-factory-vs-paid-ads', category: 'analysis', excerpt: 'Считаем экономику: когда контент-завод выгоднее таргета, а когда лучше комбинировать оба канала.', publishedAt: '2023-12-25', published: true },
  { title: 'Процесс создания 50 роликов в месяц: от сценария до публикации', slug: 'content-production-process', category: 'process', excerpt: 'Заглядываем внутрь контент-завода: как организована работа, какие инструменты используем и как масштабируем производство.', publishedAt: '2023-12-20', published: true },
]

// ─── Main ─────────────────────────────────────────────────

async function seed() {
  console.log('🌱 Заполняем БД через REST API...\n')
  await login()

  // 1. Team
  console.log('👥 Команда...')
  for (const m of teamData) {
    try {
      const existing = await findDocs('team', `where[name][equals]=${encodeURIComponent(m.name)}&limit=1`)
      if (existing.length > 0) { console.log(`  ✓ ${m.name} — есть`); continue }
      await createDoc('team', m)
      console.log(`  + ${m.name}`)
    } catch (e) { console.log(`  ✗ ${m.name}: ${e.message}`) }
  }

  // 2. FAQ
  console.log('\n❓ FAQ...')
  for (const f of faqData) {
    try {
      const existing = await findDocs('faq', `where[order][equals]=${f.order}&limit=1`)
      if (existing.length > 0) { console.log(`  ✓ #${f.order} — есть`); continue }
      await createDoc('faq', f)
      console.log(`  + #${f.order}: ${f.question.substring(0, 45)}...`)
    } catch (e) { console.log(`  ✗ #${f.order}: ${e.message}`) }
  }

  // 3. Cases
  console.log('\n📊 Кейсы...')
  for (const c of casesData) {
    try {
      const existing = await findDocs('cases', `where[slug][equals]=${c.slug}&limit=1`)
      if (existing.length > 0) { console.log(`  ✓ ${c.title} — есть`); continue }
      await createDoc('cases', c)
      console.log(`  + ${c.title}`)
    } catch (e) { console.log(`  ✗ ${c.title}: ${e.message}`) }
  }

  // 4. Pricing
  console.log('\n💰 Тарифы...')
  for (const p of pricingData) {
    try {
      const existing = await findDocs('pricing', `where[name][equals]=${encodeURIComponent(p.name)}&limit=1`)
      if (existing.length > 0) { console.log(`  ✓ ${p.name} — есть`); continue }
      await createDoc('pricing', p)
      console.log(`  + ${p.name} (${p.price}₽)`)
    } catch (e) { console.log(`  ✗ ${p.name}: ${e.message}`) }
  }

  // 5. Blog
  console.log('\n📝 Статьи...')
  const authors = await findDocs('team', `where[name][equals]=${encodeURIComponent('Кирилл Попов')}&limit=1`)
  const authorId = authors[0]?.id

  for (const b of blogData) {
    try {
      const existing = await findDocs('blog-posts', `where[slug][equals]=${b.slug}&limit=1`)
      if (existing.length > 0) { console.log(`  ✓ ${b.slug} — есть`); continue }
      await createDoc('blog-posts', {
        ...b,
        content: richText(b.excerpt),
        ...(authorId ? { author: authorId } : {}),
      })
      console.log(`  + ${b.title.substring(0, 55)}...`)
    } catch (e) { console.log(`  ✗ ${b.slug}: ${e.message}`) }
  }

  // 6. Globals
  console.log('\n🔝 Globals...')
  try {
    await updateGlobal('header', {
      navigation: [
        { label: 'Кейсы', link: '/cases' }, { label: 'Услуги', link: '/services' },
        { label: 'Тарифы', link: '/pricing' }, { label: 'Блог', link: '/blog' },
        { label: 'О нас', link: '/about' }, { label: 'FAQ', link: '/faq' },
      ],
      ctaButton: { text: 'Получить консультацию', link: '/contact' },
    })
    console.log('  ✓ Header')
  } catch (e) { console.log(`  ✗ Header: ${e.message}`) }

  try {
    await updateGlobal('footer', {
      description: 'Content Hunter — конструктор контент-заводов и контент-ферм «под ключ». Гарантия охватов в договоре.',
      navigation: [
        { label: 'Кейсы', link: '/cases' }, { label: 'Услуги', link: '/services' },
        { label: 'Тарифы', link: '/pricing' }, { label: 'Блог', link: '/blog' },
        { label: 'О нас', link: '/about' }, { label: 'FAQ', link: '/faq' },
        { label: 'Контакты', link: '/contact' },
      ],
      social: [
        { platform: 'telegram', url: 'https://t.me/contenthunter_bot' },
        { platform: 'instagram', url: 'https://instagram.com/contenthunter' },
        { platform: 'youtube', url: 'https://youtube.com/@contenthunter' },
      ],
      copyright: '© 2024 Content Hunter. ОАО «Дженго»',
    })
    console.log('  ✓ Footer')
  } catch (e) { console.log(`  ✗ Footer: ${e.message}`) }

  try {
    await updateGlobal('settings', {
      siteName: 'Content Hunter',
      siteDescription: 'Конструктор контент-заводов и контент-ферм «под ключ». Гарантия охватов в договоре.',
      defaultMeta: {
        title: 'Content Hunter — Контент-завод под ключ',
        description: 'Разворачиваем инфраструктуру по созданию и массовой дистрибуции коротких видео. 50+ проектов, 20М+ просмотров, гарантия в договоре.',
      },
      contacts: { telegramBot: 'https://t.me/contenthunter_bot' },
    })
    console.log('  ✓ Settings')
  } catch (e) { console.log(`  ✗ Settings: ${e.message}`) }

  console.log('\n✅ Готово!')
}

seed().catch(e => { console.error('❌', e); process.exit(1) })
