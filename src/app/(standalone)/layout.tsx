import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  // Мета-теги для корректного отображения в WebView
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
};

export default function StandaloneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
