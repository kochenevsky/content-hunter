// src/app/farm/_components/StickyCta.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'

export function StickyCta({ href, label }: { href: string; label: string }) {
  const [visible, setVisible] = useState(true)
  const anchorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    )
    if (anchorRef.current) observer.observe(anchorRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* Якорь — сама кнопка на странице */}
      <div ref={anchorRef}>
        <Button href={href} size="lg">
          {label}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>

      {/* Sticky-бар — только на мобиле, скрывается когда кнопка видна */}
      {visible && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-neutral-950 border-t border-neutral-800 md:hidden">
          <Button href={href} size="lg" className="w-full justify-center">
            {label}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}
    </>
  )
}
