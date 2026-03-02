/**
 * Сид глобалов в production (home-page и др.).
 * Вызов: GET /api/seed-home?secret=YOUR_SEED_SECRET
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
    // 0. ensureSchema — таблицы и колонки (если миграции не применялись)
    await client.query(`
      CREATE TABLE IF NOT EXISTS home_page_video_examples_items_vimeo_ids (
        _order integer NOT NULL, _parent_id varchar NOT NULL, id varchar PRIMARY KEY, label varchar
      )
    `)
    try { await client.query(`CREATE INDEX IF NOT EXISTS home_page_video_examples_items_vimeo_ids_order_idx ON home_page_video_examples_items_vimeo_ids (_order)`) } catch (_) {}
    try { await client.query(`CREATE INDEX IF NOT EXISTS home_page_video_examples_items_vimeo_ids_parent_id_idx ON home_page_video_examples_items_vimeo_ids (_parent_id)`) } catch (_) {}
    try {
      await client.query(`ALTER TABLE home_page_video_examples_items_vimeo_ids ADD CONSTRAINT home_page_video_examples_items_vimeo_ids_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES home_page_video_examples_items(id) ON DELETE CASCADE`)
    } catch (e: any) { if (e.code !== '42P07' && e.code !== '42710') {} /* FK optional */ }
    const alters = [
      'home_page:hero_primary_button_link', 'home_page:hero_secondary_button_link', 'home_page:cta_primary_button_link', 'home_page:cta_telegram_link',
      'home_page_locales:hero_primary_button_text', 'home_page_locales:hero_secondary_button_text', 'home_page_locales:cta_secondary_button_text',
    ]
    for (const a of alters) {
      const [t, c] = a.split(':')
      try { await client.query(`ALTER TABLE ${t} ADD COLUMN IF NOT EXISTS ${c} varchar`) } catch (e: any) { if (e.code !== '42701') throw e }
    }

    // 1. Создаём родительские записи глобалов
    for (const t of ['home_page', 'services_page', 'about_page', 'pricing_page', 'faq_page']) {
      try {
        await client.query(`INSERT INTO ${t} (id) SELECT 1 WHERE NOT EXISTS (SELECT 1 FROM ${t} WHERE id = 1)`)
      } catch (e: any) {
        if (e.code !== '23505') throw e
      }
    }

    const homeId = 1
    // 2. home_page_locales — Payload требует хотя бы одну locale-строку для отображения формы
    const locCheck = await client.query(
      `SELECT 1 FROM home_page_locales WHERE _locale = 'ru'::_locales AND _parent_id = $1`,
      [homeId]
    )
    if (locCheck.rowCount === 0) {
      const localeRows = [
        'Контент-завод для бизнеса',
        'Разворачиваем систему массовой дистрибуции коротких видео.',
        'Почему ваш SMM не приносит результатов',
        'Контент перестал быть дефицитом...',
        'Холодная математика', 'вместо надежды',
        '50 роликов × 20 аккаунтов = 1000 публикаций в месяц',
        'Вместо лотереи — производство.',
        'Как работает контент-завод', 'Полный цикл',
        'Примеры работ', 'Реальные ролики',
        'С кем мы работаем', 'B2C-бизнес',
        'Чем мы отличаемся', 'Content Hunter — это не SMM-агентство.',
        'Готовы запустить', 'контент-завод?',
        'Получите бесплатный аудит и стратегию.',
        'Получить консультацию',
        'Получить консультацию', 'Смотреть кейсы', 'Написать в Telegram',
      ]
      await client.query(`
        INSERT INTO home_page_locales (
          hero_headline, hero_subheadline, problem_title, problem_text,
          solution_title, solution_title_highlight, solution_formula, solution_text,
          how_it_works_title, how_it_works_subtitle,
          video_examples_title, video_examples_subtitle,
          niches_title, niches_subtitle,
          comparison_title, comparison_subtitle,
          cta_headline, cta_headline_highlight, cta_text, cta_primary_button_text,
          hero_primary_button_text, hero_secondary_button_text, cta_secondary_button_text,
          _locale, _parent_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, 'ru'::_locales, $24)
      `, [...localeRows, homeId])
      // Ссылки кнопок задаём только при первой инициализации (когда только что создали locale)
      await client.query(
        `UPDATE home_page SET hero_primary_button_link=COALESCE(hero_primary_button_link,'/contact'), hero_secondary_button_link=COALESCE(hero_secondary_button_link,'/cases'), cta_primary_button_link=COALESCE(cta_primary_button_link,'/contact'), cta_telegram_link=COALESCE(cta_telegram_link,'https://t.me/contenthunter_bot') WHERE id=$1`,
        [homeId]
      )
    }

    return NextResponse.json({ ok: true, message: 'home-page и locales готовы (существующие данные не перезаписывались)' })
  } catch (error) {
    console.error('seed-home error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  } finally {
    client.release()
    await pool.end()
  }
}
