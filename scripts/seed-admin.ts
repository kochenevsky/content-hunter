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

const POOLER_REGIONS = ['eu-central-1', 'us-east-1', 'eu-west-1'] as const

function isConnectionError(err: unknown): boolean {
  const msg = String((err as Error)?.message ?? '')
  return msg.includes('EHOSTUNREACH') || msg.includes('connect') || msg.includes('ECONNREFUSED') || msg.includes('Tenant or user not found')
}

/** Session mode pooler (port 5432) — по документации Supabase всегда использует IPv4. Transaction (6543) не используем. */
function buildPoolerUris(directUri: string): string[] {
  if (!directUri.startsWith('postgres')) return []
  try {
    const url = new URL(directUri.replace(/^postgresql:\/\//, 'https://'))
    const host = url.hostname
    if (!host.endsWith('.supabase.co') || !host.startsWith('db.')) return []
    const projectRef = host.replace('db.', '').replace('.supabase.co', '')
    const password = url.password ? decodeURIComponent(url.password) : ''
    const encoded = encodeURIComponent(password)
    return POOLER_REGIONS.map(
      (region) =>
        `postgresql://postgres.${projectRef}:${encoded}@aws-0-${region}.pooler.supabase.com:5432/postgres`
    )
  } catch {
    return []
  }
}

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

  const { getPayload } = await import('payload')
  const payloadConfig = (await import('../src/payload.config')).default
  const uri = process.env.DATABASE_URI || process.env.DATABASE_URL || ''

  let payload: Awaited<ReturnType<typeof getPayload>> | null = null
  try {
    payload = await getPayload({ config: payloadConfig })
  } catch (firstErr) {
    const err = firstErr instanceof Error ? firstErr : new Error(String(firstErr))
    if (!isConnectionError(err)) throw err
    const poolerUris = buildPoolerUris(uri)
    if (poolerUris.length === 0) {
      console.error('Прямое подключение не удалось. Укажите в .env.local Connection pooler URI из Supabase (Settings → Database).')
      throw err
    }
    for (const poolerUri of poolerUris) {
      try {
        process.env.DATABASE_URI = poolerUri
        payload = await getPayload({ config: payloadConfig })
        break
      } catch {
        continue
      }
    }
    if (!payload) throw err
  }
  if (!payload) throw new Error('Не удалось подключиться к БД')

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

seedAdmin().catch((err: unknown) => {
  if (err != null) console.error(err)
  else console.error('Ошибка подключения к БД. Проверьте DATABASE_URI в .env.local (рекомендуется Connection pooler, Session mode, port 5432).')
  process.exit(1)
})
