# Supabase Storage — настройка загрузки медиа

Payload использует Supabase Storage через **REST API** (не S3).

## 1. Создайте bucket в Supabase

1. Откройте [Supabase Dashboard](https://supabase.com/dashboard) → ваш проект
2. **Storage** → **New bucket**
3. Имя: `media`
4. **Public bucket**: включить
5. **File size limit**: 5 MB (или больше)
6. **Allowed MIME types**: `image/*`, `video/*`

## 2. Переменные окружения

Добавьте в `.env.local` и в Vercel:

```
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=ваш_service_role_key
SUPABASE_STORAGE_BUCKET=media
```

**Service Role Key** — Project Settings → API → `service_role` (secret).  
**SUPABASE_STORAGE_BUCKET** — по умолчанию `media` (опционально).

## 3. RLS (опционально)

При использовании Service Role Key RLS не применяется. Для JWT-доступа настройте политики в Storage → Policies.
