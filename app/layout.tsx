import type { Metadata } from 'next';
import { Providers } from './providers';
import { SITE } from '@/lib/constants';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description:
    'Tìm kiếm và đăng tin cho thuê, mua bán bất động sản: căn hộ, phòng trọ, nhà nguyên căn, văn phòng tại TP.HCM, Hà Nội và toàn quốc.',
  openGraph: {
    title: SITE.name,
    description: SITE.tagline,
    url: SITE.url,
    siteName: SITE.name,
    locale: 'vi_VN',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
