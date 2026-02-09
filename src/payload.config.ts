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
      connectionString: process.env.DATABASE_URI || process.env.DATABASE_URL || '',
      ssl: { rejectUnauthorized: false },
    },
    // @ts-ignore - Force IPv4 connections
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  }),
  
  plugins: [
    vercelBlobStorage({
      enabled: true,
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
