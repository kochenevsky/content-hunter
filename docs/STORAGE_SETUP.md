# Supabase Storage — настройка загрузки медиа

Payload использует Supabase Storage через S3-совместимый API.

## 0. Включите S3 в Supabase

1. **Project Settings** → **Storage** → найдите **S3 protocol**
2. Включите опцию **Enable S3 connection** (если она есть)
3. Без этого S3-запросы будут возвращать ошибки

## 1. Создайте bucket в Supabase

1. Откройте [Supabase Dashboard](https://supabase.com/dashboard) → ваш проект
2. **Storage** → **New bucket**
3. Имя: `media`
4. **Public bucket**: включить (чтобы изображения отдавались по URL)
5. **File size limit**: 5 MB (или больше)
6. **Allowed MIME types**: `image/*`, `video/*` (или оставить пустым для любых)

## 2. Сгенерируйте S3 Access Keys

1. **Project Settings** → **Storage** → **S3 Access Keys**
2. Нажмите **Generate new key**
3. Сохраните **Access Key ID** и **Secret Access Key** — они показываются только один раз

## 3. Переменные окружения

Добавьте в `.env.local` и в Vercel (Settings → Environment Variables):

```
S3_BUCKET=media
S3_ENDPOINT=https://YOUR_PROJECT_REF.storage.supabase.co/storage/v1/s3
S3_ACCESS_KEY_ID=ваш_access_key_id
S3_SECRET_ACCESS_KEY=ваш_secret_access_key
S3_REGION=eu-west-1
```

**YOUR_PROJECT_REF** — это поддомен вашего проекта (например, `feytgokjblyqzymadfym` из URL `https://feytgokjblyqzymadfym.supabase.co`).

## 4. RLS политики (опционально)

Для S3 Access Keys RLS не применяется — ключи дают полный доступ. Если используете только REST API с JWT, настройте политики в Storage → Policies.
