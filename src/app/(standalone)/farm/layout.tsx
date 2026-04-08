// app/layout.tsx
import { MetricsProvider } from './providers/MetricsProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <MetricsProvider>
          {children}
        </MetricsProvider>
      </body>
    </html>
  );
}
