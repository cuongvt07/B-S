import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/constants';
import { getSiteSettings } from '@/lib/server-data';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { seo } = await getSiteSettings();
  const base = seo.canonical_base || SITE.url;

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
        disallow: ['/api/', '/tai-khoan/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
