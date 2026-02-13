import type { GlobalConfig } from 'payload'
import { revalidateFrontend } from '@/lib/revalidate'

export const ServicesPage: GlobalConfig = {
  slug: 'services-page',
  label: 'Страница «Услуги»',
  access: { read: () => true },
  hooks: {
    afterChange: [async () => { await revalidateFrontend() }],
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Hero',
      fields: [
        { name: 'headline', type: 'text', label: 'Заголовок', localized: true },
        { name: 'headlineHighlight', type: 'text', label: 'Выделение', localized: true },
        { name: 'subheadline', type: 'textarea', label: 'Подзаголовок', localized: true },
        { name: 'primaryButtonText', type: 'text', label: 'Кнопка 1 (текст)', localized: true },
        { name: 'primaryButtonLink', type: 'text', label: 'Кнопка 1 (ссылка)', admin: { description: 'Например: /contact' }},
        { name: 'secondaryButtonText', type: 'text', label: 'Кнопка 2 (текст)', localized: true },
        { name: 'secondaryButtonLink', type: 'text', label: 'Кнопка 2 (ссылка)', admin: { description: 'Например: /cases' }},
      ],
    },
    {
      name: 'whatIs',
      type: 'group',
      label: 'Что такое контент-завод',
      fields: [
        { name: 'title', type: 'text', label: 'Заголовок', localized: true },
        { name: 'paragraphs', type: 'array', label: 'Абзацы', fields: [{ name: 'text', type: 'textarea', localized: true }]},
        { name: 'benefits', type: 'array', label: 'Преимущества', fields: [{ name: 'item', type: 'text', localized: true }]},
        { name: 'formulaValues', type: 'array', label: 'Значения формулы', fields: [
          { name: 'value', type: 'text', label: 'Число' },
          { name: 'label', type: 'text', label: 'Подпись' },
        ]},
      ],
    },
    {
      name: 'formats',
      type: 'group',
      label: 'Форматы контента',
      fields: [
        { name: 'title', type: 'text', label: 'Заголовок', localized: true },
        { name: 'subtitle', type: 'text', label: 'Подзаголовок', localized: true },
        { name: 'items', type: 'array', label: 'Форматы', fields: [
          { name: 'icon', type: 'text', label: 'Иконка' },
          { name: 'title', type: 'text', label: 'Название', localized: true },
          { name: 'description', type: 'textarea', label: 'Описание', localized: true },
          { name: 'platforms', type: 'array', label: 'Платформы', fields: [{ name: 'name', type: 'text' }]},
        ]},
      ],
    },
    {
      name: 'stages',
      type: 'group',
      label: 'Этапы работы',
      fields: [
        { name: 'title', type: 'text', label: 'Заголовок', localized: true },
        { name: 'subtitle', type: 'text', label: 'Подзаголовок', localized: true },
        { name: 'items', type: 'array', label: 'Этапы', fields: [
          { name: 'number', type: 'text', label: 'Номер (01)' },
          { name: 'title', type: 'text', label: 'Заголовок', localized: true },
          { name: 'description', type: 'textarea', label: 'Описание', localized: true },
          { name: 'duration', type: 'text', label: 'Длительность' },
        ]},
      ],
    },
    {
      name: 'scaling',
      type: 'group',
      label: 'Масштабирование',
      fields: [
        { name: 'title', type: 'text', label: 'Заголовок', localized: true },
        { name: 'subtitle', type: 'textarea', label: 'Подзаголовок', localized: true },
        { name: 'items', type: 'array', label: 'Пункты', fields: [
          { name: 'icon', type: 'text', label: 'Иконка' },
          { name: 'title', type: 'text', label: 'Заголовок', localized: true },
          { name: 'description', type: 'textarea', label: 'Описание', localized: true },
        ]},
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
        { name: 'primaryButtonText', type: 'text', label: 'Кнопка 1 (текст)', localized: true },
        { name: 'primaryButtonLink', type: 'text', label: 'Кнопка 1 (ссылка)', admin: { description: 'Например: /contact' }},
        { name: 'secondaryButtonText', type: 'text', label: 'Кнопка 2 (текст)', localized: true },
        { name: 'secondaryButtonLink', type: 'text', label: 'Кнопка 2 (ссылка)', admin: { description: 'Например: /pricing' }},
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
