'use client'
import { useEffect, useRef, useState } from 'react'
import { UtmLink } from '@/components/ui/UtmLink'
import { ArrowRight } from 'lucide-react'

export function StickyMobileCta() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-neutral-950 border-t border-neutral-800 md:hidden">
      <UtmLink
        href="https://sbsite.pro//ru_site_ch_1"
        className="flex items-center justify-center w-full px-6 py-4 text-base font-medium rounded-lg bg-primary-500 hover:bg-primary-600 text-white transition-colors"
      >
        Получить консультацию
        <ArrowRight className="w-5 h-5 ml-2" />
      </UtmLink>
    </div>
  )
}
