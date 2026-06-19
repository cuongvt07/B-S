import type { Metadata } from 'next';
import { Providers } from './providers';
import { COMPANY, SITE } from '@/lib/constants';
import { JsonLd } from '@/components/seo';
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
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: COMPANY.legalName,
            alternateName: SITE.name,
            url: SITE.url,
            taxID: COMPANY.taxCode,
            foundingDate: '2026-06-08',
            telephone: SITE.contactPhone,
            email: SITE.contactEmail,
            address: {
              '@type': 'PostalAddress',
              streetAddress: '140 Nguyễn Diêu',
              addressLocality: 'Phường Quy Nhơn Đông',
              addressRegion: 'Tỉnh Gia Lai',
              addressCountry: 'VN',
            },
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
