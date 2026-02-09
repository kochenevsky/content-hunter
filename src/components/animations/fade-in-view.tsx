'use client'

import { motion, type Variants } from 'framer-motion'
import { type ReactNode } from 'react'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

interface FadeInViewProps {
  children: ReactNode
  direction?: Direction
  delay?: number
  duration?: number
  className?: string
  once?: boolean
  amount?: number
  as?: 'div' | 'section' | 'article' | 'span' | 'li'
}

const getVariants = (direction: Direction, duration: number): Variants => {
  const offsets: Record<Direction, { x: number; y: number }> = {
    up: { x: 0, y: 40 },
    down: { x: 0, y: -40 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
    none: { x: 0, y: 0 },
  }

  const { x, y } = offsets[direction]

  return {
    hidden: {
      opacity: 0,
      x,
      y,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  }
}

export function FadeInView({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.35,
  className,
  once = true,
  amount = 0.1,
  as = 'div',
}: FadeInViewProps) {
  const Component = motion[as] as typeof motion.div

  return (
    <Component
      variants={getVariants(direction, duration)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </Component>
  )
}

// Stagger container for children
interface StaggerContainerProps {
  children: ReactNode
  className?: string
  stagger?: number
  delay?: number
  once?: boolean
  amount?: number
}

export function StaggerContainer({
  children,
  className,
  stagger = 0.05,
  delay = 0,
  once = true,
  amount = 0.1,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      transition={{
        staggerChildren: stagger,
        delayChildren: delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger item to be used inside StaggerContainer
interface StaggerItemProps {
  children: ReactNode
  className?: string
  direction?: Direction
  duration?: number
}

export function StaggerItem({
  children,
  className,
  direction = 'up',
  duration = 0.3,
}: StaggerItemProps) {
  return (
    <motion.div
      variants={getVariants(direction, duration)}
      className={className}
    >
      {children}
    </motion.div>
  )
}
