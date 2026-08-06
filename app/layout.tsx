import type { Metadata } from 'next';
import Script from 'next/script';
import { Manrope } from 'next/font/google';
import { Providers } from './providers';
import { COMPANY, SITE } from '@/lib/constants';
import { JsonLd } from '@/components/seo';
import { SocialProofToast } from '@/components/layout';
import { getSiteSettings } from '@/lib/server-data';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-sans',
});

export async function generateMetadata(): Promise<Metadata> {
  const { seo, contact, branding } = await getSiteSettings();
  const base = seo.canonical_base || SITE.url;
  const ogImages = seo.og_image ? [{ url: seo.og_image }] : undefined;

  return {
    metadataBase: new URL(base),
    title: {
      default: seo.default_title,
      template: seo.title_template || '%s',
    },
    description: seo.default_description,
    keywords: seo.keywords || undefined,
    openGraph: {
      title: seo.default_title,
      description: seo.default_description,
      url: base,
      siteName: contact.site_name,
      locale: 'vi_VN',
      type: 'website',
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      site: seo.twitter_handle || undefined,
      images: seo.og_image || undefined,
    },
    robots: { index: seo.robots_index, follow: seo.robots_index },
    icons: branding.favicon ? { icon: branding.favicon } : undefined,
    verification: {
      // Ưu tiên giá trị nhập từ CMS; mặc định dùng mã xác minh Google Search Console.
      google: seo.google_site_verification || 'QpGOzRD5HK6ZogECs1_sxlTXSZ3TX2lb2ld4hvWIv-8',
    },
    other: seo.facebook_app_id ? { 'fb:app_id': seo.facebook_app_id } : undefined,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { seo } = await getSiteSettings();
  // Ưu tiên id nhập từ CMS; mặc định dùng Google tag GA4 đã cấp.
  const analyticsId = seo.analytics_id?.trim() || 'G-3C6FDQ4L2E';
  const isGtm = analyticsId.startsWith('GTM-');
  const isGa4 = analyticsId.startsWith('G-');

  return (
    <html lang="vi" className={manrope.variable}>
      <head>
        {isGtm && (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${analyticsId}');`}
          </Script>
        )}
        {isGa4 && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${analyticsId}');`}
            </Script>
          </>
        )}
      </head>
      <body className="min-h-screen flex flex-col">
        {isGtm && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${analyticsId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
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
        <Providers>
          {children}
          <SocialProofToast />
        </Providers>
      </body>
    </html>
  );
}
