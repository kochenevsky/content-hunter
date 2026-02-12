import type { GlobalConfig } from 'payload'
import { revalidateFrontend } from '@/lib/revalidate'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'Страница «О нас»',
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
        { name: 'subheadline', type: 'textarea', label: 'Подзаголовок', localized: true },
      ],
    },
    {
      name: 'stats',
      type: 'group',
      label: 'Статистика',
      fields: [
        { name: 'items', type: 'array', label: 'Показатели', fields: [
          { name: 'value', type: 'text', label: 'Значение (50+)' },
          { name: 'label', type: 'text', label: 'Подпись' },
        ]},
      ],
    },
    {
      name: 'story',
      type: 'group',
      label: 'История',
      fields: [
        { name: 'title', type: 'text', label: 'Заголовок', localized: true },
        { name: 'paragraphs', type: 'array', label: 'Абзацы', fields: [{ name: 'text', type: 'textarea', localized: true }]},
      ],
    },
    {
      name: 'values',
      type: 'group',
      label: 'Принципы',
      fields: [
        { name: 'title', type: 'text', label: 'Заголовок', localized: true },
        { name: 'subtitle', type: 'text', label: 'Подзаголовок', localized: true },
        { name: 'items', type: 'array', label: 'Принципы', fields: [
          { name: 'icon', type: 'text', label: 'Иконка' },
          { name: 'title', type: 'text', label: 'Заголовок', localized: true },
          { name: 'description', type: 'textarea', label: 'Описание', localized: true },
        ]},
      ],
    },
    {
      name: 'geography',
      type: 'group',
      label: 'География',
      fields: [
        { name: 'title', type: 'text', label: 'Заголовок', localized: true },
        { name: 'text', type: 'textarea', label: 'Текст', localized: true },
        { name: 'regions', type: 'array', label: 'Регионы', fields: [{ name: 'name', type: 'text', label: 'Название' }]},
      ],
    },
    {
      name: 'company',
      type: 'group',
      label: 'Реквизиты',
      fields: [
        { name: 'title', type: 'text', label: 'Заголовок', localized: true },
        { name: 'companyName', type: 'text', label: 'Компания' },
        { name: 'brand', type: 'text', label: 'Бренд' },
        { name: 'founder', type: 'text', label: 'Основатель' },
        { name: 'year', type: 'text', label: 'Год основания' },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Призыв к действию',
      fields: [
        { name: 'headline', type: 'text', label: 'Заголовок', localized: true },
        { name: 'text', type: 'textarea', label: 'Текст', localized: true },
        { name: 'buttonText', type: 'text', label: 'Текст кнопки', localized: true },
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
