import type { CollectionConfig } from 'payload'
import { revalidateFrontend } from '@/lib/revalidate'

export const FAQ: CollectionConfig = {
  slug: 'faq',
  labels: {
    singular: 'Вопрос',
    plural: 'FAQ',
  },
  admin: {
  useAsTitle: 'question',
  group: 'Контент',
  defaultColumns: ['question', 'answer', 'category', 'order'],
  listSearchableFields: ['question', 'answer'],
},
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async () => {
        await revalidateFrontend()
      },
    ],
    afterDelete: [
      async () => {
        await revalidateFrontend()
      },
    ],
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      label: 'Вопрос',
      required: true,
      localized: true,
    },
    {
      name: 'answer',
      type: 'textarea',
      label: 'Ответ',
      required: true,
      localized: true,
    },
    {
      name: 'category',
      type: 'select',
      label: 'Категория',
      options: [
        { label: 'Общие', value: 'general' },
        { label: 'Услуги', value: 'services' },
        { label: 'Тарифы', value: 'pricing' },
        { label: 'Процесс работы', value: 'process' },
        { label: 'Результаты', value: 'results' },
        { label: 'Технические', value: 'technical' },
        { label: 'Ниши', value: 'niches' },
      ],
      defaultValue: 'general',
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
