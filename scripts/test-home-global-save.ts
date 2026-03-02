/**
 * Локальная проверка сохранения глобала home-page.
 * Запуск: pnpm exec tsx scripts/test-home-global-save.ts
 */
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })
dotenv.config({ path: path.join(__dirname, '..', '.env') })

async function main() {
  if (!process.env.DATABASE_URI && !process.env.DATABASE_URL) {
    console.log('DATABASE_URI не задан — пропуск (запустите с .env.local)')
    process.exit(0)
  }
  let payload
  try {
    const payloadConfig = (await import('../src/payload.config')).default
    const { getPayload } = await import('payload')
    payload = await getPayload({ config: payloadConfig })
  } catch (e: unknown) {
    console.log('Подключение к БД не удалось (нужен DATABASE_URI с доступной БД):', (e as Error)?.message)
    process.exit(0)
  }
  const existing = await payload.findGlobal({ slug: 'home-page' })
  console.log('Текущий id глобала:', (existing as { id?: number })?.id)

  const data = {
    id: existing?.id ?? 1,
    hero: {
      headline: existing?.hero?.headline ?? 'Test',
      subheadline: existing?.hero?.subheadline ?? 'Test sub',
    },
  }

  try {
    await payload.updateGlobal({
      slug: 'home-page',
      data: data as never,
    })
    console.log('✓ updateGlobal успешен')
  } catch (err: unknown) {
    console.error('✗ Ошибка:', err)
    if (err && typeof err === 'object' && 'message' in err) {
      console.error('Message:', (err as Error).message)
    }
    if (err && typeof err === 'object' && 'data' in err) {
      console.error('Data:', (err as { data?: unknown }).data)
    }
    process.exit(1)
  }
  process.exit(0)
}

main()
