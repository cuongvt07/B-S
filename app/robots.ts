import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/constants';
import { getSiteSettings } from '@/lib/server-data';
import { requestBaseUrl } from '@/lib/seo-base';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { seo } = await getSiteSettings();
  // Khớp host đang phục vụ để link sitemap trong robots.txt đúng domain.
  const base = requestBaseUrl(seo.canonical_base || SITE.url);

  // When indexing is disabled in the CMS, block all crawlers site-wide.
  if (!seo.robots_index) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
      sitemap: `${base}/sitemap.xml`,
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Chặn khu vực riêng tư + trang tiện ích không cần index.
        disallow: [
          '/api/',
          '/tai-khoan/',
          '/so-sanh',
          '/dang-nhap',
          '/dang-ky',
          '/tin-dang/map',
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
