'use client'

import Script from 'next/script'
import { useEffect } from 'react'

type Props = {
  googleAnalyticsId?: string | null
  yandexMetrikaId?: string | null
  customHeadScripts?: string | null
}

export function AnalyticsHead({ googleAnalyticsId, yandexMetrikaId, customHeadScripts }: Props) {
  // Кастомные скрипты в head (мета-теги, пиксели и т.п.)
  useEffect(() => {
    if (!customHeadScripts?.trim()) return
    const div = document.createElement('div')
    div.innerHTML = customHeadScripts.trim()
    const scripts = div.querySelectorAll('script')
    const rest = div.querySelectorAll(':not(script)')
    rest.forEach((el) => document.head.appendChild(el.cloneNode(true)))
    scripts.forEach((el) => {
      const script = document.createElement('script')
      Array.from(el.attributes).forEach((attr) => script.setAttribute(attr.name, attr.value))
      script.textContent = el.textContent || ''
      document.head.appendChild(script)
    })
  }, [customHeadScripts])

  return (
    <>
      {googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              if (typeof window !== 'undefined') {
  window.dataLayer = window.dataLayer || [];
}
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAnalyticsId}');
            `}
          </Script>
        </>
      )}
      {yandexMetrikaId && (
  <Script id="yandex-metrika" strategy="afterInteractive">
    {`
      if (typeof window !== 'undefined') {
        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
        ym(${yandexMetrikaId}, "init", {clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});
      }
    `}
  </Script>
)}
    </>
  )
}
