import type { MetadataRoute } from 'next';
import { categories } from '@/mocks/data/categories';
import { cities } from '@/mocks/data/cities';
import { SITE } from '@/lib/constants';
import { listListings, listVehicles, listBlogs, getSiteSettings } from '@/lib/server-data';
import { requestBaseUrl } from '@/lib/seo-base';

// Revalidate the sitemap at most every 30 minutes.
export const revalidate = 1800;

// Backend cap per_page = 30, nên phải lặp qua các trang để gom hết URL.
const PAGE_SIZE = 30;

interface Paged<T> {
  data: T[];
  meta: { totalPages: number };
}

/**
 * Gom TẤT CẢ mục từ một API phân trang: lấy trang 1 để biết tổng số trang, rồi
 * fetch song song phần còn lại (có trần an toàn maxPages để tránh quá tải).
 */
async function fetchAllPages<T>(
  fetchPage: (page: number) => Promise<Paged<T>>,
  maxPages: number
): Promise<T[]> {
  const first = await fetchPage(1);
  const totalPages = first.meta.totalPages || 1;
  const capped = Math.min(totalPages, maxPages);
  if (totalPages > maxPages) {
    console.warn(
      `[sitemap] cắt bớt: ${totalPages} trang → chỉ lấy ${maxPages} (thiếu ${totalPages - maxPages} trang, ~${(totalPages - maxPages) * PAGE_SIZE} mục)`
    );
  }

  const items = [...first.data];
  const BATCH = 8; // số request đồng thời tối đa, tránh quá tải API
  for (let start = 2; start <= capped; start += BATCH) {
    const pages: number[] = [];
    for (let p = start; p < start + BATCH && p <= capped; p++) pages.push(p);
    const results = await Promise.all(
      pages.map((p) =>
        fetchPage(p)
          .then((r) => r.data)
          .catch(() => [] as T[])
      )
    );
    for (const r of results) items.push(...r);
  }
  return items;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSiteSettings();
  // Khớp host đang phục vụ (apex/www) để tránh lỗi GSC "URL không được phép".
  const base = requestBaseUrl(settings.seo.canonical_base || SITE.url);
  const now = new Date();

  // Gom TẤT CẢ tin/xe/blog qua phân trang (không chỉ 30 mục đầu như trước).
  // Trần: 200 trang (~6000 mục) mỗi loại — dư sức cho hiện tại, chống runaway.
  const [listings, vehicles, blogs] = await Promise.all([
    fetchAllPages((page) => listListings({ page, pageSize: PAGE_SIZE }), 200),
    fetchAllPages((page) => listVehicles({ page, pageSize: PAGE_SIZE }), 200),
    fetchAllPages((page) => listBlogs({ page, pageSize: PAGE_SIZE }), 100),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/tin-dang`, lastModified: now, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${base}/xe`, lastModified: now, changeFrequency: 'hourly', priority: 0.9 },
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

  const listingRoutes: MetadataRoute.Sitemap = listings.map((l) => ({
    url: `${base}/tin-dang/${l.slug}`,
    lastModified: l.updatedAt ? new Date(l.updatedAt) : now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const vehicleRoutes: MetadataRoute.Sitemap = vehicles.map((v) => ({
    url: `${base}/xe/${v.slug}`,
    lastModified: v.updatedAt ? new Date(v.updatedAt) : now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogs.map((b) => ({
    url: `${base}/blog/${b.slug}`,
    lastModified: b.updatedAt ? new Date(b.updatedAt) : now,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...cityLandingRoutes,
    ...listingRoutes,
    ...vehicleRoutes,
    ...blogRoutes,
  ];
}
