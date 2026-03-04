'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'

const defaultNavigation = [
  { name: 'Услуги', href: '/services' },
  { name: 'Кейсы', href: '/cases' },
  { name: 'Тарифы', href: '/pricing' },
  { name: 'Блог', href: '/blog' },
  { name: 'О нас', href: '/about' },
]

interface HeaderProps {
  data?: {
    navigation?: Array<{ label: string; link: string }>
    ctaButton?: { text?: string; link?: string }
  } | null
}

// Функция для извлечения UTM параметров
function getUtmParams(): string {
  if (typeof window === 'undefined') return ''
  
  const searchParams = new URLSearchParams(window.location.search)
  const utmParams = new URLSearchParams()
  
  // Сохраняем все UTM параметры
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
  utmKeys.forEach(key => {
    const value = searchParams.get(key)
    if (value) utmParams.append(key, value)
  })
  
  return utmParams.toString()
}

// Функция для добавления параметров к URL
function appendUtmToUrl(url: string, utmString: string): string {
  if (!utmString) return url
  
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}${utmString}`
}

export function Header({ data }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [utmParams, setUtmParams] = useState('')
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 50)
  })

  // Загружаем UTM параметры после монтирования компонента
  useEffect(() => {
    setUtmParams(getUtmParams())
  }, [])

  // Используем данные из БД или фоллбэк
  const navigation = data?.navigation?.length
    ? data.navigation.map(item => ({ name: item.label, href: item.link }))
    : defaultNavigation

  const ctaText = data?.ctaButton?.text || 'Консультация'
  const ctaLink = data?.ctaButton?.link || '/contact'

  return (
    <motion.header
      initial={{ y: -20 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-neutral-950/40 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/10 shadow-[0_2px_20px_rgba(0,0,0,0.1)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="container flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-white transition-colors duration-300">
            Content Hunter
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={appendUtmToUrl(item.href, utmParams)}
              className="relative text-sm font-medium text-neutral-300 hover:text-white transition-colors duration-300 group"
            >
              {item.name}
              {/* Animated underline */}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary-500 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Button href={appendUtmToUrl(ctaLink, utmParams)}>{ctaText}</Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden p-2 text-white transition-colors duration-300"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu with AnimatePresence */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-black/30 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/10"
          >
            <div className="container py-4 space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    href={appendUtmToUrl(item.href, utmParams)}
                    className="block py-3 text-base font-medium text-neutral-300 hover:text-white transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </div>
              ))}
              <div className="pt-4 border-t border-white/10">
                <Button href={appendUtmToUrl(ctaLink, utmParams)} className="w-full">
                  {ctaText}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
