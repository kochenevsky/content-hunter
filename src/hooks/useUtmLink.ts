'use client'
import { useEffect, useState } from 'react'

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const

function buildUtmHref(baseUrl: string): string {
  if (!baseUrl) return baseUrl

  const pageParams = new URLSearchParams(window.location.search)

  // Режим 1: в ссылке есть переменные {utm_source} — просто подставляем значения
  if (baseUrl.includes('{utm_')) {
    let result = baseUrl
    UTM_KEYS.forEach((key) => {
      const val = pageParams.get(key) ?? ''
      result = result.replaceAll(`{${key}}`, val)
    })
    // Убираем пустые параметры вида &utm_medium= если значения нет
    result = result.replace(/[?&][^=&]+=(?=&|$)/g, (match) => match.startsWith('?') ? '?' : '')
    result = result.replace(/\?&/, '?').replace(/[?&]$/, '')
    return result
  }

  // Режим 2: переменных нет — добавляем UTM как новые параметры (старое поведение)
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
  const [href, setHref] = useState<string>(() => {
    if (typeof window === 'undefined') return baseUrl
    return buildUtmHref(baseUrl)
  })

  useEffect(() => {
    setHref(buildUtmHref(baseUrl))
  }, [baseUrl])

  return href
}
