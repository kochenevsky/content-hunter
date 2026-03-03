import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'vumbnail.com',
      },
    ],
  },
  // pg должен быть внешним чтобы monkey-patch для Supabase Transaction mode работал
  serverExternalPackages: ['pg'],
  experimental: {
    reactCompiler: false,
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
}

export default withPayload(nextConfig)
