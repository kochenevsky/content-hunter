import type { GlobalConfig } from 'payload'
import { revalidateFrontend } from '@/lib/revalidate'

export const FAQPage: GlobalConfig = {
  slug: 'faq-page',
  label: 'Страница «FAQ»',
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
        { name: 'buttonText', type: 'text', label: 'Текст кнопки', localized: true },
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
      name: 'categories',
      type: 'array',
      label: 'Категории для группировки',
      fields: [
        { name: 'id', type: 'text', label: 'ID (general, process, results)' },
        { name: 'label', type: 'text', label: 'Подпись' },
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
