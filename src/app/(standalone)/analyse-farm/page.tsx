import { ClientMetricsWrapper } from './_components/ClientMetricsWrapper';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Система масштабирования SMM — Content Hunter',
  description: 'Загружай ролики — платформа распространяет их по десяткам прогретых аккаунтов автоматически. Гарантия просмотров в договоре.',
};

const SLIDE_URLS = Array.from({ length: 27 }, (_, i) =>
  `/slides/Content%20Hunter%20%D0%B2%D0%B5%D1%80%D1%82%D0%B8%D0%BA%D0%B0%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F_page-${String(i + 1).padStart(4, "0")}.jpg`
);

import FarmPageClient from './FarmPageClient';

export default function FarmPage() {
  return (
    <ClientMetricsWrapper>
      <FarmPageClient slideUrls={SLIDE_URLS} />
    </ClientMetricsWrapper>
  );
}
