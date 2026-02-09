import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Подвал сайта',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание компании',
      localized: true,
    },
    {
      name: 'navigation',
      type: 'array',
      label: 'Навигация',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Текст',
          required: true,
          localized: true,
        },
        {
          name: 'link',
          type: 'text',
          label: 'Ссылка',
          required: true,
        },
      ],
    },
    {
      name: 'social',
      type: 'array',
      label: 'Социальные сети',
      fields: [
        {
          name: 'platform',
          type: 'select',
          label: 'Платформа',
          options: [
            { label: 'Telegram', value: 'telegram' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'TikTok', value: 'tiktok' },
            { label: 'WhatsApp', value: 'whatsapp' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          label: 'Ссылка',
        },
      ],
    },
    {
      name: 'copyright',
      type: 'text',
      label: 'Копирайт',
      localized: true,
    },
  ],
}
