# API спецификация

## Endpoints

### POST `/api/leads`

Создание новой заявки с сайта.

#### Request

```typescript
interface LeadRequest {
  name: string           // Имя клиента
  phone?: string         // Телефон
  email?: string         // Email
  telegram?: string      // Telegram username
  company?: string       // Название компании
  niche?: string         // Ниша бизнеса
  budget?: string        // Бюджет на маркетинг
  message?: string       // Сообщение
  source: string         // Источник (форма, квиз, CTA)
  page: string           // URL страницы
  utm?: {
    source?: string
    medium?: string
    campaign?: string
    content?: string
    term?: string
  }
}
```

#### Response

```typescript
// Success (201)
interface LeadResponse {
  success: true
  id: string
  message: string
}

// Error (400/500)
interface ErrorResponse {
  success: false
  error: string
}
```

#### Example

```bash
curl -X POST https://domain.com/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Иван Петров",
    "telegram": "@ivanpetrov",
    "niche": "e-commerce",
    "source": "contact_form",
    "page": "/contact"
  }'
```

---

### POST `/api/quiz`

Сохранение ответов квиза.

#### Request

```typescript
interface QuizRequest {
  answers: {
    questionId: string
    answer: string | string[]
  }[]
  contact: {
    name: string
    telegram?: string
    phone?: string
  }
  source: string
  page: string
}
```

#### Response

```typescript
interface QuizResponse {
  success: true
  id: string
  recommendation?: string  // Рекомендуемый тариф
}
```

---

## Интеграции

### AmoCRM

При создании заявки автоматически создаётся сделка в AmoCRM.

```typescript
// Маппинг полей
const amoFields = {
  name: lead.name,
  pipeline_id: PIPELINE_ID,
  status_id: STATUS_NEW,
  custom_fields: [
    { field_id: FIELD_PHONE, value: lead.phone },
    { field_id: FIELD_TELEGRAM, value: lead.telegram },
    { field_id: FIELD_NICHE, value: lead.niche },
    { field_id: FIELD_SOURCE, value: lead.source },
  ],
  tags: [lead.niche, lead.source],
}
```

### Telegram Bot (SaleBot)

Уведомление в Telegram при новой заявке.

```typescript
// Формат сообщения
const message = `
🔔 Новая заявка с сайта

👤 ${lead.name}
📱 ${lead.telegram || lead.phone}
🏢 ${lead.company || 'Не указано'}
📊 Ниша: ${lead.niche}
💰 Бюджет: ${lead.budget}

📝 ${lead.message}

🔗 Источник: ${lead.source}
📄 Страница: ${lead.page}
`
```

---

## Supabase таблицы

### leads

```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  telegram TEXT,
  company TEXT,
  niche TEXT,
  budget TEXT,
  message TEXT,
  source TEXT NOT NULL,
  page TEXT NOT NULL,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  status TEXT DEFAULT 'new',
  amo_deal_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Политика: только insert для анонимных
CREATE POLICY "Anyone can insert leads" ON leads
  FOR INSERT WITH CHECK (true);

-- Политика: только authenticated для select
CREATE POLICY "Authenticated can view leads" ON leads
  FOR SELECT USING (auth.role() = 'authenticated');
```

### quiz_responses

```sql
CREATE TABLE quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id),
  answers JSONB NOT NULL,
  recommendation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert quiz" ON quiz_responses
  FOR INSERT WITH CHECK (true);
```

---

## Rate Limiting

API endpoints защищены rate limiting:

| Endpoint | Лимит | Период |
|----------|-------|--------|
| `/api/leads` | 5 запросов | 1 минута |
| `/api/quiz` | 10 запросов | 1 минута |

Реализация через Vercel Edge Config или middleware.

---

## Валидация

### Zod схемы

```typescript
import { z } from 'zod'

export const leadSchema = z.object({
  name: z.string().min(2, 'Имя слишком короткое'),
  phone: z.string().optional(),
  email: z.string().email('Некорректный email').optional(),
  telegram: z.string().optional(),
  company: z.string().optional(),
  niche: z.enum([
    'ecommerce',
    'edu',
    'expert',
    'horeca',
    'beauty',
    'travel',
    'realestate',
    'clinic',
    'other'
  ]).optional(),
  budget: z.string().optional(),
  message: z.string().max(1000).optional(),
  source: z.string(),
  page: z.string(),
  utm: z.object({
    source: z.string().optional(),
    medium: z.string().optional(),
    campaign: z.string().optional(),
    content: z.string().optional(),
    term: z.string().optional(),
  }).optional(),
}).refine(
  (data) => data.phone || data.email || data.telegram,
  { message: 'Укажите хотя бы один способ связи' }
)
```

---

## Переменные окружения

```env
# AmoCRM
AMOCRM_SUBDOMAIN=contenthunter
AMOCRM_CLIENT_ID=xxx
AMOCRM_CLIENT_SECRET=xxx
AMOCRM_REDIRECT_URI=xxx
AMOCRM_ACCESS_TOKEN=xxx
AMOCRM_REFRESH_TOKEN=xxx

# Telegram Bot
TELEGRAM_BOT_TOKEN=xxx
TELEGRAM_CHAT_ID=xxx

# Supabase (для прямых запросов если нужно)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
```
