import type { CollectionConfig } from 'payload'

export const Team: CollectionConfig = {
  slug: 'team',
  labels: {
    singular: 'Член команды',
    plural: 'Команда',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Контент',
    defaultColumns: ['name', 'role', 'order'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Имя',
      required: true,
    },
    {
      name: 'role',
      type: 'text',
      label: 'Должность',
      required: true,
      localized: true,
    },
    {
      name: 'photo',
      type: 'upload',
      label: 'Фото',
      relationTo: 'media',
    },
    {
      name: 'bio',
      type: 'richText',
      label: 'О себе',
      localized: true,
    },
    {
      name: 'telegram',
      type: 'text',
      label: 'Telegram',
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
