'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, useMotionValue, useSpring } from 'framer-motion'

interface AnimatedCounterProps {
  target: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
}

export function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
  duration = 2,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
    duration: duration * 1000,
  })
  const [displayValue, setDisplayValue] = useState('0')

  useEffect(() => {
    if (isInView) {
      motionValue.set(target)
    }
  }, [isInView, motionValue, target])

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      const rounded = Math.round(latest)
      if (target >= 1000000) {
        // Format as M (millions)
        setDisplayValue((latest / 1000000).toFixed(latest / 1000000 >= 10 ? 0 : 1))
      } else if (target >= 1000) {
        setDisplayValue(rounded.toLocaleString('ru-RU'))
      } else {
        setDisplayValue(String(rounded))
      }
    })

    return () => unsubscribe()
  }, [springValue, target])

  return (
    <span ref={ref} className={className}>
      {prefix}{displayValue}{suffix}
    </span>
  )
}
