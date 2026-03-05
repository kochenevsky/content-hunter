# Деплой Content Hunter на Timeweb VPS

## Сервер

- **IP:** 5.42.104.246
- **SSH:** `ssh root@5.42.104.246`
- **Путь приложения:** `/var/www/content-hunter`

## Что уже сделано

1. Установлены Node.js 20, pnpm, PM2
2. Репозиторий склонирован в `/var/www/content-hunter`
3. Зависимости установлены, сборка выполнена (если .env был настроен)

## Шаги для завершения миграции

### 1. Подключитесь по SSH

```bash
ssh root@5.42.104.246
# Пароль: (ваш пароль)
```

### 2. Создайте .env с переменными из Vercel

```bash
cd /var/www/content-hunter
nano .env
```

Скопируйте из Vercel (Settings → Environment Variables):

- `DATABASE_URI` — Supabase PostgreSQL (Connection pooler)
- `PAYLOAD_SECRET` — секрет Payload CMS
- `NEXT_PUBLIC_SERVER_URL` — https://ваш-домен.ru (или http://5.42.104.246:3000 для теста)
- `S3_BUCKET`, `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_REGION` — Supabase Storage
- `RESEND_API_KEY` — для формы контактов (опционально)

### 3. Пересоберите и запустите

```bash
cd /var/www/content-hunter
pnpm build
pm2 delete content-hunter 2>/dev/null
pm2 start npm --name content-hunter -- start
pm2 save
pm2 startup  # выполните команду, которую выведет PM2
```

### 4. Проверка

```bash
curl http://localhost:3000
# или откройте в браузере: http://5.42.104.246:3000
```

### 5. Nginx для HTTPS (опционально)

```bash
apt install -y nginx certbot python3-certbot-nginx
nano /etc/nginx/sites-available/content-hunter
```

Содержимое:

```nginx
server {
    listen 80;
    server_name ваш-домен.ru www.ваш-домен.ru;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
ln -sf /etc/nginx/sites-available/content-hunter /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
certbot --nginx -d ваш-домен.ru -d www.ваш-домен.ru
```

## Автоматический деплой (скрипт)

```bash
# Локально (с вашей машины):
SSH_PASS='ваш-пароль' ./scripts/deploy-timeweb.sh
```

Скрипт обновит репо, установит зависимости, соберёт и запустит PM2. `.env` нужно создать вручную (шаг 2 выше).

## Обновление сайта

```bash
ssh root@5.42.104.246
cd /var/www/content-hunter
git pull origin main
pnpm install --frozen-lockfile
pnpm build
pm2 restart content-hunter
```
