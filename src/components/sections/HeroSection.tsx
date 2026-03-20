'use client'

import { UtmLink } from '@/components/ui/UtmLink'
import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Play, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatedCounter } from '@/components/animations/animated-counter'
import { MagneticButton } from '@/components/animations/magnetic-button'
import { WordCycle } from '@/components/animations/text-reveal'
import { AnimatedGrid } from '@/components/animations/parallax-section'

const DEFAULT_STATS = [
  { value: 50, suffix: '+', label: 'Проектов' },
  { value: 20, suffix: 'М+', label: 'Просмотров/мес' },
  { value: 8, suffix: '', label: 'Стран' },
]

const DEFAULT_CYCLE_WORDS = ['под ключ', 'с гарантией', 'для бизнеса', 'на масштаб']

const DEFAULT_COLORS = [
  'from-red-500/20 to-orange-500/20',
  'from-blue-500/20 to-purple-500/20',
  'from-emerald-500/20 to-teal-500/20',
  'from-amber-500/20 to-yellow-500/20',
  'from-pink-500/20 to-rose-500/20',
  'from-violet-500/20 to-indigo-500/20',
  'from-cyan-500/20 to-sky-500/20',
]

export type HeroSectionProps = {
  headline?: string | null
  subheadline?: string | null
  primaryButtonText?: string | null
  primaryButtonLink?: string | null
  secondaryButtonText?: string | null
  secondaryButtonLink?: string | null
  stats?: Array<{ value?: number; suffix?: string; label?: string }> | null
  cycleWords?: Array<{ word?: string } | string> | null
  badge?: string | null
  /** Карточки видеокарусели из админки (YouTube или Vimeo). */
  videoCards?: Array<{ platform?: string; videoId?: string; id?: string }> | null
}

type VideoCard = { id: string; platform: 'youtube' | 'vimeo'; client: string; color: string }

