import type { MetadataRoute } from 'next';
import { categories } from '@/mocks/data/categories';
import { cities } from '@/mocks/data/cities';
import { SITE } from '@/lib/constants';
import { listListings, listBlogs, getSiteSettings } from '@/lib/server-data';

// Revalidate the sitemap at most every 30 minutes.
export const revalidate = 1800;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSiteSettings();
  const base = (settings.seo.canonical_base || SITE.url).replace(/\/$/, '');
  const now = new Date();

  // Dynamic content from the live API (functions fall back safely on error).
  const [listingsRes, blogsRes] = await Promise.all([
    listListings({ pageSize: 1000 }),
    listBlogs({ pageSize: 500 }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/tin-dang`, lastModified: now, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${base}/goi-moi-gioi`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${base}/${c.slug}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const cityLandingRoutes: MetadataRoute.Sitemap = cities.map((c) => ({
    url: `${base}/nha-dat-${c.slug}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  const listingRoutes: MetadataRoute.Sitemap = listingsRes.data.map((l) => ({
    url: `${base}/tin-dang/${l.slug}`,
    lastModified: l.updatedAt ? new Date(l.updatedAt) : now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogsRes.data.map((b) => ({
    url: `${base}/blog/${b.slug}`,
    lastModified: b.updatedAt ? new Date(b.updatedAt) : now,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...staticRoutes, ...categoryRoutes, ...cityLandingRoutes, ...listingRoutes, ...blogRoutes];
}
