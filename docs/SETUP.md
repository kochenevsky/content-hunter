# Инструкция по настройке проекта

## Предварительные требования

- Node.js 18.17+
- pnpm (рекомендуется) или npm
- Аккаунт Supabase
- Аккаунт Vercel
- Аккаунт GitHub

## Шаг 1: Создание проекта

### 1.1 Инициализация Payload CMS

```bash
cd "/Users/kochenevsky/Content Hunter"
pnpm create payload-app@latest .
```

При установке выбрать:
- **Project name**: content-hunter
- **Database**: PostgreSQL (для Supabase)
- **Template**: blank или website

### 1.2 Структура после установки

```
content-hunter/
├── src/
│   ├── app/
│   ├── collections/
│   └── payload.config.ts
├── package.json
├── next.config.mjs
└── tsconfig.json
```

## Шаг 2: Настройка Supabase

### 2.1 Создание проекта в Supabase

1. Перейти на [supabase.com](https://supabase.com)
2. Создать новый проект
3. Дождаться инициализации (~2 минуты)

### 2.2 Получение строки подключения

1. Settings → Database → Connection string
2. Выбрать **URI** 
3. Скопировать строку:

```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### 2.3 Настройка Pooler (рекомендуется для Vercel)

Для serverless окружения использовать Transaction Pooler:

1. Settings → Database → Connection Pooling
2. Включить Pooler
3. Скопировать Transaction pooler connection string:

```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

## Шаг 3: Настройка переменных окружения

### 3.1 Локальная разработка

Создать файл `.env.local`:

```env
# Supabase PostgreSQL
DATABASE_URI=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# Payload
PAYLOAD_SECRET=your-super-secret-key-min-32-chars

# URL
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

### 3.2 Генерация PAYLOAD_SECRET

```bash
openssl rand -base64 32
```

### 3.3 Первый администратор

Если в БД ещё нет пользователей, создайте первого админа:

```bash
pnpm run seed:admin
```

Будет создан пользователь:

- **Email:** `admin@contenthunter.ru`
- **Пароль:** `Admin123!`
- **Роль:** администратор

После входа в админку (`/admin`) рекомендуется сменить пароль.

## Шаг 4: Установка зависимостей

```bash
pnpm install
```

### Дополнительные пакеты

```bash
# UI
pnpm add tailwindcss postcss autoprefixer
pnpm add @radix-ui/react-accordion @radix-ui/react-dialog
pnpm add lucide-react
pnpm add class-variance-authority clsx tailwind-merge

# Формы
pnpm add react-hook-form @hookform/resolvers zod

# Анимации (опционально)
pnpm add framer-motion
```

## Шаг 5: Настройка Tailwind CSS

### 5.1 Инициализация

```bash
pnpm dlx tailwindcss init -p
```

### 5.2 Конфигурация `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        // Цвета бренда Content Hunter
        brand: {
          dark: '#1a1a2e',
          accent: '#e94560',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
```

## Шаг 6: Первый запуск

```bash
pnpm dev
```

Приложение будет доступно:
- Сайт: http://localhost:3000
- Админка: http://localhost:3000/admin

### Создание первого пользователя

При первом входе в `/admin` будет предложено создать администратора.

## Шаг 7: Деплой на Vercel

### 7.1 Подготовка репозитория

```bash
git init
git add .
git commit -m "Initial commit: Payload CMS + Next.js"
git remote add origin https://github.com/username/content-hunter.git
git push -u origin main
```

### 7.2 Подключение к Vercel

1. Перейти на [vercel.com](https://vercel.com)
2. Import Git Repository
3. Выбрать репозиторий

### 7.3 Настройка Build

- **Framework Preset**: Next.js
- **Build Command**: `pnpm build`
- **Output Directory**: `.next`
- **Install Command**: `pnpm install`

### 7.4 Environment Variables в Vercel

Добавить все переменные из `.env.local`:

| Key | Value |
|-----|-------|
| `DATABASE_URI` | postgresql://... (Pooler URL) |
| `PAYLOAD_SECRET` | your-secret |
| `NEXT_PUBLIC_SERVER_URL` | https://your-domain.vercel.app |

### 7.5 Деплой

Нажать **Deploy** и дождаться завершения.

## Шаг 8: Пост-деплой

### 8.1 Настройка домена

1. Vercel Dashboard → Settings → Domains
2. Добавить свой домен
3. Настроить DNS записи

### 8.2 Создание первых данных

1. Перейти в `/admin`
2. Создать тарифы
3. Добавить кейсы
4. Настроить FAQ
5. Добавить команду

## Возможные проблемы

### Ошибка подключения к БД

```
Error: Connection refused
```

**Решение**: Проверить DATABASE_URI, убедиться что Supabase проект активен.

### Ошибка сборки на Vercel

```
Error: PAYLOAD_SECRET is required
```

**Решение**: Добавить PAYLOAD_SECRET в Environment Variables на Vercel.

### Timeout на Vercel

```
Error: Serverless Function timeout
```

**Решение**: Использовать Supabase Transaction Pooler вместо прямого подключения.

## Полезные ссылки

- [Payload CMS Docs](https://payloadcms.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
