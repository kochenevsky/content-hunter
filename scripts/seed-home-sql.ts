// @ts-nocheck
/** Сидит главную + FAQ и др. глобалы через pg (без Payload). Запуск: pnpm seed:home:sql */
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

    // faq_page_locales — Hero + CTA для ru
    const faqId = 1
    const faqRows = [
      'Частые', 'вопросы', // hero_headline, hero_headline_highlight
      'Ответы на вопросы о контент-заводе, процессе работы, гарантиях и стоимости.',
      'Перейти к вопросам', // hero_button_text
      'Остались вопросы?', // cta_headline
      'Получите бесплатный аудит и стратегию. Расскажем, как масштабировать охваты и дистрибуцию.',
      'Получить консультацию', // cta_button_text
      'FAQ — Частые вопросы', // meta_title
      'Ответы на частые вопросы о контент-заводе, процессе работы, гарантиях и стоимости.',
    ]
    const faqUpd = await client.query(`
      UPDATE faq_page_locales SET
        hero_headline = $1, hero_headline_highlight = $2, hero_subheadline = $3, hero_button_text = $4,
        cta_headline = $5, cta_text = $6, cta_button_text = $7, meta_title = $8, meta_description = $9
      WHERE _locale = 'ru'::_locales AND _parent_id = $10
    `, [...faqRows, faqId])
    if (faqUpd.rowCount === 0) {
      await client.query(`
        INSERT INTO faq_page_locales (hero_headline, hero_headline_highlight, hero_subheadline, hero_button_text, cta_headline, cta_text, cta_button_text, meta_title, meta_description, _locale, _parent_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'ru'::_locales, $10)
      `, [...faqRows, faqId])
    }

    // faq_page_categories — категории для группировки
    const faqCats = [
      { id: 'general', label: 'Общие вопросы' },
      { id: 'process', label: 'Процесс работы' },
      { id: 'results', label: 'Результаты и гарантии' },
      { id: 'pricing', label: 'Стоимость' },
      { id: 'technical', label: 'Технические вопросы' },
      { id: 'niches', label: 'Ниши и клиенты' },
    ]
    for (let i = 0; i < faqCats.length; i++) {
      await client.query(
        `INSERT INTO faq_page_categories (_order, _parent_id, id, label) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO UPDATE SET label = $4`,
        [i, faqId, faqCats[i].id, faqCats[i].label]
      )
    }

    // services_page_locales
    const servId = 1
    const servRows = [
      'Контент-завод', 'под ключ', // hero
      'Разворачиваем систему массовой дистрибуции коротких видео. Полный цикл от стратегии до аналитики.',
      'Получить консультацию', 'Смотреть кейсы', // hero buttons
      'Что такое контент-завод', // what_is_title
      'Форматы контента', 'Reels, Shorts, TikTok — все платформы из одной системы',
      'Этапы работы', 'От аудита до масштабирования — прозрачный процесс',
      'Масштабирование', 'От 20 аккаунтов до миллионов просмотров — без потери качества',
      'Готовы запустить', 'контент-завод?', // cta
      'Получите бесплатный аудит и стратегию.',
      'Получить консультацию', 'Смотреть тарифы',
      'Услуги — Контент-завод под ключ',
      'Запускаем контент-заводы для бизнеса. Полный цикл от стратегии до публикации на десятках аккаунтов.',
    ]
    const servUpd = await client.query(`
      UPDATE services_page_locales SET hero_headline=$1, hero_headline_highlight=$2, hero_subheadline=$3, hero_primary_button_text=$4, hero_secondary_button_text=$5,
        what_is_title=$6, formats_title=$7, formats_subtitle=$8, stages_title=$9, stages_subtitle=$10, scaling_title=$11, scaling_subtitle=$12,
        cta_headline=$13, cta_headline_highlight=$14, cta_text=$15, cta_primary_button_text=$16, cta_secondary_button_text=$17,
        meta_title=$18, meta_description=$19
      WHERE _locale='ru'::_locales AND _parent_id=$20
    `, [...servRows, servId])
    if (servUpd.rowCount === 0) {
      await client.query(`
        INSERT INTO services_page_locales (hero_headline, hero_headline_highlight, hero_subheadline, hero_primary_button_text, hero_secondary_button_text,
          what_is_title, formats_title, formats_subtitle, stages_title, stages_subtitle, scaling_title, scaling_subtitle,
          cta_headline, cta_headline_highlight, cta_text, cta_primary_button_text, cta_secondary_button_text,
          meta_title, meta_description, _locale, _parent_id)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,'ru'::_locales,$20)
      `, [...servRows, servId])
    }

    // about_page_locales + company
    const aboutId = 1
    await client.query(`UPDATE about_page SET company_company_name='ОАО «Дженго»', company_brand='Content Hunter', company_founder='Content Hunter', company_year='2024' WHERE id=$1`, [aboutId])
    const aboutRows = [
      'О нас', 'Content Hunter — конструктор контент-заводов и контент-ферм «под ключ». Любой бизнес или эксперт может прийти к нам, и мы возьмём на себя всю систему контента и трафика.',
      'История', 'Принципы', 'Результат, а не процесс. Системный подход. Партнёрство. Глобальность.',
      'География', 'Работаем с клиентами из России, СНГ, MENA, LATAM и Европы. Контент на любых языках.',
      'Реквизиты', 'Остались вопросы?', 'Получите бесплатный аудит и стратегию.', 'Получить консультацию',
      'О нас — Команда Content Hunter',
      'Команда Content Hunter: эксперты по контент-заводам и массовой дистрибуции видеоконтента.',
    ]
    const aboutUpd = await client.query(`
      UPDATE about_page_locales SET hero_headline=$1, hero_subheadline=$2, story_title=$3, values_title=$4, values_subtitle=$5,
        geography_title=$6, geography_text=$7, company_title=$8, cta_headline=$9, cta_text=$10, cta_button_text=$11, meta_title=$12, meta_description=$13
      WHERE _locale='ru'::_locales AND _parent_id=$14
    `, [...aboutRows, aboutId])
    if (aboutUpd.rowCount === 0) {
      await client.query(`
        INSERT INTO about_page_locales (hero_headline, hero_subheadline, story_title, values_title, values_subtitle, geography_title, geography_text, company_title, cta_headline, cta_text, cta_button_text, meta_title, meta_description, _locale, _parent_id)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'ru'::_locales,$14)
      `, [...aboutRows, aboutId])
    }

    // about_page_stats_items (очищаем перед вставкой)
    await client.query(`DELETE FROM about_page_stats_items WHERE _parent_id=$1`, [aboutId])
    const aboutStats = [
      { v: '50+', l: 'Запущенных проектов' },
      { v: '20М+', l: 'Просмотров в месяц' },
      { v: '15+', l: 'Ниш клиентов' },
      { v: '8', l: 'Стран присутствия' },
    ]
    for (let i = 0; i < aboutStats.length; i++) {
      const sid = uid()
      await client.query(`INSERT INTO about_page_stats_items (_order, _parent_id, id, value, label) VALUES ($1, $2, $3, $4, $5)`, [i, aboutId, sid, aboutStats[i].v, aboutStats[i].l])
    }

    // about_page_geography_regions (очищаем перед вставкой)
    await client.query(`DELETE FROM about_page_geography_regions WHERE _parent_id=$1`, [aboutId])
    const regions = ['Россия', 'СНГ (Казахстан, Беларусь)', 'MENA (ОАЭ, Дубай)', 'LATAM', 'Европа', 'США']
    for (let i = 0; i < regions.length; i++) {
      const rid = uid()
      await client.query(`INSERT INTO about_page_geography_regions (_order, _parent_id, id, name) VALUES ($1, $2, $3, $4)`, [i, aboutId, rid, regions[i]])
    }

    // pricing_page_locales
    const pricingId = 1
    const pricingRows = [
      'Тарифы', 'Выберите подходящий тариф для вашего бизнеса. Все тарифы включают гарантию результата в договоре.',
      'Остались вопросы?', 'Получите бесплатный аудит и стратегию.', 'Получить консультацию',
      'Тарифы — Стоимость контент-завода',
      'Выберите подходящий тариф для запуска контент-завода. Гарантия результата в договоре.',
    ]
    const pricingUpd = await client.query(`
      UPDATE pricing_page_locales SET hero_headline=$1, hero_subheadline=$2, cta_headline=$3, cta_text=$4, cta_button_text=$5, meta_title=$6, meta_description=$7 WHERE _locale='ru'::_locales AND _parent_id=$8
    `, [...pricingRows, pricingId])
    if (pricingUpd.rowCount === 0) {
      await client.query(`INSERT INTO pricing_page_locales (hero_headline, hero_subheadline, cta_headline, cta_text, cta_button_text, meta_title, meta_description, _locale, _parent_id) VALUES ($1,$2,$3,$4,$5,$6,$7,'ru'::_locales,$8)`, [...pricingRows, pricingId])
    }

    // header — navigation + cta (удаляем старые nav, вставляем свежие)
    const headerId = 1
    await client.query(`UPDATE header SET cta_button_link='/contact' WHERE id=$1`, [headerId])
    await client.query(`DELETE FROM header_navigation WHERE _parent_id=$1`, [headerId])
    const headerNav = [
      { label: 'Кейсы', link: '/cases' }, { label: 'Услуги', link: '/services' }, { label: 'Тарифы', link: '/pricing' },
      { label: 'Блог', link: '/blog' }, { label: 'О нас', link: '/about' }, { label: 'FAQ', link: '/faq' },
    ]
    for (let i = 0; i < headerNav.length; i++) {
      const nid = uid()
      await client.query(`INSERT INTO header_navigation (_order, _parent_id, id, link) VALUES ($1, $2, $3, $4)`, [i, headerId, nid, headerNav[i].link])
      await client.query(`INSERT INTO header_navigation_locales (label, _locale, _parent_id) VALUES ($1, 'ru'::_locales, $2)`, [headerNav[i].label, nid])
    }
    const headerLoc = await client.query(`SELECT 1 FROM header_locales WHERE _locale='ru'::_locales AND _parent_id=$1`, [headerId])
    if (headerLoc.rowCount === 0) {
      await client.query(`INSERT INTO header_locales (cta_button_text, _locale, _parent_id) VALUES ('Получить консультацию', 'ru'::_locales, $1)`, [headerId])
    } else {
      await client.query(`UPDATE header_locales SET cta_button_text='Получить консультацию' WHERE _locale='ru'::_locales AND _parent_id=$1`, [headerId])
    }

    // footer — navigation, social, locales (удаляем старые nav/social)
    const footerId = 1
    await client.query(`DELETE FROM footer_navigation WHERE _parent_id=$1`, [footerId])
    await client.query(`DELETE FROM footer_social WHERE _parent_id=$1`, [footerId])
    const footerNav = [
      { label: 'Кейсы', link: '/cases' }, { label: 'Услуги', link: '/services' }, { label: 'Тарифы', link: '/pricing' },
      { label: 'Блог', link: '/blog' }, { label: 'О нас', link: '/about' }, { label: 'FAQ', link: '/faq' }, { label: 'Контакты', link: '/contact' },
    ]
    for (let i = 0; i < footerNav.length; i++) {
      const nid = uid()
      await client.query(`INSERT INTO footer_navigation (_order, _parent_id, id, link) VALUES ($1, $2, $3, $4)`, [i, footerId, nid, footerNav[i].link])
      await client.query(`INSERT INTO footer_navigation_locales (label, _locale, _parent_id) VALUES ($1, 'ru'::_locales, $2)`, [footerNav[i].label, nid])
    }
    const footerSocial = [
      { platform: 'telegram', url: 'https://t.me/contenthunter_bot' },
      { platform: 'instagram', url: 'https://instagram.com/contenthunter' },
      { platform: 'youtube', url: 'https://youtube.com/@contenthunter' },
    ]
    for (let i = 0; i < footerSocial.length; i++) {
      const sid = uid()
      await client.query(`INSERT INTO footer_social (_order, _parent_id, id, platform, url) VALUES ($1, $2, $3, $4::enum_footer_social_platform, $5)`, [i, footerId, sid, footerSocial[i].platform, footerSocial[i].url])
    }
    const footerLoc = await client.query(`SELECT 1 FROM footer_locales WHERE _locale='ru'::_locales AND _parent_id=$1`, [footerId])
    if (footerLoc.rowCount === 0) {
      await client.query(`INSERT INTO footer_locales (description, copyright, _locale, _parent_id) VALUES ($1, $2, 'ru'::_locales, $3)`, [
        'Content Hunter — конструктор контент-заводов и контент-ферм «под ключ». Гарантия охватов в договоре.',
        '© 2024 Content Hunter. ОАО «Дженго»', footerId
      ])
    } else {
      await client.query(`UPDATE footer_locales SET description=$1, copyright=$2 WHERE _locale='ru'::_locales AND _parent_id=$3`, [
        'Content Hunter — конструктор контент-заводов и контент-ферм «под ключ». Гарантия охватов в договоре.',
        '© 2024 Content Hunter. ОАО «Дженго»', footerId
      ])
    }

    // settings — contacts + locales
    const settingsId = 1
    await client.query(`UPDATE settings SET contacts_telegram_bot='https://t.me/contenthunter_bot' WHERE id=$1`, [settingsId])
    const settRows = [
      'Конструктор контент-заводов и контент-ферм «под ключ». Гарантия охватов в договоре.',
      'Content Hunter — Контент-завод под ключ',
      'Разворачиваем инфраструктуру по созданию и массовой дистрибуции коротких видео. 50+ проектов, 20М+ просмотров, гарантия в договоре.',
    ]
    const settLoc = await client.query(`SELECT 1 FROM settings_locales WHERE _locale='ru'::_locales AND _parent_id=$1`, [settingsId])
    if (settLoc.rowCount === 0) {
      await client.query(`INSERT INTO settings_locales (site_description, default_meta_title, default_meta_description, _locale, _parent_id) VALUES ($1,$2,$3,'ru'::_locales,$4)`, [...settRows, settingsId])
    } else {
      await client.query(`UPDATE settings_locales SET site_description=$1, default_meta_title=$2, default_meta_description=$3 WHERE _locale='ru'::_locales AND _parent_id=$4`, [...settRows, settingsId])
    }

    console.log('✓ home_page, faq_page, services_page, about_page, pricing_page, header, footer, settings — записаны')
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
