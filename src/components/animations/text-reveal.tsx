'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'

interface TextRevealProps {
  children: string
  className?: string
  delay?: number
  duration?: number
  stagger?: number
}

const letterVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
}

export function TextReveal({
  children,
  className,
  delay = 0,
  duration = 0.2,
  stagger = 0.02,
}: TextRevealProps) {
  const words = children.split(' ')

  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      className={className}
      style={{ display: 'inline' }}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={`${wordIndex}-${charIndex}`}
              variants={letterVariants}
              transition={{ duration, ease: [0.25, 0.4, 0.25, 1] }}
              style={{ display: 'inline-block' }}
            >
              {char}
            </motion.span>
          ))}
          {wordIndex < words.length - 1 && (
            <span style={{ display: 'inline-block' }}>&nbsp;</span>
          )}
        </span>
      ))}
    </motion.span>
  )
}

// Word cycling component for hero
interface WordCycleProps {
  words: string[]
  className?: string
  interval?: number
}

export function WordCycle({ words, className, interval = 2500 }: WordCycleProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length)
    }, interval)
    return () => clearInterval(timer)
  }, [words.length, interval])

  return (
    <span className={`relative inline-flex overflow-hidden ${className ?? ''}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="inline-block"
        >
          {words[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
