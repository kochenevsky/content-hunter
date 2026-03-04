'use client'
import { useEffect, useState } from 'react'

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const

function buildUtmHref(baseUrl: string): string {
  if (!baseUrl) return baseUrl

  const pageParams = new URLSearchParams(window.location.search)
  const utmParams = new URLSearchParams()

  UTM_KEYS.forEach((key) => {
    const val = pageParams.get(key)
    if (val) utmParams.set(key, val)
  })

  const utmString = utmParams.toString()
  if (!utmString) return baseUrl

  try {
    const url = new URL(baseUrl)
    utmParams.forEach((val, key) => {
      if (!url.searchParams.has(key)) {
        url.searchParams.set(key, val)
      }
    })
    return url.toString()
  } catch {
    const separator = baseUrl.includes('?') ? '&' : '?'
    return `${baseUrl}${separator}${utmString}`
  }
}

export function useUtmLink(baseUrl: string): string {
  // Инициализируем сразу с UTM если window уже доступен (клиентский рендер)
  const [href, setHref] = useState<string>(() => {
    if (typeof window === 'undefined') return baseUrl
    return buildUtmHref(baseUrl)
  })

  useEffect(() => {
    setHref(buildUtmHref(baseUrl))
  }, [baseUrl])

  return href
}