function CardStack({ cards }: { cards: VideoCard[] }) {
  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState<VideoCard | null>(null)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || playing || cards.length === 0) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % cards.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [paused, playing, cards.length])

  const handlePlay = useCallback((card: VideoCard) => {
    setPlaying(card)
    setPaused(true)
  }, [])

  const handleClose = useCallback(() => {
    setPlaying(null)
    setPaused(false)
  }, [])

  // Show 4 cards in the stack: current on top, next 3 behind. Render back-to-front so z-index stacks correctly.
  const visibleCards = Array.from({ length: 4 }, (_, i) => {
    const index = (current + i) % cards.length
    return { ...cards[index], stackIndex: i }
  })
  const cardsToRender = [...visibleCards].reverse() // не мутируем исходный массив

  return (
    <div className="relative w-[280px] h-[420px] md:w-[320px] md:h-[480px] flex-shrink-0">
      {/* Video player overlay */}
      <AnimatePresence>
        {playing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-50 rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black"
          >
            {playing.platform === 'vimeo' ? (
              <iframe
                src={`https://player.vimeo.com/video/${playing.id}?autoplay=1`}
                title="Vimeo"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            ) : (
              <iframe
                src={`https://www.youtube.com/embed/${playing.id}?autoplay=1&rel=0&modestbranding=1`}
                title="YouTube"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="w-full h-full"
              />
            )}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-white/20 hover:bg-black/80 transition-colors z-10"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card stack — рендер с задней карты к передней */}
      <AnimatePresence mode="popLayout" initial={false}>
        {cardsToRender.map((card) => (
          <motion.div
            key={`${current}-${card.stackIndex}-${card.id}`}
            layout
            className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10 cursor-pointer bg-neutral-800"
            onClick={() => card.stackIndex === 0 && handlePlay(card)}
            initial={{
              scale: 0.95,
              y: 20,
              opacity: 0,
            }}
            animate={{
              scale: 1 - card.stackIndex * 0.05,
              y: card.stackIndex * -16,
              x: card.stackIndex * 8,
              opacity: 1 - card.stackIndex * 0.2,
            }}
            exit={{
              scale: 1.02,
              y: -20,
              opacity: 0,
              transition: { duration: 0.2 },
            }}
            transition={{ duration: 0.25 }}
            whileHover={card.stackIndex === 0 ? { scale: 1.02 } : {}}
            style={{ zIndex: 10 - card.stackIndex }}
          >
            {/* Thumbnail: YouTube — img.youtube.com, Vimeo — vumbnail.com (работает в РФ) */}
            <div className="absolute inset-0 bg-neutral-700">
              <Image
                src={card.platform === 'vimeo' ? `https://vumbnail.com/${card.id}.jpg` : `https://img.youtube.com/vi/${card.id}/sddefault.jpg`}
                alt={card.client}
                fill
                sizes="(max-width: 768px) 280px, 320px"
                className="object-cover"
                loading="eager"
                unoptimized
              />
            </div>
            {/* Overlay gradient */}
            <div className={`absolute inset-0 bg-gradient-to-t ${card.color} mix-blend-overlay pointer-events-none`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:scale-105">
                <Play className="w-6 h-6 text-white fill-white ml-0.5" />
              </div>
            </div>
            {/* Client label */}
            <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
              <p className="text-white/90 text-sm font-medium">{card.client}</p>
              <p className="text-white/50 text-xs">{card.platform === 'vimeo' ? 'Vimeo' : 'YouTube Shorts'}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

function normalizeVideoCards(raw: HeroSectionProps['videoCards']): VideoCard[] {
  if (!raw?.length) return []
  return raw
    .map((item, i) => {
      const id = ((item.videoId ?? item.id) ?? '').trim()
      if (!id) return null
      const platform = (item.platform === 'vimeo' ? 'vimeo' : 'youtube') as 'youtube' | 'vimeo'
      return {
        id,
        platform,
        client: platform === 'vimeo' ? 'Vimeo' : 'YouTube Shorts',
        color: DEFAULT_COLORS[i % DEFAULT_COLORS.length],
      }
    })
    .filter((c): c is VideoCard => c != null)
}

export function HeroSection({ headline, subheadline, primaryButtonText, primaryButtonLink, secondaryButtonText, secondaryButtonLink, stats, cycleWords, badge, videoCards }: HeroSectionProps = {}) {
  const statsList = stats?.length ? stats.map(s => {
    const v = s.value
    const num = typeof v === 'number' ? v : parseInt(String(v || '0'), 10)
    return { value: isNaN(num) ? 0 : num, suffix: String(s.suffix || ''), label: String(s.label || '') }
  }) : DEFAULT_STATS
  const words = cycleWords?.length ? cycleWords.map(w => (typeof w === 'string' ? w : (w as { word?: string }).word || '')).filter(Boolean) : DEFAULT_CYCLE_WORDS
  const cards = normalizeVideoCards(videoCards)

  return (
    <section className="relative min-h-screen bg-neutral-950 text-white flex items-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950" />
        <AnimatedGrid />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950/60" />
      </div>

      {/* Content */}
      <div className="container relative z-10 pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12 lg:gap-16">
          {/* Left side — text */}
          <div className="max-w-2xl flex-shrink-0">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.05 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
              </span>
              {badge ?? 'Бесплатная настройка оборудования'}
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="heading-display text-white mb-6"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <span className="block">{headline || 'Контент-завод'}</span>
              {words.length > 0 && (
              <span className="text-primary-500">
                <WordCycle words={words} interval={2500} />
              </span>
              )}
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="text-xl md:text-2xl text-neutral-400 max-w-2xl mb-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.15 }}
            >
              {subheadline || 'Разворачиваем инфраструктуру по созданию, масштабированию и массовой дистрибуции контента — от производства роликов до публикации на десятках аккаунтов.'}
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.2 }}
            >
              <MagneticButton strength={0.2}>
                <UtmLink
                  href={primaryButtonLink || '/contact'}
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg bg-primary-500 hover:bg-primary-600 text-white transition-colors relative group overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative flex items-center">
                    {primaryButtonText || 'Получить консультацию'}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </UtmLink>
              </MagneticButton>
              <MagneticButton strength={0.15}>
                <UtmLink
                  href={secondaryButtonLink || '/cases'}
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg border border-neutral-700 text-white hover:border-neutral-500 bg-transparent transition-colors"
                >
                  <Play className="w-5 h-5 mr-2" />
                  {secondaryButtonText || 'Смотреть кейсы'}
                </UtmLink>
              </MagneticButton>
            </motion.div>

            {/* Animated Stats */}
            <motion.div
              className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-neutral-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.25 }}
            >
              {statsList.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl md:text-5xl font-bold text-white">
                    <AnimatedCounter
                      target={stat.value}
                      suffix={stat.suffix}
                      duration={1}
                    />
                  </p>
                  <p className="text-neutral-500 mt-2">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right side — card stack (только если в БД есть карточки) */}
          {cards.length > 0 && (
            <motion.div
              className="hidden lg:flex items-center justify-center flex-shrink-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <CardStack cards={cards} />
            </motion.div>
          )}
        </div>
      </div>

      {/* Decorative blobs — статичные для производительности */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-primary-500 rounded-full blur-[150px] opacity-[0.07]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-500 rounded-full blur-[120px] opacity-10" />

      {/* Scroll indicator — без анимации */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-80">
        <div className="w-6 h-10 rounded-full border-2 border-neutral-600 flex items-start justify-center p-1.5">
          <div className="w-1 h-2 bg-neutral-400 rounded-full mt-1" />
        </div>
      </div>
    </section>
  )
}
