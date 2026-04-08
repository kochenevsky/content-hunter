// src/app/(standalone)/farm/layout.tsx
import { MetricsProvider } from './providers/MetricsProvider';

export const metadata = {
  title: 'Система масштабирования SMM — Content Hunter',
  description: 'Загружай ролики — платформа распространяет их по десяткам прогретых аккаунтов автоматически. Гарантия просмотров в договоре.',
}

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
