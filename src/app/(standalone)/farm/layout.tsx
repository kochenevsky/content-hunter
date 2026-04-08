// src/app/(standalone)/farm/layout.tsx
import { MetricsProvider } from './providers/MetricsProvider';

export default function FarmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MetricsProvider>
      {children}
    </MetricsProvider>
  );
}
