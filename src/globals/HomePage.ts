import type { GlobalConfig } from 'payload'
import { randomBytes } from 'crypto'
import { revalidateFrontend } from '@/lib/revalidate'

function ensureArrayIds(obj: unknown): unknown {
  if (obj == null) return obj
  if (Array.isArray(obj)) {
    const seen = new Set<string>()
    return obj.map((item) => {
      if (item && typeof item === 'object') {
        const rest = { ...item } as Record<string, unknown>
        if ('id' in rest) {
          let id = rest.id
          if (id == null || id === '' || (typeof id === 'string' && seen.has(id))) {
            id = randomBytes(8).toString('hex')
          }
          seen.add(String(id))
          rest.id = id
        }
        for (const key of Object.keys(rest)) {
          rest[key] = ensureArrayIds(rest[key]) as never
        }
        return rest
      }
      return item
    })
  }
  if (typeof obj === 'object') {
    const out = { ...obj } as Record<string, unknown>
    for (const key of Object.keys(out)) {
      out[key] = ensureArrayIds(out[key]) as never
    }
    return out
  }
  return obj
}

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Главная страница',
  access: { read: () => true },
  hooks: {
    beforeValidate: [
      ({ data, originalDoc }) => {
        if (!data) return data
        // Корневой id глобала — иначе Payload возвращает 400 "field is invalid: id"
        if (data.id == null || data.id === undefined) {
          data.id = (originalDoc as { id?: number } | undefined)?.id ?? 1
        }
        if (typeof data.id !== 'number') {
          data.id = Number(data.id) || 1
        }
        // Уникальные id у элементов массивов (hero.stats, problem.items, videoExamples.items и т.д.)
        const sanitized = ensureArrayIds(data) as typeof data
        Object.assign(data, sanitized)
        return data
      },
    ],
    afterChange: [async () => { await revalidateFrontend() }],
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Hero',
      fields: [
        { name: 'headline', type: 'text', label: 'Заголовок', localized: true },
        { name: 'subheadline', type: 'textarea', label: 'Подзаголовок', localized: true },
        { name: 'primaryButtonText', type: 'text', label: 'Кнопка 1 (текст)', localized: true },
        { name: 'primaryButtonLink', type: 'text', label: 'Кнопка 1 (ссылка)', admin: { description: 'Например: /contact' }},
        { name: 'secondaryButtonText', type: 'text', label: 'Кнопка 2 (текст)', localized: true },
        { name: 'secondaryButtonLink', type: 'text', label: 'Кнопка 2 (ссылка)', admin: { description: 'Например: /cases' }},
        { name: 'stats', type: 'array', label: 'Статистика', fields: [
          { name: 'value', type: 'text', label: 'Значение (50)' },
          { name: 'suffix', type: 'text', label: 'Суффикс (+)' },
          { name: 'label', type: 'text', label: 'Подпись' },
        ]},
        { name: 'cycleWords', type: 'array', label: 'Слова в цикле', fields: [{ name: 'word', type: 'text' }]},
      ],
    },
    {
      name: 'problem',
      type: 'group',
      label: 'Блок «Проблема»',
      fields: [
        { name: 'title', type: 'text', label: 'Заголовок', localized: true },
        { name: 'text', type: 'textarea', label: 'Текст', localized: true },
        { name: 'items', type: 'array', label: 'Пункты', fields: [
          { name: 'icon', type: 'text', label: 'Иконка (TrendingDown, Clock, AlertTriangle)' },
          { name: 'title', type: 'text', label: 'Заголовок', localized: true },
          { name: 'description', type: 'textarea', label: 'Описание', localized: true },
        ]},
      ],
    },
    {
      name: 'solution',
      type: 'group',
      label: 'Блок «Решение»',
      fields: [
        { name: 'title', type: 'text', label: 'Заголовок', localized: true },
        { name: 'titleHighlight', type: 'text', label: 'Выделение в заголовке', localized: true },
        { name: 'formula', type: 'text', label: 'Формула', localized: true },
        { name: 'text', type: 'textarea', label: 'Текст', localized: true },
        { name: 'checklist', type: 'array', label: 'Чеклист', fields: [{ name: 'item', type: 'text', localized: true }]},
        { name: 'formulaStats', type: 'array', label: 'Статистика формулы', fields: [
          { name: 'value', type: 'number', label: 'Значение' },
          { name: 'label', type: 'text', label: 'Подпись' },
        ]},
      ],
    },
    {
      name: 'stats',
      type: 'group',
      label: 'Блок статистики',
      fields: [
        { name: 'items', type: 'array', label: 'Показатели', fields: [
          { name: 'value', type: 'number', label: 'Значение' },
          { name: 'suffix', type: 'text', label: 'Суффикс' },
          { name: 'label', type: 'text', label: 'Подпись' },
        ]},
      ],
    },
    {
      name: 'howItWorks',
      type: 'group',
      label: 'Как работает',
      fields: [
        { name: 'title', type: 'text', label: 'Заголовок', localized: true },
        { name: 'subtitle', type: 'text', label: 'Подзаголовок', localized: true },
        { name: 'steps', type: 'array', label: 'Шаги', fields: [
          { name: 'icon', type: 'text', label: 'Иконка' },
          { name: 'title', type: 'text', label: 'Заголовок', localized: true },
          { name: 'description', type: 'textarea', label: 'Описание', localized: true },
        ]},
      ],
    },
    {
      name: 'videoExamples',
      type: 'group',
      label: 'Примеры работ',
      fields: [
        { name: 'title', type: 'text', label: 'Заголовок', localized: true },
        { name: 'subtitle', type: 'text', label: 'Подзаголовок', localized: true },
        { name: 'items', type: 'array', label: 'Примеры', fields: [
          { name: 'client', type: 'text', label: 'Клиент', localized: true },
          { name: 'format', type: 'text', label: 'Формат', localized: true },
          { name: 'instagramIds', type: 'array', label: 'Instagram Reels', fields: [
            { name: 'id', type: 'text', label: 'ID' },
            { name: 'label', type: 'text', label: 'Подпись' },
          ]},
          { name: 'youtubeIds', type: 'array', label: 'YouTube Shorts', fields: [
            { name: 'id', type: 'text', label: 'ID' },
            { name: 'label', type: 'text', label: 'Подпись' },
          ]},
          { name: 'vimeoIds', type: 'array', label: 'Vimeo (для РФ)', admin: { description: 'Работает в РФ, в отличие от YouTube/Instagram' }, fields: [
            { name: 'id', type: 'text', label: 'ID (из vimeo.com/ID)' },
            { name: 'label', type: 'text', label: 'Подпись' },
          ]},
        ]},
      ],
    },
    {
      name: 'niches',
      type: 'group',
      label: 'Ниши',
      fields: [
        { name: 'title', type: 'text', label: 'Заголовок', localized: true },
        { name: 'subtitle', type: 'text', label: 'Подзаголовок', localized: true },
        { name: 'items', type: 'array', label: 'Ниши', fields: [
          { name: 'icon', type: 'text', label: 'Иконка' },
          { name: 'name', type: 'text', label: 'Название', localized: true },
          { name: 'description', type: 'text', label: 'Описание', localized: true },
        ]},
      ],
    },
    {
      name: 'comparison',
      type: 'group',
      label: 'Сравнение',
      fields: [
        { name: 'title', type: 'text', label: 'Заголовок', localized: true },
        { name: 'subtitle', type: 'textarea', label: 'Подзаголовок', localized: true },
        { name: 'competitors', type: 'array', label: 'Конкуренты', fields: [
          { name: 'title', type: 'text', label: 'Заголовок', localized: true },
          { name: 'description', type: 'textarea', label: 'Описание', localized: true },
          { name: 'cons', type: 'array', label: 'Минусы', fields: [{ name: 'item', type: 'text', localized: true }]},
        ]},
        { name: 'ourAdvantages', type: 'array', label: 'Наши преимущества', fields: [{ name: 'item', type: 'text', localized: true }]},
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Призыв к действию',
      fields: [
        { name: 'headline', type: 'text', label: 'Заголовок', localized: true },
        { name: 'headlineHighlight', type: 'text', label: 'Выделение', localized: true },
        { name: 'text', type: 'textarea', label: 'Текст', localized: true },
        { name: 'guarantees', type: 'array', label: 'Гарантии', fields: [{ name: 'item', type: 'text', localized: true }]},
        { name: 'primaryButtonText', type: 'text', label: 'Кнопка 1 (текст)', localized: true },
        { name: 'primaryButtonLink', type: 'text', label: 'Кнопка 1 (ссылка)', admin: { description: 'Например: /contact' }},
        { name: 'secondaryButtonText', type: 'text', label: 'Кнопка 2 (текст)', localized: true, admin: { description: 'Например: Написать в Telegram' }},
        { name: 'telegramLink', type: 'text', label: 'Кнопка 2 (ссылка)', admin: { description: 'Ссылка Telegram, например: https://t.me/...' }},
      ],
    },
    {
      name: 'meta',
      type: 'group',
      label: 'SEO',
      fields: [
        { name: 'title', type: 'text', label: 'Meta Title', localized: true },
        { name: 'description', type: 'textarea', label: 'Meta Description', localized: true },
        { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'OG Image' },
      ],
    },
  ],
}
