'use client'

import { useRef, useState, type ReactNode, type MouseEvent } from 'react'

interface GlowCardProps {
  children: ReactNode
  className?: string
  glowColor?: string
  glowSize?: number
}

export function GlowCard({
  children,
  className,
  glowColor = 'rgba(239, 68, 68, 0.15)',
  glowSize = 200,
}: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouse = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const { left, top } = ref.current.getBoundingClientRect()
    setGlowPosition({
      x: e.clientX - left,
      y: e.clientY - top,
    })
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden ${className ?? ''}`}
    >
      {/* Glow element */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(${glowSize}px circle at ${glowPosition.x}px ${glowPosition.y}px, ${glowColor}, transparent 70%)`,
        }}
      />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
