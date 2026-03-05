#!/bin/bash
# Деплой Content Hunter на Timeweb VPS
# Запуск: SSH_PASS='пароль' ./scripts/deploy-timeweb.sh
# Или: ./scripts/deploy-timeweb.sh  (пароль запросится)
set -e
HOST="5.42.104.246"
USER="root"
REPO="https://github.com/kochenevsky/content-hunter.git"
APP_DIR="/var/www/content-hunter"
DOMAIN="${DOMAIN:-contenthunter.ru}"

if [ -z "$SSH_PASS" ]; then
  echo "Введите пароль SSH для root@$HOST:"
  read -s SSH_PASS
fi

run_remote() {
  sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no -o ConnectTimeout=30 "$USER@$HOST" "$@"
}

echo "=== 1. Проверка окружения ==="
run_remote "command -v node >/dev/null 2>&1 || (curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs)"
run_remote "command -v pnpm >/dev/null 2>&1 || npm install -g pnpm"
run_remote "command -v pm2 >/dev/null 2>&1 || npm install -g pm2"
run_remote "node -v && pnpm -v"

echo "=== 2. Клонирование/обновление репозитория ==="
run_remote "mkdir -p $APP_DIR && cd $APP_DIR && (test -d .git && git pull origin main || git clone $REPO .)"

echo "=== 3. Создание .env (если нет) ==="
run_remote "test -f $APP_DIR/.env || (cp $APP_DIR/.env.example $APP_DIR/.env && echo 'Создан .env из примера — отредактируйте: nano $APP_DIR/.env')"

echo "=== 4. Установка зависимостей и сборка ==="
run_remote "cd $APP_DIR && pnpm install --frozen-lockfile && pnpm build"

echo "=== 5. Настройка PM2 ==="
run_remote "cd $APP_DIR && pm2 delete content-hunter 2>/dev/null || true"
run_remote "cd $APP_DIR && pm2 start npm --name content-hunter -- start"
run_remote "pm2 save && (pm2 startup systemd -u root --hp /root 2>/dev/null || true)"

echo "=== 6. Nginx (если установлен) ==="
run_remote "command -v nginx >/dev/null 2>&1 && echo 'nginx установлен' || apt-get install -y nginx"

echo ""
echo "=== Готово ==="
echo "Сайт: http://$HOST:3000"
echo ""
echo "ВАЖНО: Скопируйте переменные из Vercel в .env на сервере:"
echo "  ssh $USER@$HOST"
echo "  nano $APP_DIR/.env"
echo "  # DATABASE_URI, PAYLOAD_SECRET, NEXT_PUBLIC_SERVER_URL, S3_* и др."
echo "  pm2 restart content-hunter"
echo ""
echo "Для HTTPS настройте nginx: proxy_pass http://127.0.0.1:3000"
