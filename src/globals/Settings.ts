import type { GlobalConfig } from 'payload'
import { revalidateFrontend } from '@/lib/revalidate'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Настройки сайта',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async () => {
        await revalidateFrontend()
      },
    ],
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      label: 'Название сайта',
      defaultValue: 'Content Hunter',
    },
    {
      name: 'siteDescription',
      type: 'textarea',
      label: 'Описание сайта',
      localized: true,
    },
    {
      name: 'defaultMeta',
      type: 'group',
      label: 'SEO по умолчанию',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Meta Title',
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Meta Description',
          localized: true,
        },
        {
          name: 'ogImage',
          type: 'upload',
          label: 'OG Image',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'contacts',
      type: 'group',
      label: 'Контакты',
      fields: [
        {
          name: 'telegram',
          type: 'text',
          label: 'Telegram',
        },
        {
          name: 'telegramBot',
          type: 'text',
          label: 'Telegram Bot',
        },
        {
          name: 'whatsapp',
          type: 'text',
          label: 'WhatsApp',
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email',
        },
      ],
    },
    {
      name: 'analytics',
      type: 'group',
      label: 'Аналитика',
      fields: [
        {
          name: 'googleAnalyticsId',
          type: 'text',
          label: 'Google Analytics ID',
        },
        {
          name: 'yandexMetrikaId',
          type: 'text',
          label: 'Яндекс.Метрика ID',
        },
      ],
    },
  ],
}
