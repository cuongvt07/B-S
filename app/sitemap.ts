import type { MetadataRoute } from 'next';
import { listings } from '@/mocks/data/listings';
import { blogs } from '@/mocks/data/blogs';
import { categories } from '@/mocks/data/categories';
import { cities } from '@/mocks/data/cities';
import { SITE } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/tin-dang`, lastModified: now, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
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

  const listingRoutes: MetadataRoute.Sitemap = listings.map((l) => ({
    url: `${base}/tin-dang/${l.slug}`,
    lastModified: new Date(l.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogs.map((b) => ({
    url: `${base}/blog/${b.slug}`,
    lastModified: new Date(b.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...staticRoutes, ...categoryRoutes, ...cityLandingRoutes, ...listingRoutes, ...blogRoutes];
}
