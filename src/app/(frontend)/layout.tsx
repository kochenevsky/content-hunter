import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
