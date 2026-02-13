// @ts-nocheck
/** Сидит главную через pg (без Payload). Запуск: pnpm seed:home:sql */
import 'dotenv/config'
import pg from 'pg'
import { randomUUID } from 'crypto'

function uid() {
  return randomUUID().replace(/-/g, '').slice(0, 12)
}

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

async function main() {
  const pool = new pg.Pool(parseDbConfig())
  const client = await pool.connect()
  try {
    const homeId = 1

    // home_page_locales — основной контент для локали ru (update or insert)
    const localeRows = ['Контент-завод для бизнеса',
      'Разворачиваем систему массовой дистрибуции коротких видео. Один ролик → десятки уникальных версий → миллионы просмотров.',
      'Почему ваш SMM не приносит результатов',
      'Контент перестал быть дефицитом. Его слишком много. Все ждут один вирусный ролик, надеются на «залёт», хотят миллион просмотров в одном аккаунте. Вероятность сделать ролик на миллион — 0,00001%.',
      'Холодная математика', 'вместо надежды',
      '50 роликов × 20 аккаунтов = 1000 публикаций в месяц',
      'Вместо лотереи — производство. Один сценарий превращаем в десятки уникальных версий. Публикуем через сетку аккаунтов. Охваты становятся предсказуемыми.',
      'Как работает контент-завод', 'Полный цикл от идеи до публикации и аналитики',
      'Примеры работ', 'Реальные ролики наших клиентов: Instagram Reels и YouTube Shorts',
      'С кем мы работаем', 'B2C-бизнес с широкой аудиторией. Бюджет на маркетинг от 200 000 ₽/мес.',
      'Чем мы отличаемся', 'Content Hunter — это не SMM-агентство и не видеопродакшен. Это контент-завод с гарантией результата.',
      'Готовы запустить', 'контент-завод?',
      'Получите бесплатный аудит и стратегию. Расскажем, как масштабировать охваты и дистрибуцию.',
      'Получить консультацию']
    const upd = await client.query(`
      UPDATE home_page_locales SET
        hero_headline = $1, hero_subheadline = $2, problem_title = $3, problem_text = $4,
        solution_title = $5, solution_title_highlight = $6, solution_formula = $7, solution_text = $8,
        how_it_works_title = $9, how_it_works_subtitle = $10,
        video_examples_title = $11, video_examples_subtitle = $12,
        niches_title = $13, niches_subtitle = $14,
        comparison_title = $15, comparison_subtitle = $16,
        cta_headline = $17, cta_headline_highlight = $18, cta_text = $19, cta_primary_button_text = $20
      WHERE _locale = 'ru'::_locales AND _parent_id = $21
    `, [...localeRows, homeId])
    if (upd.rowCount === 0) {
      await client.query(`
        INSERT INTO home_page_locales (
          hero_headline, hero_subheadline, problem_title, problem_text,
          solution_title, solution_title_highlight, solution_formula, solution_text,
          how_it_works_title, how_it_works_subtitle,
          video_examples_title, video_examples_subtitle,
          niches_title, niches_subtitle,
          comparison_title, comparison_subtitle,
          cta_headline, cta_headline_highlight, cta_text, cta_primary_button_text,
          _locale, _parent_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, 'ru'::_locales, $21)
      `, [...localeRows, homeId])
    }

    // hero_stats
    const heroStats = [
      { v: '50', s: '+', l: 'Проектов' },
      { v: '20', s: 'М+', l: 'Просмотров/мес' },
      { v: '8', s: '', l: 'Стран' },
    ]
    for (let i = 0; i < heroStats.length; i++) {
      const sid = uid()
      await client.query(
        `INSERT INTO home_page_hero_stats (_order, _parent_id, id, value, suffix, label)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO NOTHING`,
        [i, homeId, sid, heroStats[i].v, heroStats[i].s, heroStats[i].l]
      )
    }

    // hero_cycle_words
    for (const w of ['под ключ', 'с гарантией', 'для бизнеса', 'на масштаб']) {
      const sid = uid()
      await client.query(
        `INSERT INTO home_page_hero_cycle_words (_order, _parent_id, id, word)
         VALUES (
           (SELECT COALESCE(MAX(_order), -1) + 1 FROM home_page_hero_cycle_words WHERE _parent_id = $1),
           $1, $2, $3
         )
         ON CONFLICT (id) DO NOTHING`,
        [homeId, sid, w]
      )
    }

    // video_examples_items — Витаминная крышка Booster Cap + Бренд Relisme
    const examples = [
      {
        client: 'Витаминная крышка Booster Cap',
        format: 'Распаковка и обзорные ролики',
        ig: [
          { id: 'DSup4OVjRYf', label: 'Reel 1' },  // sunnlyxvibe — дофамин в крышечке, арт 502520177
          { id: 'DTaSfgqDRdy', label: 'Reel 2' },  // booster_c_ — вода за 10 сек, коллаген
        ],
        yt: [
          { id: 'gLKgolZi_do', label: 'Shorts 1' },
          { id: '_KbGGubr6_Q', label: 'Shorts 2' },
        ],
      },
      {
        client: 'Бренд одежды Relisme',
        format: 'Распаковка и обзорные ролики',
        ig: [{ id: 'DTdG-HzAtTV', label: 'Reel 1' }],
        yt: [{ id: 'BRA7KSecCYQ', label: 'Shorts 1' }],
      },
    ]
    for (let i = 0; i < examples.length; i++) {
      const itemId = uid()
      await client.query(
        `INSERT INTO home_page_video_examples_items (_order, _parent_id, id) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING`,
        [i, homeId, itemId]
      )
      const locCheck = await client.query(
        `SELECT 1 FROM home_page_video_examples_items_locales WHERE _locale = 'ru'::_locales AND _parent_id = $1`,
        [itemId]
      )
      if (locCheck.rowCount === 0) {
        await client.query(
          `INSERT INTO home_page_video_examples_items_locales (client, format, _locale, _parent_id) VALUES ($1, $2, 'ru'::_locales, $3)`,
          [examples[i].client, examples[i].format, itemId]
        )
      } else {
        await client.query(
          `UPDATE home_page_video_examples_items_locales SET client = $1, format = $2 WHERE _locale = 'ru'::_locales AND _parent_id = $3`,
          [examples[i].client, examples[i].format, itemId]
        )
      }
      for (let j = 0; j < examples[i].ig.length; j++) {
        const { id: reelId, label } = examples[i].ig[j]
        await client.query(
          `INSERT INTO home_page_video_examples_items_instagram_ids (_order, _parent_id, id, label) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO UPDATE SET label = $4`,
          [j, itemId, reelId, label]
        )
      }
      for (let j = 0; j < examples[i].yt.length; j++) {
        const { id: videoId, label } = examples[i].yt[j]
        await client.query(
          `INSERT INTO home_page_video_examples_items_youtube_ids (_order, _parent_id, id, label) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO UPDATE SET label = $4`,
          [j, itemId, videoId, label]
        )
      }
    }

    console.log('✓ home_page_locales, hero_stats, hero_cycle_words, video_examples записаны')
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
