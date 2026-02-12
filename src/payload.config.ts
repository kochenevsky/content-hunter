import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

// Collections
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Cases } from './collections/Cases'
import { BlogPosts } from './collections/BlogPosts'
import { Pricing } from './collections/Pricing'
import { FAQ } from './collections/FAQ'
import { Team } from './collections/Team'

// Globals
import { Header } from './globals/Header'
import { Footer } from './globals/Footer'
import { Settings } from './globals/Settings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * Разбираем DATABASE_URI на отдельные параметры.
 * pg-pool некорректно парсит connectionString, если в username есть точка
 * (postgres.PROJECT_REF), поэтому передаём host/port/user/password напрямую.
 */
function parseDbConfig() {
  const uri = process.env.DATABASE_URI || process.env.DATABASE_URL || ''

  if (uri && uri.startsWith('postgres')) {
    try {
      // postgresql://user:pass@host:port/database
      const url = new URL(uri.replace(/^postgresql:\/\//, 'http://'))
      return {
        host: url.hostname,
        port: Number(url.port) || 5432,
        user: decodeURIComponent(url.username),
        password: decodeURIComponent(url.password),
        database: url.pathname.replace(/^\//, '') || 'postgres',
      }
    } catch {
      // Если URL не парсится, пробуем как connectionString
      return { connectionString: uri }
    }
  }

  // Fallback: отдельные env-переменные
  return {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'postgres',
  }
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' | Content Hunter',
    },
    components: {
      graphics: {
        Logo: '@/components/admin/Logo',
        Icon: '@/components/admin/Icon',
      },
    },
    livePreview: {
      url: ({ data, collectionConfig }) => {
        const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
        if (collectionConfig?.slug === 'pages') {
          const slug = (data as Record<string, unknown>)?.slug as string
          if (slug === 'home') return baseUrl
          return `${baseUrl}/${slug}`
        }
        if (collectionConfig?.slug === 'cases') {
          return `${baseUrl}/cases/${(data as Record<string, unknown>)?.slug}`
        }
        if (collectionConfig?.slug === 'blog-posts') {
          return `${baseUrl}/blog/${(data as Record<string, unknown>)?.slug}`
        }
        return baseUrl
      },
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
      collections: ['pages', 'cases', 'blog-posts'],
      globals: ['header', 'footer', 'settings'],
    },
  },

  collections: [
    Users,
    Media,
    Pages,
    Cases,
    BlogPosts,
    Pricing,
    FAQ,
    Team,
  ],

  globals: [
    Header,
    Footer,
    Settings,
  ],

  editor: lexicalEditor(),

  secret: process.env.PAYLOAD_SECRET || 'default-secret-change-me-in-production',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: postgresAdapter({
    pool: {
      ...parseDbConfig(),
      ssl: { rejectUnauthorized: false },
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    },
    migrationDir: path.resolve(dirname, 'migrations'),
    generateSchemaOutputFile: path.resolve(dirname, 'payload-generated-schema.ts'),
    push: true, // auto-push schema (без файлов миграций) — удобно для разработки
  }),

  plugins: [
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],

  sharp,

  localization: {
    locales: [
      {
        label: 'Русский',
        code: 'ru',
      },
      {
        label: 'English',
        code: 'en',
      },
    ],
    defaultLocale: 'ru',
    fallback: true,
  },
})
