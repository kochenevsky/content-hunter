// @ts-nocheck
/**
 * Гарантирует наличие строк в глобальных таблицах Payload (header, footer, settings).
 * Без хотя бы одной строки админка показывает "Nothing found".
 * Запуск: pnpm ensure:settings
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
  const pool = new pg.Pool({ ...config, connectionTimeoutMillis: 5000 })
  const inserts = [
    { table: 'header', sql: `INSERT INTO public.header (logo_id) SELECT NULL FROM (SELECT 1) x WHERE NOT EXISTS (SELECT 1 FROM public.header LIMIT 1) RETURNING id` },
    { table: 'footer', sql: `INSERT INTO public.footer SELECT nextval('footer_id_seq'), now(), now() FROM (SELECT 1) x WHERE NOT EXISTS (SELECT 1 FROM public.footer LIMIT 1) RETURNING id` },
    { table: 'settings', sql: `INSERT INTO public.settings (site_name) SELECT 'Content Hunter' WHERE NOT EXISTS (SELECT 1 FROM public.settings LIMIT 1) RETURNING id` },
  ]
  try {
    for (const { table, sql } of inserts) {
      try {
        const res = await pool.query(sql)
        if (res.rowCount && res.rowCount > 0) {
          console.log(`✓ ${table}: добавлена строка`)
        }
      } catch (e: any) {
        console.warn(`ensure:settings: ${table}:`, e.message)
      }
    }
  } finally {
    await pool.end()
  }
  process.exit(0)
}

main()
