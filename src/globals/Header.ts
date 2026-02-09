import type { GlobalConfig } from 'payload'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Шапка сайта',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      label: 'Логотип',
      relationTo: 'media',
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
      name: 'ctaButton',
      type: 'group',
      label: 'Кнопка CTA',
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Текст',
          localized: true,
        },
        {
          name: 'link',
          type: 'text',
          label: 'Ссылка',
        },
      ],
    },
  ],
}
