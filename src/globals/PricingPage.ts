import type { GlobalConfig } from 'payload'
import { revalidateFrontend } from '@/lib/revalidate'

export const PricingPage: GlobalConfig = {
  slug: 'pricing-page',
  label: 'Страница «Тарифы»',
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
