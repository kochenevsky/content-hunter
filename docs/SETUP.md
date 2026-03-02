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

Добавить все переменные из `.env.local` в **Project Settings → Environment Variables**. Указать окружения **Production**, **Preview** и обязательно **включить использование при Build** (не только при Runtime), иначе при сборке не выполнится `ensure:settings` и в админке глобалы (home-page и др.) будут показывать «Nothing found».

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

### Коммиты не запускают деплой на Vercel

Если пуши в `main` не вызывают автоматический деплой:

1. **Проверить привязку Git в Vercel**
   - [Vercel Dashboard](https://vercel.com/dashboard) → проект **content-hunter** → **Settings** → **Git**.
   - Должны быть: **Connected Git Repository** = `kochenevsky/content-hunter`, **Production Branch** = `main`, включено **Automatically deploy pushes**.
   - Если репозиторий не подключён или «Not connected» — нажать **Connect Git Repository**, выбрать GitHub и репозиторий `content-hunter`.

2. **Проверить Vercel GitHub App**
   - На [GitHub](https://github.com/settings/installations) → **Applications** → **Vercel** → **Configure**.
   - Убедиться, что репозиторий `content-hunter` в списке разрешённых (или «All repositories»).

3. **Проверить webhook на GitHub**
   - Репозиторий **content-hunter** → **Settings** → **Webhooks**. Должен быть webhook от Vercel (URL вида `https://api.vercel.com/...`). Если нет — отвязать и заново привязать Git в Vercel (п. 1).

4. **Запасной вариант: Deploy Hook**
   - В Vercel: проект → **Settings** → **Git** → **Deploy Hooks**. Создать hook (например, «GitHub main»), скопировать URL.
   - В репозитории на GitHub: **Settings** → **Secrets and variables** → **Actions** → добавить секрет `VERCEL_DEPLOY_HOOK` с этим URL.
   - В репозитории уже есть workflow `.github/workflows/deploy-on-push.yml`: при каждом push в `main` он вызывает этот hook и запускает деплой. После добавления секрета деплой будет срабатывать по коммитам даже при сломанной привязке Git.

### В админке «Nothing found» на /admin/globals/home-page (и других глобалах)

Причина: в БД нет ни одной записи для этого глобала. Часто так бывает, если при билде на Vercel не был доступен `DATABASE_URI` (переменные не включены для Build).

**Решение — пошагово:**

1. **Скопировать продовый DATABASE_URI**
   - Зайти в [Supabase](https://supabase.com/dashboard) → свой проект → **Settings** (слева внизу) → **Database**.
   - В блоке **Connection string** выбрать вкладку **URI**.
   - Включить **Use connection pooling** (Transaction mode).
   - Нажать **Copy** и скопировать строку (она начинается с `postgresql://`).
   - Либо взять тот же URI из Vercel: проект → **Settings** → **Environment Variables** → скопировать значение `DATABASE_URI` для Production.

2. **Вставить URI в проект**
   - Открыть папку проекта на компьютере.
   - Найти файл `.env.local` в корне (рядом с `package.json`). Если его нет — создать: New File → `.env.local`.
   - Открыть `.env.local` и прописать (или заменить уже записанный):
     ```
     DATABASE_URI=сюда_вставить_скопированную_строку
     ```
   - Сохранить файл. Остальные переменные (`PAYLOAD_SECRET` и т.д.) можно не трогать.

3. **Запустить команду**
   - Открыть терминал (в Cursor: Terminal → New Terminal или `` Ctrl+` ``).
   - Перейти в папку проекта: `cd путь/к/Content Hunter` (или просто быть уже в ней).
   - Выполнить:
     ```bash
     pnpm ensure:settings
     ```

4. **Проверить результат**
   - В терминале должны появиться строки вида `✓ home_page: добавлена строка`, `✓ home_page_locales: добавлена строка` и т.д.
   - Открыть в браузере админку (например `https://contenthunter.ru/admin/globals/home-page`) и обновить страницу — «Nothing found» должно исчезнуть.

Скрипт только добавляет недостающие строки, существующие данные не перезаписывает.

Чтобы не повторялось: в Vercel для переменной `DATABASE_URI` включить использование при **Build** (в настройках переменной окружения).

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
