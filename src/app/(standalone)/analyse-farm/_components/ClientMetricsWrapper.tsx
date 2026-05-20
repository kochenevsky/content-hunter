'use client';

import dynamic from 'next/dynamic';

const MetricsProvider = dynamic(
  () => import('../providers/MetricsProvider').then(mod => mod.MetricsProvider),
  { ssr: false }
);

export function ClientMetricsWrapper({ children }: { children: React.ReactNode }) {
  return <MetricsProvider>{children}</MetricsProvider>;
}
