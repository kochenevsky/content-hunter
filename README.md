# Content Hunter — Официальный сайт

Сайт компании Content Hunter — конструктор контент-заводов и контент-ферм под ключ.

## Технологический стек

| Технология | Назначение |
|------------|------------|
| **Payload CMS 3.0** | Headless CMS + Admin Panel |
| **Next.js 15** | Frontend framework |
| **Supabase** | PostgreSQL база данных |
| **Vercel** | Хостинг и деплой |
| **TypeScript** | Типизация |
| **Tailwind CSS** | Стили |

## Структура проекта

```
content-hunter/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (frontend)/         # Публичная часть сайта
│   │   │   ├── page.tsx        # Главная
│   │   │   ├── services/       # Услуги
│   │   │   ├── cases/          # Кейсы
│   │   │   ├── pricing/        # Тарифы
│   │   │   ├── blog/           # Блог
│   │   │   ├── about/          # О нас
│   │   │   ├── faq/            # FAQ
│   │   │   └── contact/        # Консультация
│   │   └── (payload)/          # Payload Admin
│   │       └── admin/          # Админ-панель
│   ├── collections/            # Payload Collections
│   │   ├── Pages.ts
│   │   ├── Cases.ts
│   │   ├── BlogPosts.ts
│   │   ├── Pricing.ts
│   │   ├── FAQ.ts
│   │   ├── Team.ts
│   │   └── Media.ts
│   ├── blocks/                 # Payload Blocks (компоненты страниц)
│   ├── components/             # React компоненты
│   │   ├── ui/                 # UI kit
│   │   ├── layout/             # Header, Footer, Navigation
│   │   └── sections/           # Секции страниц
│   ├── lib/                    # Утилиты
│   └── payload.config.ts       # Конфигурация Payload
├── public/                     # Статика
├── .env.local                  # Переменные окружения
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Страницы сайта

### 1. Главная (`/`)
- Hero секция с УТП
- Блок "Проблема → Решение"
- Как работает контент-завод
- Ключевые цифры
- Избранные кейсы
- Целевые ниши
- Отличия от конкурентов
- CTA: Заявка на консультацию

### 2. Услуги / Контент-завод (`/services`)
- Что такое контент-завод
- Форматы контента (Reels, Shorts, TikTok)
- Этапы работы
- Платформы
- Масштабирование

### 3. Кейсы (`/cases`)
- Фильтр по нишам
- Карточки кейсов с метриками
- Детальные страницы кейсов

### 4. Тарифы (`/pricing`)
- Сетка тарифов
- Калькулятор стоимости (опционально)
- FAQ по тарифам

### 5. Блог (`/blog`)
- Список статей с категориями
- Страницы статей

### 6. О нас (`/about`)
- История компании
- Команда
- География

### 7. FAQ (`/faq`)
- Аккордеон с вопросами

### 8. Консультация (`/contact`)
- Форма заявки
- Квиз (опционально)
- Контакты (Telegram, WhatsApp)

## Коллекции Payload CMS

### Cases (Кейсы)
```typescript
{
  title: string           // "Онлайн-магазин одежды"
  slug: string
  niche: enum             // e-commerce, edu, expert, horeca, beauty, travel, real-estate
  publications: number    // 3656
  views: number           // 14100000
  revenue: number         // 1900000
  currency: enum          // RUB, USD
  ctr: number             // 0.47
  conversion: number      // 19
  duration: string        // "2 месяца"
  description: richText
  image: relation(Media)
  socialLinks: array      // Ссылки на аккаунты
  published: boolean
}
```

### BlogPosts (Статьи)
```typescript
{
  title: string
  slug: string
  category: enum          // cases, analysis, process, myths
  excerpt: string
  content: richText
  author: relation(Team)
  image: relation(Media)
  publishedAt: date
  published: boolean
}
```

### Pricing (Тарифы)
```typescript
{
  name: string            // "Стартовый"
  price: number
  currency: enum
  period: string          // "месяц"
  features: array
  isPopular: boolean
  order: number
}
```

### FAQ
```typescript
{
  question: string
  answer: richText
  category: enum
  order: number
}
```

### Team (Команда)
```typescript
{
  name: string
  role: string
  bio: richText
  photo: relation(Media)
  telegram: string
  order: number
}
```

### Pages (Страницы)
```typescript
{
  title: string
  slug: string
  meta: { title, description, image }
  blocks: array           // Гибкие блоки контента
}
```

### Media
```typescript
{
  alt: string
  // Автоматически: url, filename, mimeType, sizes
}
```

## Переменные окружения

```env
# Supabase
DATABASE_URI=postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres

# Payload
PAYLOAD_SECRET=your-secret-key

# Vercel
NEXT_PUBLIC_SERVER_URL=https://your-domain.vercel.app
```

## Команды

```bash
# Установка
pnpm install

# Разработка
pnpm dev

# Сборка
pnpm build

# Запуск production
pnpm start

# Генерация типов Payload
pnpm generate:types
```

## Деплой на Vercel

1. Подключить репозиторий к Vercel
2. Добавить переменные окружения
3. Build Command: `pnpm build`
4. Output Directory: `.next`

## Интеграции

- **AmoCRM** — CRM для обработки заявок
- **Telegram Bot (SaleBot)** — основной канал коммуникации
- **WhatsApp** — дополнительный канал

## SEO

Ключевые запросы для продвижения:
- контент-завод
- контент-ферма
- контент-завод под ключ
- массовый контент для бизнеса
- reels для бизнеса
- производство коротких видео

## Брендинг

- **Стиль**: Экспертный, лаконичный, с цифрами и фактами
- **Без**: размытых обещаний, панибратства, неуверенного тона

## Контакты

- **Компания**: Content Hunter (ОАО «Дженго»)
- **Основатель**: Кирилл Попов
- **География**: Россия, СНГ, MENA, LATAM, Европа
