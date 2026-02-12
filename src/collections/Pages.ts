import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Страница',
    plural: 'Страницы',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Контент',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data }) => {
        const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
        const slug = data?.slug as string
        if (slug === 'home') return baseUrl
        return `${baseUrl}/${slug}`
      },
    },
    preview: (data) => {
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
      const slug = data?.slug as string
      if (slug === 'home') return baseUrl
      return `${baseUrl}/${slug}`
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
    // Hero блок
    {
      name: 'hero',
      type: 'group',
      label: 'Hero секция',
      fields: [
        {
          name: 'headline',
          type: 'text',
          label: 'Заголовок',
          localized: true,
        },
        {
          name: 'subheadline',
          type: 'textarea',
          label: 'Подзаголовок',
          localized: true,
        },
        {
          name: 'image',
          type: 'upload',
          label: 'Изображение',
          relationTo: 'media',
        },
        {
          name: 'ctaPrimary',
          type: 'group',
          label: 'Основная кнопка',
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
        {
          name: 'ctaSecondary',
          type: 'group',
          label: 'Вторичная кнопка',
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
    },
    // Блоки контента
    {
      name: 'blocks',
      type: 'blocks',
      label: 'Блоки',
      blocks: [
        // Текстовый блок
        {
          slug: 'content',
          labels: {
            singular: 'Контент',
            plural: 'Контент',
          },
          fields: [
            {
              name: 'content',
              type: 'richText',
              label: 'Контент',
              localized: true,
            },
          ],
        },
        // CTA блок
        {
          slug: 'cta',
          labels: {
            singular: 'CTA',
            plural: 'CTA',
          },
          fields: [
            {
              name: 'headline',
              type: 'text',
              label: 'Заголовок',
              localized: true,
            },
            {
              name: 'text',
              type: 'textarea',
              label: 'Текст',
              localized: true,
            },
            {
              name: 'buttonText',
              type: 'text',
              label: 'Текст кнопки',
              localized: true,
            },
            {
              name: 'buttonLink',
              type: 'text',
              label: 'Ссылка',
            },
          ],
        },
        // Features блок
        {
          slug: 'features',
          labels: {
            singular: 'Преимущества',
            plural: 'Преимущества',
          },
          fields: [
            {
              name: 'headline',
              type: 'text',
              label: 'Заголовок',
              localized: true,
            },
            {
              name: 'features',
              type: 'array',
              label: 'Пункты',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Заголовок',
                  localized: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Описание',
                  localized: true,
                },
                {
                  name: 'icon',
                  type: 'text',
                  label: 'Иконка (Lucide)',
                },
              ],
            },
          ],
        },
      ],
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
        {
          name: 'image',
          type: 'upload',
          label: 'OG Image',
          relationTo: 'media',
        },
      ],
    },
  ],
}
