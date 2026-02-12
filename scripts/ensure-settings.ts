// @ts-nocheck
/**
 * Гарантирует наличие строки в settings (Payload глобал «Настройки сайта»).
 * Запуск: pnpm ensure:settings
 * Подгружает .env из корня проекта при наличии.
 */
import 'dotenv/config'
import pg from 'pg'

function parseDbConfig() {
  const uri = process.env.DATABASE_URI || process.env.DATABASE_URL || ''
  if (uri && uri.startsWith('postgres')) {
    try {
      const url = new URL(uri.replace(/^postgresql?:\/\//, 'http://'))
      return {
        host: url.hostname,
        port: Number(url.port) || 5432,
        user: decodeURIComponent(url.username),
        password: decodeURIComponent(url.password),
        database: url.pathname.replace(/^\//, '') || 'postgres',
        ssl: { rejectUnauthorized: false },
      }
    } catch {
      return { connectionString: uri, ssl: { rejectUnauthorized: false } }
    }
  }
  return {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'postgres',
    ssl: { rejectUnauthorized: false },
  }
}

async function main() {
  const uri = process.env.DATABASE_URI || process.env.DATABASE_URL
  if (!uri || !uri.startsWith('postgres')) {
    console.log('ensure:settings: DATABASE_URI не задан, пропуск')
    process.exit(0)
  }
  const config = parseDbConfig()
  const pool = new pg.Pool(config)
  try {
    const res = await pool.query(
      `INSERT INTO public.settings (site_name)
       SELECT 'Content Hunter'
       WHERE NOT EXISTS (SELECT 1 FROM public.settings LIMIT 1)
       RETURNING id`
    )
    if (res.rowCount && res.rowCount > 0) {
      console.log('✓ settings: добавлена строка по умолчанию')
    } else {
      console.log('✓ settings: строка уже существует')
    }
  } catch (e: any) {
    console.error('✗ Ошибка:', e.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
  process.exit(0)
}

main()
