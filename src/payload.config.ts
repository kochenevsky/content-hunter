import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor, BlocksFeature, CodeBlock } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
// eslint-disable-next-line @typescript-eslint/no-require-imports
import pg from 'pg'

/**
 * Для Supabase Transaction mode (порт 6543): убираем named prepared statements.
 * Supavisor в Transaction mode не поддерживает их, т.к. бэкенд-соединение
 * может меняться между запросами.
 * Патчим и Pool.query и Client.query.
 */
if (process.env.VERCEL === '1') {
  function stripPreparedName(args: unknown[]): unknown[] {
    if (args.length > 0 && typeof args[0] === 'object' && args[0] !== null && 'name' in args[0]) {
      delete (args[0] as Record<string, unknown>).name
    }
    return args
  }

  const origPoolQuery = pg.Pool.prototype.query as (...args: unknown[]) => unknown
  // @ts-expect-error — monkey-patch
  pg.Pool.prototype.query = function (...args: unknown[]) {
    return origPoolQuery.apply(this, stripPreparedName(args))
  }

  const origClientQuery = pg.Client.prototype.query as (...args: unknown[]) => unknown
  // @ts-expect-error — monkey-patch
  pg.Client.prototype.query = function (...args: unknown[]) {
    return origClientQuery.apply(this, stripPreparedName(args))
  }
}

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
import { HomePage } from './globals/HomePage'
import { ServicesPage } from './globals/ServicesPage'
import { AboutPage } from './globals/AboutPage'
import { PricingPage } from './globals/PricingPage'
import { FAQPage } from './globals/FAQPage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * Разбираем DATABASE_URI на отдельные параметры.
 * pg-pool некорректно парсит connectionString, если в username есть точка.
 */
function parseDbConfig() {
  const uri = process.env.DATABASE_URI || process.env.DATABASE_URL || ''

  if (uri && uri.startsWith('postgres')) {
    try {
      const url = new URL(uri.replace(/^postgresql?:\/\//, 'http://'))
      return {
        host: url.hostname,
        port: Number(url.port) || 5432,
        user: decodeURIComponent(url.username),
        password: decodeURIComponent(url.password),
        database: url.pathname.replace(/^\//, '') || 'postgres',
      }
    } catch {
      return { connectionString: uri }
    }
  }

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
      url: ({ data, collectionConfig, globalConfig }) => {
        const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
        if (globalConfig) {
          const slug = globalConfig.slug
          if (slug === 'home-page') return baseUrl
          if (slug === 'services-page') return `${baseUrl}/services`
          if (slug === 'about-page') return `${baseUrl}/about`
          if (slug === 'pricing-page') return `${baseUrl}/pricing`
          if (slug === 'faq-page') return `${baseUrl}/faq`
          if (slug === 'header' || slug === 'footer' || slug === 'settings') return baseUrl
          return baseUrl
        }
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
      globals: ['header', 'footer', 'settings', 'home-page', 'services-page', 'about-page', 'pricing-page', 'faq-page'],
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
    HomePage,
    ServicesPage,
    AboutPage,
    PricingPage,
    FAQPage,
  ],

  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      BlocksFeature({
        blocks: [
          CodeBlock({
            defaultLanguage: 'html',
            languages: {
              plaintext: 'Plain Text',
              html: 'HTML',
              css: 'CSS',
              js: 'JavaScript',
              ts: 'TypeScript',
              json: 'JSON',
            },
          }),
        ],
      }),
    ],
  }),

  secret: process.env.PAYLOAD_SECRET || 'default-secret-change-me-in-production',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: postgresAdapter({
    pool: {
      ...parseDbConfig(),
      ssl: { rejectUnauthorized: false },
      // Serverless: небольшой пул (Payload держит соединение после init)
      max: process.env.VERCEL === '1' ? 3 : 10,
      idleTimeoutMillis: process.env.VERCEL === '1' ? 5000 : 30000,
      connectionTimeoutMillis: 15000,
    },
    migrationDir: path.resolve(dirname, 'migrations'),
    generateSchemaOutputFile: path.resolve(dirname, 'payload-generated-schema.ts'),
    push: process.env.NODE_ENV !== 'production',
    transactionOptions: false,
  }),

  plugins: [
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.S3_BUCKET || 'media',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: process.env.S3_REGION || 'eu-west-1',
        endpoint: process.env.S3_ENDPOINT,
        forcePathStyle: true,
      },
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
