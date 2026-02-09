import type { CollectionConfig } from 'payload'

export const Pricing: CollectionConfig = {
  slug: 'pricing',
  labels: {
    singular: 'Тариф',
    plural: 'Тарифы',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Контент',
    defaultColumns: ['name', 'price', 'isPopular', 'order'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Название',
      required: true,
      localized: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          type: 'number',
          label: 'Цена',
          required: true,
        },
        {
          name: 'currency',
          type: 'select',
          label: 'Валюта',
          options: [
            { label: '₽', value: 'RUB' },
            { label: '$', value: 'USD' },
          ],
          defaultValue: 'RUB',
        },
        {
          name: 'period',
          type: 'text',
          label: 'Период',
          defaultValue: 'месяц',
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание',
      localized: true,
    },
    {
      name: 'features',
      type: 'array',
      label: 'Что входит',
      fields: [
        {
          name: 'feature',
          type: 'text',
          label: 'Функция',
          localized: true,
        },
        {
          name: 'included',
          type: 'checkbox',
          label: 'Включено',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'isPopular',
      type: 'checkbox',
      label: 'Популярный',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'Текст кнопки',
      defaultValue: 'Выбрать',
      localized: true,
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
