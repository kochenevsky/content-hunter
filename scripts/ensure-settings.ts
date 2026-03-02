// @ts-nocheck
/**
 * Гарантирует наличие строк в глобальных таблицах Payload (header, footer, settings, home_page и др.).
 * Без хотя бы одной строки админка показывает "Nothing found" на /admin/globals/home-page и др.
 *
 * На Vercel при билде DATABASE_URI часто недоступен → скрипт пропускается → в проде пусто.
 * Если в админке "Nothing found" — один раз запустить локально:
 *   pnpm ensure:settings
 * (читает DATABASE_URI из .env.local; только добавляет недостающее, существующие данные не перезаписывает)
 *
 * Запуск: pnpm ensure:settings
 */
import dotenv from 'dotenv'
import pg from 'pg'

// Подгружаем .env и .env.local (локальные переопределения, в т.ч. DATABASE_URI для продовой БД)
dotenv.config()
dotenv.config({ path: '.env.local', override: true })

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
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS home_page_video_examples_items_vimeo_ids (
        _order integer NOT NULL, _parent_id varchar NOT NULL, id varchar PRIMARY KEY, label varchar
      )
    `)
    try { await pool.query(`CREATE INDEX IF NOT EXISTS home_page_video_examples_items_vimeo_ids_order_idx ON home_page_video_examples_items_vimeo_ids (_order)`) } catch (_) {}
    try { await pool.query(`CREATE INDEX IF NOT EXISTS home_page_video_examples_items_vimeo_ids_parent_id_idx ON home_page_video_examples_items_vimeo_ids (_parent_id)`) } catch (_) {}
    try { await pool.query(`ALTER TABLE home_page_video_examples_items_vimeo_ids ADD CONSTRAINT home_page_video_examples_items_vimeo_ids_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES home_page_video_examples_items(id) ON DELETE CASCADE`) } catch (e: any) { if (e.code !== '42P07' && e.code !== '42710') {} }
  } catch (e: any) { console.warn('ensure:settings vimeo_ids:', e.message) }
  const inserts = [
    { table: 'header', sql: `INSERT INTO public.header (logo_id) SELECT NULL FROM (SELECT 1) x WHERE NOT EXISTS (SELECT 1 FROM public.header LIMIT 1) RETURNING id` },
    { table: 'footer', sql: `INSERT INTO public.footer SELECT nextval('footer_id_seq'), now(), now() FROM (SELECT 1) x WHERE NOT EXISTS (SELECT 1 FROM public.footer LIMIT 1) RETURNING id` },
    { table: 'settings', sql: `INSERT INTO public.settings (site_name) SELECT 'Content Hunter' WHERE NOT EXISTS (SELECT 1 FROM public.settings LIMIT 1) RETURNING id` },
    { table: 'home_page', sql: `INSERT INTO public.home_page (id) SELECT 1 WHERE NOT EXISTS (SELECT 1 FROM public.home_page WHERE id = 1)` },
    { table: 'services_page', sql: `INSERT INTO public.services_page (id) SELECT 1 WHERE NOT EXISTS (SELECT 1 FROM public.services_page WHERE id = 1)` },
    { table: 'about_page', sql: `INSERT INTO public.about_page (id) SELECT 1 WHERE NOT EXISTS (SELECT 1 FROM public.about_page WHERE id = 1)` },
    { table: 'pricing_page', sql: `INSERT INTO public.pricing_page (id) SELECT 1 WHERE NOT EXISTS (SELECT 1 FROM public.pricing_page WHERE id = 1)` },
    { table: 'faq_page', sql: `INSERT INTO public.faq_page (id) SELECT 1 WHERE NOT EXISTS (SELECT 1 FROM public.faq_page WHERE id = 1)` },
  ]
  try {
    for (const { table, sql } of inserts) {
      try {
        const res = await pool.query(sql)
        if (res.rowCount && res.rowCount > 0) {
          console.log(`✓ ${table}: добавлена строка`)
        }
      } catch (e: any) {
        if (e.code === '23505') { /* duplicate, ok */ } else {
          console.warn(`ensure:settings: ${table}:`, e.message)
        }
      }
    }
    // home_page_locales — Payload требует locale для отображения формы
    const locCheck = await pool.query(`SELECT 1 FROM home_page_locales WHERE _locale = 'ru'::_locales AND _parent_id = 1`)
    if (locCheck.rowCount === 0) {
      try {
        await pool.query(`
          INSERT INTO home_page_locales (hero_headline, hero_subheadline, problem_title, problem_text, solution_title, solution_title_highlight, solution_formula, solution_text, how_it_works_title, how_it_works_subtitle, video_examples_title, video_examples_subtitle, niches_title, niches_subtitle, comparison_title, comparison_subtitle, cta_headline, cta_headline_highlight, cta_text, cta_primary_button_text, hero_primary_button_text, hero_secondary_button_text, cta_secondary_button_text, _locale, _parent_id)
          VALUES ('Контент-завод', 'Разворачиваем систему массовой дистрибуции коротких видео.', 'Проблема', 'Текст проблемы.', 'Решение', 'выделение', 'Формула', 'Текст решения.', 'Как работает', 'Подзаголовок', 'Примеры', 'Подзаголовок', 'Ниши', 'Подзаголовок', 'Сравнение', 'Подзаголовок', 'Готовы', 'контент-завод?', 'Текст CTA', 'Получить консультацию', 'Получить консультацию', 'Смотреть кейсы', 'Написать в Telegram', 'ru'::_locales, 1)
        `)
        console.log('✓ home_page_locales: добавлена строка')
      } catch (e: any) {
        console.warn('ensure:settings: home_page_locales:', e.message)
      }
    }
  } finally {
    await pool.end()
  }
  process.exit(0)
}

main()
