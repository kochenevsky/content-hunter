import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { AnalyticsHead } from '@/components/AnalyticsHead'
import { getHeader, getFooter, getSettings } from '@/lib/payload-data'
import { StickyMobileCta } from '@/components/ui/StickyMobileCta'


const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: {
    default: 'Content Hunter — Контент-завод под ключ',
    template: '%s | Content Hunter',
  },
  description:
    'Запускаем контент-заводы для бизнеса. Масштабируем охваты через сетку аккаунтов. Гарантия результата в договоре.',
  keywords: [
    'контент-завод',
    'контент-ферма',
    'reels для бизнеса',
    'shorts для бизнеса',
    'smm продвижение',
    'производство видео',
  ],
  authors: [{ name: 'Content Hunter' }],
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Content Hunter',
  },
}

export const revalidate = 60

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [headerData, footerData, settings] = await Promise.all([
    getHeader(),
    getFooter(),
    getSettings(),
  ])

  const analytics = (settings as any)?.analytics

  return (
    <html lang="ru">
  
      <body className={inter.className}>
        <AnalyticsHead
          googleAnalyticsId={analytics?.googleAnalyticsId}
          yandexMetrikaId={analytics?.yandexMetrikaId}
          customHeadScripts={analytics?.customHeadScripts}
        />
        <LivePreviewListener />
        <Header data={headerData as any} />
        <main className="min-h-screen">{children}</main>
        <Footer data={footerData as any} />
        <StickyMobileCta />
      </body>
    </html>
  )
}
