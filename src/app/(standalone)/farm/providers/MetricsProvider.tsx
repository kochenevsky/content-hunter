// app/providers/MetricsProvider.tsx
'use client';

import { YandexMetricaProvider, standardYMInitParameters } from '@artginzburg/next-ym';
import { useEffect } from 'react';
import ReactPixel from 'react-facebook-pixel';

export function MetricsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Инициализация Meta Pixel
    ReactPixel.init('1196322745200891');
    ReactPixel.pageView();
  }, []);

  return (
    <YandexMetricaProvider
      tagID={99266290}
      initParameters={{
        ...standardYMInitParameters,
        webvisor: true,
        clickmap: true,
        accurateTrackBounce: true,
        trackLinks: true,
      }}
    >
      {children}
    </YandexMetricaProvider>
  );
}
