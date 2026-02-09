'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import Link from 'next/link'
import { AnimatedCounter } from '@/components/animations/animated-counter'
import { MagneticButton } from '@/components/animations/magnetic-button'
import { WordCycle } from '@/components/animations/text-reveal'
import { AnimatedGrid } from '@/components/animations/parallax-section'

const stats = [
  { value: 50, suffix: '+', label: 'Проектов' },
  { value: 20, suffix: 'М+', label: 'Просмотров/мес' },
  { value: 8, suffix: '', label: 'Стран' },
]

const cycleWords = ['под ключ', 'с гарантией', 'для бизнеса', 'на масштаб']

// YouTube Shorts thumbnails from real client projects
const videoCards = [
  { id: 'gLKgolZi_do', client: 'Booster Cap', color: 'from-red-500/20 to-orange-500/20' },
  { id: 'BRA7KSecCYQ', client: 'Relisme', color: 'from-blue-500/20 to-purple-500/20' },
  { id: 'jcazjbT-n4w', client: 'Недвижимость СПб', color: 'from-emerald-500/20 to-teal-500/20' },
  { id: 'djdXr49DC-Q', client: 'Клиника Дубай', color: 'from-amber-500/20 to-yellow-500/20' },
  { id: '6TodhymWsFQ', client: 'Ресторан Дубай', color: 'from-pink-500/20 to-rose-500/20' },
  { id: '_KbGGubr6_Q', client: 'Booster Cap', color: 'from-violet-500/20 to-indigo-500/20' },
  { id: 'I-eocyqs368', client: 'Relisme', color: 'from-cyan-500/20 to-sky-500/20' },
]

function CardStack() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % videoCards.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  // Show 4 cards in the stack: current on top, next 3 behind
  const visibleCards = Array.from({ length: 4 }, (_, i) => {
    const index = (current + i) % videoCards.length
    return { ...videoCards[index], stackIndex: i }
  })

  return (
    <div className="relative w-[280px] h-[420px] md:w-[320px] md:h-[480px]">
      <AnimatePresence mode="popLayout">
        {visibleCards.reverse().map((card) => (
          <motion.div
            key={`${card.id}-${card.stackIndex}`}
            className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            initial={{
              scale: 0.85,
              y: 60,
              opacity: 0,
              rotateZ: Math.random() * 6 - 3,
            }}
            animate={{
              scale: 1 - card.stackIndex * 0.05,
              y: card.stackIndex * -16,
              x: card.stackIndex * 8,
              opacity: 1 - card.stackIndex * 0.2,
              rotateZ: card.stackIndex * 2 - 2,
            }}
            exit={{
              scale: 1.05,
              y: -40,
              opacity: 0,
              rotateZ: -5,
              transition: { duration: 0.4, ease: [0.25, 0.4, 0.25, 1] },
            }}
            transition={{
              type: 'spring',
              stiffness: 120,
              damping: 20,
              mass: 0.8,
            }}
            style={{ zIndex: 10 - card.stackIndex }}
          >
            {/* YouTube thumbnail — max resolution */}
            <img
              src={`https://img.youtube.com/vi/${card.id}/maxresdefault.jpg`}
              alt={card.client}
              loading="eager"
              className="w-full h-full object-cover"
            />
            {/* Overlay gradient */}
            <div className={`absolute inset-0 bg-gradient-to-t ${card.color} mix-blend-overlay`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <Play className="w-6 h-6 text-white fill-white ml-0.5" />
              </div>
            </div>
            {/* Client label */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-white/90 text-sm font-medium">{card.client}</p>
              <p className="text-white/50 text-xs">YouTube Shorts</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export function HeroSection() {
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
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
              </span>
              Гарантия охватов в договоре
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="heading-display text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <span className="block">Контент-завод</span>
              <span className="text-primary-500">
                <WordCycle words={cycleWords} interval={2500} />
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="text-xl md:text-2xl text-neutral-400 max-w-2xl mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Разворачиваем инфраструктуру по созданию, масштабированию и массовой дистрибуции контента — от производства роликов до публикации на десятках аккаунтов.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <MagneticButton strength={0.2}>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg bg-primary-500 hover:bg-primary-600 text-white transition-colors relative group overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative flex items-center">
                    Получить консультацию
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </MagneticButton>
              <MagneticButton strength={0.15}>
                <Link
                  href="/cases"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg border border-neutral-700 text-white hover:border-neutral-500 bg-transparent transition-colors"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Смотреть кейсы
                </Link>
              </MagneticButton>
            </motion.div>

            {/* Animated Stats */}
            <motion.div
              className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-neutral-800"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 + index * 0.15 }}
                >
                  <p className="text-3xl md:text-5xl font-bold text-white">
                    <AnimatedCounter
                      target={stat.value}
                      suffix={stat.suffix}
                      duration={2}
                    />
                  </p>
                  <p className="text-neutral-500 mt-2">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right side — card stack */}
          <motion.div
            className="hidden lg:flex items-center justify-center flex-shrink-0"
            initial={{ opacity: 0, scale: 0.9, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <CardStack />
          </motion.div>
        </div>
      </div>

      {/* Decorative blobs */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-primary-500 rounded-full blur-[150px]"
      />
      <motion.div
        animate={{
          scale: [1, 0.95, 1],
          opacity: [0.08, 0.15, 0.08],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-500 rounded-full blur-[120px]"
      />

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 rounded-full border-2 border-neutral-600 flex items-start justify-center p-1.5"
        >
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5], scaleY: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-2 bg-neutral-400 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
