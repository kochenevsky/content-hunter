'use client'

import { FadeInView } from '@/components/animations/fade-in-view'

export type StatsSectionProps = {
  items?: Array<{ value?: number; suffix?: string; label?: string }> | null
}

export function StatsSection({ items }: StatsSectionProps = {}) {
  return (
    <section className="py-16 bg-[#0b1220]">
      <div className="container max-w-[900px] mx-auto px-4">
        <FadeInView direction="up">
          <div className="rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.1)] shadow-2xl">
            <div style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
              <iframe
                src="https://player.vimeo.com/video/1181500890?badge=0&autopause=0&player_id=0&app_id=58479"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                title="Как работает платформа Content Hunter"
              />
            </div>
          </div>
        </FadeInView>
      </div>
    </section>
  )
}
