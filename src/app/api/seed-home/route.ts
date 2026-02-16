/**
 * Одноразовый сид глобалов в production.
 * Вызов: GET /api/seed-home?secret=YOUR_SEED_SECRET
 * В Vercel env добавьте SEED_SECRET.
 */
import { NextResponse } from 'next/server'
import pg from 'pg'

function parseDbConfig() {
  const uri = process.env.DATABASE_URI || process.env.DATABASE_URL || ''
  if (!uri.startsWith('postgres')) throw new Error('DATABASE_URI не задан')
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

export async function GET(request: Request) {
  const secret = new URL(request.url).searchParams.get('secret')
  if (secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const pool = new pg.Pool(parseDbConfig())
  const client = await pool.connect()
  try {
    for (const t of ['home_page', 'services_page', 'about_page', 'pricing_page', 'faq_page']) {
      try {
        await client.query(`INSERT INTO ${t} (id) SELECT 1 WHERE NOT EXISTS (SELECT 1 FROM ${t} WHERE id = 1)`)
      } catch (e: any) {
        if (e.code !== '23505') throw e
      }
    }
    return NextResponse.json({ ok: true, message: 'Глобалы созданы' })
  } catch (error) {
    console.error('seed-home error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  } finally {
    client.release()
    await pool.end()
  }
}
