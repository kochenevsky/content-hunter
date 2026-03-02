/**
 * Локальная проверка роута POST /api/globals/home-page (как из админки).
 * Запуск: pnpm dev (в одном терминале), затем pnpm exec tsx scripts/test-home-page-route.ts
 * Для успешного сохранения нужен DATABASE_URI в .env.local, доступный с вашей машины (или тот же Supabase, что на проде).
 * Без БД получите 500 с текстом "cannot connect to Postgres" — так же может быть на Vercel, если DATABASE_URI не задан или БД недоступна.
 */
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const BASE = process.env.TEST_BASE_URL || 'http://localhost:3000'

async function main() {
  console.log('POST', `${BASE}/api/globals/home-page?depth=0&fallback-locale=null&locale=ru`)
  const body = {
    id: 1,
    hero: {
      headline: { ru: 'Test headline' },
      subheadline: { ru: 'Test sub' },
    },
  }
  try {
    const res = await fetch(`${BASE}/api/globals/home-page?depth=0&fallback-locale=null&locale=ru`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const text = await res.text()
    let json: unknown
    try {
      json = JSON.parse(text)
    } catch {
      json = text
    }
    console.log('Status:', res.status)
    console.log('X-Payload-Error:', res.headers.get('X-Payload-Error'))
    console.log('Body:', typeof json === 'object' ? JSON.stringify(json, null, 2) : json)
    if (!res.ok) {
      const errMsg = typeof json === 'object' && json !== null && 'error' in json ? String((json as { error?: unknown }).error) : ''
      if (errMsg.includes('not allowed')) {
        console.log('\n→ Без авторизации доступ запрещён — норма. В админке запрос идёт с куками, сохранение будет 200.')
        process.exit(0)
      }
      process.exit(1)
    }
    console.log('OK')
  } catch (e) {
    console.error('Request failed:', e)
    process.exit(1)
  }
}

main()
