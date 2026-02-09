import type { CollectionConfig } from 'payload'

export const Cases: CollectionConfig = {
  slug: 'cases',
  labels: {
    singular: 'Кейс',
    plural: 'Кейсы',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Контент',
    defaultColumns: ['title', 'niche', 'views', 'revenue', 'published'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Название',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'niche',
      type: 'select',
      label: 'Ниша',
      required: true,
      options: [
        { label: 'E-commerce / Маркетплейсы', value: 'ecommerce' },
        { label: 'Онлайн-школы', value: 'edu' },
        { label: 'Эксперты / Коучи', value: 'expert' },
        { label: 'HoReCa', value: 'horeca' },
        { label: 'Beauty / Клиники', value: 'beauty' },
        { label: 'Тревел', value: 'travel' },
        { label: 'Недвижимость', value: 'realestate' },
        { label: 'Digital / IT', value: 'digital' },
        { label: 'Другое', value: 'other' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'image',
      type: 'upload',
      label: 'Изображение',
      relationTo: 'media',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'publications',
          type: 'number',
          label: 'Публикаций',
          required: true,
        },
        {
          name: 'views',
          type: 'number',
          label: 'Просмотров',
          required: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'revenue',
          type: 'number',
          label: 'Выручка',
          required: true,
        },
        {
          name: 'currency',
          type: 'select',
          label: 'Валюта',
          options: [
            { label: '₽', value: 'RUB' },
            { label: '$', value: 'USD' },
            { label: '€', value: 'EUR' },
          ],
          defaultValue: 'RUB',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'ctr',
          type: 'number',
          label: 'CTR (%)',
        },
        {
          name: 'conversion',
          type: 'number',
          label: 'Конверсия (%)',
        },
      ],
    },
    {
      name: 'duration',
      type: 'text',
      label: 'Срок выполнения',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Описание',
      localized: true,
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Ссылки на аккаунты',
      fields: [
        {
          name: 'platform',
          type: 'select',
          label: 'Платформа',
          options: [
            { label: 'Instagram', value: 'instagram' },
            { label: 'TikTok', value: 'tiktok' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'VK', value: 'vk' },
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
      name: 'published',
      type: 'checkbox',
      label: 'Опубликован',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Порядок',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
