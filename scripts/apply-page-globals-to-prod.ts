// @ts-nocheck
/**
 * Применяет миграцию page globals к БД из DATABASE_URI.
 * Запуск: DATABASE_URI="postgresql://postgres:PASS@db.feytgokjblyqzymadfym.supabase.co:5432/postgres" pnpm apply:prod
 */
import 'dotenv/config'
import pg from 'pg'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

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
  throw new Error('DATABASE_URI не задан. Пример: DATABASE_URI="postgresql://postgres:PASS@db.feytgokjblyqzymadfym.supabase.co:5432/postgres"')
}

async function main() {
  const uri = process.env.DATABASE_URI || process.env.DATABASE_URL
  if (!uri || !uri.includes('feytgokjblyqzymadfym')) {
    console.warn('⚠️  Убедитесь, что DATABASE_URI указывает на production (feytgokjblyqzymadfym)')
  }
  const config = parseDbConfig()
  const pool = new pg.Pool({ ...config, connectionTimeoutMillis: 15000 })
  const sql = readFileSync(join(__dirname, 'apply-page-globals-to-prod.sql'), 'utf8')
  const client = await pool.connect()
  try {
    await client.query(sql)
    console.log('✓ Миграция применена')
  } catch (e: any) {
    if (e.code === '42P07') {
      console.log('Некоторые таблицы уже существуют (ожидаемо при повторном запуске)')
    }
    throw e
  } finally {
    client.release()
    await pool.end()
  }
  process.exit(0)
}

main().catch((e) => {
  console.error('✗', e.message)
  process.exit(1)
})
