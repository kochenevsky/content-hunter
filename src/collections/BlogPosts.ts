import type { CollectionConfig } from 'payload'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  labels: {
    singular: 'Статья',
    plural: 'Статьи',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Контент',
    defaultColumns: ['title', 'category', 'author', 'publishedAt', 'published'],
    livePreview: {
      url: ({ data }) => {
        const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
        return `${baseUrl}/blog/${data?.slug}`
      },
    },
    preview: (data) => {
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
      return `${baseUrl}/blog/${data?.slug}`
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок',
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
      name: 'category',
      type: 'select',
      label: 'Категория',
      required: true,
      options: [
        { label: 'Кейсы', value: 'cases' },
        { label: 'Разборы брендов', value: 'analysis' },
        { label: 'Процессы', value: 'process' },
        { label: 'Анти-мифы', value: 'myths' },
        { label: 'Новости', value: 'news' },
        { label: 'Гайды', value: 'guides' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Краткое описание',
      required: true,
      localized: true,
    },
    {
      name: 'image',
      type: 'upload',
      label: 'Изображение',
      relationTo: 'media',
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Контент',
      localized: true,
    },
    {
      name: 'author',
      type: 'relationship',
      label: 'Автор',
      relationTo: 'team',
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Дата публикации',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd.MM.yyyy',
        },
      },
    },
    {
      name: 'published',
      type: 'checkbox',
      label: 'Опубликована',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    // SEO
    {
      name: 'meta',
      type: 'group',
      label: 'SEO',
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
      ],
    },
  ],
}
