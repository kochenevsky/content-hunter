import { ClientMetricsWrapper } from './_components/ClientMetricsWrapper';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Система масштабирования SMM — Content Hunter',
  description: 'Загружай ролики — платформа распространяет их по десяткам прогретых аккаунтов автоматически. Гарантия просмотров в договоре.',
};


import FarmPageClient from './FarmPageClient';

export default function FarmPage() {
  return (
    <ClientMetricsWrapper>
      <FarmPageClient />
    </ClientMetricsWrapper>
  );
}
