// Принудительно IPv4 для подключения к Postgres (Supabase и др.) — иначе возможен EHOSTUNREACH по IPv6
import dns from 'dns'
dns.setDefaultResultOrder('ipv4first')

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

function connectionStringWithIPv4(uri: string): string {
  if (!uri || !uri.startsWith('postgres')) return uri
  // Pooler уже даёт IPv4, не трогаем (на Vercel serverless sync DNS может быть недоступен)
  if (uri.includes('pooler.supabase.com')) return uri
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lookupSync = (dns as any).lookupSync as ((host: string, opts: { family: number }) => { address: string }) | undefined
    if (typeof lookupSync !== 'function') return uri
    const url = new URL(uri.replace(/^postgresql:\/\//, 'https://'))
    const ipv4 = lookupSync(url.hostname, { family: 4 })
    return uri.replace(url.hostname, ipv4.address)
  } catch {
    return uri
  }
}

function getConnectionString(override?: string): string {
  const raw = override ?? process.env.DATABASE_URI ?? process.env.DATABASE_URL ?? ''
  if (!raw || !raw.startsWith('postgres')) {
    if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'test') {
      console.error(
        '[Payload] DATABASE_URI (или DATABASE_URL) не задана или неверна. ' +
          'В Vercel: Settings → Environment Variables → добавьте DATABASE_URI (Connection pooler, Session mode, port 5432).'
      )
    }
    return raw
  }
  return connectionStringWithIPv4(raw)
}

/** Конфиг с опциональной строкой подключения (для seed при переборе pooler по регионам). */
export function getConfig(connectionStringOverride?: string) {
  const connectionString = getConnectionString(connectionStringOverride)
  return buildConfig({
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
  
  secret: process.env.PAYLOAD_SECRET || '',
  
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  
  db: postgresAdapter({
    pool: {
      connectionString,
      ssl: { rejectUnauthorized: false },
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    },
    // Drizzle: каталог миграций и путь к сгенерированной схеме (см. docs/database/postgres)
    migrationDir: path.resolve(dirname, 'migrations'),
    generateSchemaOutputFile: path.resolve(dirname, 'payload-generated-schema.ts'),
    push: false, // используем миграции, не auto-push
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
  
  // Localization (русский + английский на будущее)
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
}

export default getConfig()
