# Архитектура проекта Content Hunter

## Обзор

```
┌─────────────────────────────────────────────────────────────────┐
│                         VERCEL                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Next.js 15 App                        │    │
│  │  ┌─────────────────┐    ┌─────────────────────────────┐ │    │
│  │  │   Frontend      │    │      Payload CMS            │ │    │
│  │  │   (Public)      │    │      (Admin Panel)          │ │    │
│  │  │                 │    │                             │ │    │
│  │  │  /              │    │  /admin                     │ │    │
│  │  │  /services      │    │  - Collections              │ │    │
│  │  │  /cases         │    │  - Media Library            │ │    │
│  │  │  /pricing       │    │  - Users                    │ │    │
│  │  │  /blog          │    │                             │ │    │
│  │  │  /about         │    │                             │ │    │
│  │  │  /faq           │    │                             │ │    │
│  │  │  /contact       │    │                             │ │    │
│  │  └────────┬────────┘    └──────────────┬──────────────┘ │    │
│  │           │                            │                 │    │
│  │           └──────────┬─────────────────┘                 │    │
│  │                      │                                   │    │
│  │              ┌───────▼───────┐                          │    │
│  │              │  Payload API  │                          │    │
│  │              │  (Local API)  │                          │    │
│  │              └───────┬───────┘                          │    │
│  └──────────────────────┼──────────────────────────────────┘    │
│                         │                                        │
└─────────────────────────┼────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SUPABASE                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   PostgreSQL                             │    │
│  │                                                          │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │    │
│  │  │  pages   │ │  cases   │ │  posts   │ │  media   │   │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │    │
│  │  │ pricing  │ │   faq    │ │   team   │ │  users   │   │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │    │
│  │                                                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   Storage (опционально)                  │    │
│  │                   Для медиа-файлов                       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Поток данных

### 1. Публичная часть сайта

```
Пользователь → Next.js Page → Payload Local API → PostgreSQL (Supabase)
                                    ↓
                              Данные (JSON)
                                    ↓
                            React Components
                                    ↓
                              HTML Response
```

### 2. Админ-панель

```
Администратор → /admin → Payload Admin UI → Payload API → PostgreSQL
```

### 3. Формы и заявки

```
Пользователь → Форма → API Route → 
    ├── Supabase (сохранение заявки)
    ├── AmoCRM (создание сделки)
    └── Telegram Bot (уведомление)
```

## Компоненты системы

### Frontend (Next.js App Router)

```
src/app/(frontend)/
├── layout.tsx              # Общий layout (Header, Footer)
├── page.tsx                # Главная страница
├── services/
│   └── page.tsx            # Услуги
├── cases/
│   ├── page.tsx            # Список кейсов
│   └── [slug]/page.tsx     # Детальная страница кейса
├── pricing/
│   └── page.tsx            # Тарифы
├── blog/
│   ├── page.tsx            # Список статей
│   └── [slug]/page.tsx     # Статья
├── about/
│   └── page.tsx            # О компании
├── faq/
│   └── page.tsx            # Частые вопросы
└── contact/
    └── page.tsx            # Форма заявки
```

### Payload CMS

```
src/
├── payload.config.ts       # Главный конфиг
├── collections/
│   ├── Pages.ts            # Страницы (гибкий контент)
│   ├── Cases.ts            # Кейсы
│   ├── BlogPosts.ts        # Статьи блога
│   ├── Pricing.ts          # Тарифы
│   ├── FAQ.ts              # Вопросы-ответы
│   ├── Team.ts             # Команда
│   ├── Media.ts            # Медиа-файлы
│   └── Users.ts            # Пользователи админки
├── blocks/                 # Блоки для конструктора страниц
│   ├── Hero.ts
│   ├── Features.ts
│   ├── CTA.ts
│   ├── Testimonials.ts
│   └── ...
└── globals/
    ├── Header.ts           # Настройки шапки
    ├── Footer.ts           # Настройки подвала
    └── Settings.ts         # Общие настройки сайта
```

### UI Components

```
src/components/
├── ui/                     # Базовые UI компоненты
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── Accordion.tsx
│   └── ...
├── layout/                 # Компоненты макета
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Navigation.tsx
│   └── MobileMenu.tsx
├── sections/               # Секции страниц
│   ├── HeroSection.tsx
│   ├── FeaturesSection.tsx
│   ├── CasesGrid.tsx
│   ├── PricingTable.tsx
│   ├── FAQAccordion.tsx
│   ├── TeamGrid.tsx
│   └── ContactForm.tsx
└── blocks/                 # Рендеринг Payload блоков
    ├── RenderBlocks.tsx
    └── ...
```

## База данных (Supabase PostgreSQL)

### Таблицы (создаются автоматически Payload)

| Таблица | Описание |
|---------|----------|
| `pages` | Страницы сайта |
| `cases` | Кейсы |
| `blog_posts` | Статьи блога |
| `pricing` | Тарифы |
| `faq` | Вопросы-ответы |
| `team` | Команда |
| `media` | Медиа-файлы |
| `users` | Пользователи CMS |
| `payload_preferences` | Настройки Payload |
| `payload_migrations` | Миграции |

### Дополнительные таблицы (создаём вручную)

| Таблица | Описание |
|---------|----------|
| `leads` | Заявки с сайта |
| `quiz_responses` | Ответы на квиз |

## API Routes

```
src/app/api/
├── leads/
│   └── route.ts            # POST: создание заявки
├── quiz/
│   └── route.ts            # POST: сохранение ответов квиза
└── webhook/
    └── amocrm/
        └── route.ts        # Вебхуки из AmoCRM
```

## Кэширование

### Next.js ISR (Incremental Static Regeneration)

```typescript
// Для страниц с редко меняющимся контентом
export const revalidate = 3600 // 1 час

// Для динамических страниц
export const dynamic = 'force-dynamic'
```

### Payload Caching

```typescript
// В payload.config.ts
db: postgresAdapter({
  pool: {
    connectionString: process.env.DATABASE_URI,
  },
  // Кэширование запросов
})
```

## Безопасность

1. **Payload Auth** — встроенная авторизация для админки
2. **Supabase RLS** — Row Level Security для таблицы leads
3. **Rate Limiting** — на API routes для форм
4. **CSRF Protection** — встроено в Next.js
5. **Environment Variables** — секреты в Vercel

## Мониторинг

- **Vercel Analytics** — посещаемость, Core Web Vitals
- **Vercel Logs** — логи приложения
- **Supabase Dashboard** — мониторинг БД

## CI/CD

```
GitHub Push → Vercel Build → Deploy
     │
     └── Preview Deployments для PR
```
