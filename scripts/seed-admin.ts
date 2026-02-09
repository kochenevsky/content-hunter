/**
 * Создаёт первого пользователя-администратора, если в БД ещё нет пользователей.
 * Запуск: pnpm run seed:admin
 *
 * Учётные данные по умолчанию:
 *   Email: admin@contenthunter.ru
 *   Пароль: Admin123!
 *
 * После первого входа смените пароль в админке.
 */

// Force IPv4 DNS resolution
import dns from 'dns'
dns.setDefaultResultOrder('ipv4first')

import path from 'path'
import { fileURLToPath } from 'url'
import { config as loadEnv } from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
// Важно: загрузить env до импорта Payload, иначе PAYLOAD_SECRET не попадёт в process.env
loadEnv({ path: path.join(root, '.env.local') })
loadEnv({ path: path.join(root, '.env') })

const DEFAULT_EMAIL = 'admin@contenthunter.ru'
const DEFAULT_PASSWORD = 'Admin123!'
const DEFAULT_NAME = 'Администратор'

async function seedAdmin() {
  if (!process.env.DATABASE_URI && !process.env.DATABASE_URL) {
    console.error('Ошибка: нужны переменные DATABASE_URI (или DATABASE_URL) и PAYLOAD_SECRET.')
    console.error('Добавьте их в .env.local в корне проекта (образец — .env.example).')
    console.error('PAYLOAD_SECRET сгенерируйте: openssl rand -base64 32')
    process.exit(1)
  }
  if (!process.env.PAYLOAD_SECRET) {
    console.error('Ошибка: нужна переменная PAYLOAD_SECRET в .env.local или .env')
    process.exit(1)
  }

  const uri = process.env.DATABASE_URI || process.env.DATABASE_URL || ''
  try {
    const url = new URL(uri.replace(/^postgresql:\/\//, 'https://'))
    const host = url.hostname
    const ipv4 = await dns.promises.lookup(host, { family: 4 })
    const newUri = uri.replace(host, ipv4.address)
    if (process.env.DATABASE_URI) process.env.DATABASE_URI = newUri
    if (process.env.DATABASE_URL) process.env.DATABASE_URL = newUri
  } catch {
    // оставляем URI как есть, если не удалось резолвить в IPv4
  }

  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config })

  const { totalDocs } = await payload.find({
    collection: 'users',
    limit: 0,
  })

  if (totalDocs > 0) {
    console.log('Пользователи уже есть в БД. Первый админ не создаётся.')
    process.exit(0)
  }

  await payload.create({
    collection: 'users',
    data: {
      email: DEFAULT_EMAIL,
      password: DEFAULT_PASSWORD,
      name: DEFAULT_NAME,
      role: 'admin',
    },
    overrideAccess: true,
  })

  console.log('Первый администратор создан.')
  console.log('  Админка:     ', process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000', '/admin')
  console.log('  Email:       ', DEFAULT_EMAIL)
  console.log('  Пароль:      ', DEFAULT_PASSWORD)
  console.log('  Рекомендуется сменить пароль после входа.')
  process.exit(0)
}

seedAdmin().catch((err) => {
  console.error(err)
  process.exit(1)
})
