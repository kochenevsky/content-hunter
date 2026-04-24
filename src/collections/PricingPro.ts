// src/collections/PricingPro.ts
import type { CollectionConfig } from 'payload'
import { revalidateFrontend } from '@/lib/revalidate'

export const PricingPro: CollectionConfig = {
  slug: 'pricing-pro',
  labels: {
    singular: 'Тариф (.pro)',
    plural: 'Тарифы (.pro)',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Контент',
    defaultColumns: ['name', 'price', 'isPopular', 'order'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [async () => { await revalidateFrontend() }],
    afterDelete: [async () => { await revalidateFrontend() }],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Название',
      required: true,
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
            { label: '€', value: 'EUR' },
          ],
          defaultValue: 'USD',
        },
        {
          name: 'period',
          type: 'text',
          label: 'Период',
          defaultValue: 'month',
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание',
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
      admin: { position: 'sidebar' },
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'Текст кнопки',
      defaultValue: 'Select',
    },
    {
      name: 'ctaLink',
      type: 'text',
      label: 'Ссылка кнопки',
    },
    {
      name: 'order',
      type: 'number',
      label: 'Порядок',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
