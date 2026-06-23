/**
 * Server-side data access for Server Components.
 *
 * Listings + detail → fetched from the real Laravel API (public endpoints).
 * Blogs → still mock (Laravel doesn't expose blogs yet).
 */
import 'server-only';
import type { Listing, ListingFilter, Blog, PaginatedResponse, ApiResponse } from '@/types';
import { blogs as blogsData, blogBySlug } from '@/mocks/data/blogs';
import { paginate } from '@/mocks/handlers/paginate';
import {
  mapApiListing,
  mapFilterToApi,
  mapPaginated,
  type LaravelListing,
  type LaravelPaginated,
} from './api/laravelAdapter';

/**
 * Resolves the host used for server-side Laravel fetches.
 * `||` (not `??`) — empty-string env vars must also fall back to the default.
 */
function getRealHost(): string {
  const configured = process.env.NEXT_PUBLIC_REAL_API_URL || '';
  try {
    const host = new URL(configured).host;
    if (host.endsWith('vercel.app')) {
      return 'https://vmphuthinhland.com';
    }
  } catch {
    // Invalid or empty env var falls back to production API below.
  }
  return configured || 'https://vmphuthinhland.com';
}

const FETCH_TIMEOUT_MS = 10_000;
const FETCH_UA =
  'Mozilla/5.0 (compatible; BDSBot/1.0; +https://b-s-pink.vercel.app)';

async function fetchWithTimeout(url: string, init: RequestInit, timeout = FETCH_TIMEOUT_MS): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function realServerFetch<T>(path: string, query?: Record<string, unknown>): Promise<T> {
  const host = getRealHost();
  const url = new URL(`${host}/api/v1${path.startsWith('/') ? path : `/${path}`}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null || v === '') continue;
      url.searchParams.append(k, String(v));
    }
  }

  const init: RequestInit = {
    headers: {
      Accept: 'application/json',
      'User-Agent': FETCH_UA,
    },
    // Match the homepage `revalidate = 300`. Any single `cache: 'no-store'` on a
    // server-side fetch forces the entire page into dynamic mode — by using ISR
    // here we let `/` stay statically generated and revalidate at most every 5min.
    next: { revalidate: 300 },
  };

  // Try twice — first attempt often fails on cold Vercel functions / DNS hiccups.
  let lastErr: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetchWithTimeout(url.toString(), init);
      if (!res.ok) {
        throw new Error(`API ${path} ${res.status} ${res.statusText}`);
      }
      return (await res.json()) as T;
    } catch (err) {
      lastErr = err;
      if (attempt === 0) {
        // brief backoff before retry
        await new Promise((r) => setTimeout(r, 300));
      }
    }
  }
  throw lastErr;
}

export type SiteSettings = {
  contact: {
    site_name: string;
    hotline: string;
    zalo_phone: string;
    email: string;
    support_hours: string;
  };
  branding: {
    logo: string;
    logo_dark: string;
    favicon: string;
    tagline: string;
  };
  seo: {
    default_title: string;
    title_template: string;
    default_description: string;
    keywords: string;
    og_image: string;
    robots_index: boolean;
    canonical_base: string;
    google_site_verification: string;
    facebook_app_id: string;
    twitter_handle: string;
    analytics_id: string;
  };
  packages: {
    free_daily_quota: number;
    tier_30_price: number;
    tier_30_quota: number;
    tier_50_price: number;
    tier_50_quota: number;
    online_payment_enabled: boolean;
  };
  upload: {
    max_size_mb: number;
    max_count: number;
    compress_quality: number;
    max_dimension: number;
  };
  watermark: { enabled: boolean };
};

const SITE_SETTINGS_FALLBACK: SiteSettings = {
  contact: {
    site_name: 'VM Phú Thịnh Land',
    hotline: '0922 255 544',
    zalo_phone: '0922 255 544',
    email: 'vmphuthinhland@gmail.com',
    support_hours: '8:00 - 21:00 (T2 - CN)',
  },
  branding: {
    logo: '',
    logo_dark: '',
    favicon: '',
    tagline: 'Nền tảng tin đăng bất động sản hàng đầu',
  },
  seo: {
    default_title: 'VM Phú Thịnh Land — Nền tảng tin đăng bất động sản',
    title_template: '%s | VM Phú Thịnh Land',
    default_description:
      'Tìm kiếm và đăng tin cho thuê, mua bán bất động sản: căn hộ, phòng trọ, nhà nguyên căn, đất nền, văn phòng trên toàn quốc.',
    keywords: 'bất động sản, nhà đất, cho thuê, mua bán, căn hộ, đất nền',
    og_image: '',
    robots_index: true,
    canonical_base: 'https://vmphuthinhland.com',
    google_site_verification: '',
    facebook_app_id: '',
    twitter_handle: '',
    analytics_id: '',
  },
  packages: {
    free_daily_quota: 20,
    tier_30_price: 399000,
    tier_30_quota: 30,
    tier_50_price: 599000,
    tier_50_quota: 50,
    online_payment_enabled: false,
  },
  upload: { max_size_mb: 5, max_count: 20, compress_quality: 80, max_dimension: 1920 },
  watermark: { enabled: true },
};

/**
 * Public site settings configured from the CMS (/website-admin → Cài đặt).
 * Falls back to baked-in defaults if the backend is unreachable, so pages
 * never break when the API is down.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const res = await realServerFetch<{ data: Partial<SiteSettings> }>('/settings');
    const d = res?.data ?? {};
    const f = SITE_SETTINGS_FALLBACK;
    return {
      contact: { ...f.contact, ...(d.contact ?? {}) },
      branding: { ...f.branding, ...(d.branding ?? {}) },
      seo: { ...f.seo, ...(d.seo ?? {}) },
      packages: { ...f.packages, ...(d.packages ?? {}) },
      upload: { ...f.upload, ...(d.upload ?? {}) },
      watermark: { ...f.watermark, ...(d.watermark ?? {}) },
    };
  } catch (err) {
    console.error('[server-data] getSiteSettings failed, using fallback:', err);
    return SITE_SETTINGS_FALLBACK;
  }
}

export async function listListings(
  filter: ListingFilter = {}
): Promise<PaginatedResponse<Listing>> {
  try {
    const query = mapFilterToApi(filter) as unknown as Record<string, unknown>;
    const res = await realServerFetch<LaravelPaginated<LaravelListing>>('/listings', query);
    const mapped = mapPaginated(res);
    if (process.env.NODE_ENV !== 'production') {
      console.log(
        `[server-data] listListings q=${JSON.stringify(query)} → total=${mapped.meta.total}, items=${mapped.data.length}`
      );
    }
    return mapped;
  } catch (err) {
    console.error('[server-data] listListings failed:', err);
    return {
      data: [],
      meta: { page: 1, pageSize: filter.pageSize ?? 12, total: 0, totalPages: 0 },
    };
  }
}

export async function getListing(idOrCode: string): Promise<ApiResponse<Listing> | null> {
  try {
    const res = await realServerFetch<{ data: LaravelListing }>(`/listings/${idOrCode}`);
    return { data: mapApiListing(res.data) };
  } catch (err) {
    console.error('[server-data] getListing failed:', err);
    return null;
  }
}

// ── Blogs (mock — Laravel chưa có) ──
export interface HomepageSection {
  key: string;
  title: string;
  description?: string | null;
  sectionType: 'listings' | 'regions' | 'tools' | 'recently_viewed' | 'blogs' | 'feature_descriptions' | 'promo';
  sourceType: string;
  href?: string | null;
  limit: number;
  sortOrderIndex: number;
  meta: { total: number };
  listings: Listing[];
}

interface ApiHomepageSection {
  key: string;
  title: string;
  description?: string | null;
  section_type: HomepageSection['sectionType'];
  source_type: string;
  href?: string | null;
  limit?: number;
  sort_order_index?: number;
  meta?: { total?: number };
  items?: LaravelListing[];
}

export async function getHomepageSections(): Promise<HomepageSection[]> {
  try {
    const res = await realServerFetch<{ data: ApiHomepageSection[] }>('/homepage');
    return (res.data ?? []).map((section) => ({
      key: section.key,
      title: section.title,
      description: section.description,
      sectionType: section.section_type,
      sourceType: section.source_type,
      href: section.href,
      limit: section.limit ?? 0,
      sortOrderIndex: section.sort_order_index ?? 0,
      meta: { total: section.meta?.total ?? 0 },
      listings: (section.items ?? []).map(mapApiListing),
    }));
  } catch (err) {
    console.error('[server-data] getHomepageSections failed:', err);
    return [];
  }
}

export async function listBlogs(
  params: { tag?: string; page?: number; pageSize?: number } = {}
): Promise<PaginatedResponse<Blog>> {
  try {
    return await realServerFetch<PaginatedResponse<Blog>>('/blogs', params);
  } catch (err) {
    console.error('[server-data] listBlogs failed:', err);
  }

  let filtered = [...blogsData];
  if (params.tag) {
    const tag = params.tag.toLowerCase();
    filtered = filtered.filter(
      (b) => b.categoryTag.toLowerCase() === tag || b.tags.includes(params.tag!)
    );
  }
  filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  return paginate(filtered, params.page ?? 1, params.pageSize ?? 10);
}

export async function getBlog(slug: string): Promise<ApiResponse<Blog> | null> {
  try {
    return await realServerFetch<ApiResponse<Blog>>(`/blogs/${slug}`);
  } catch (err) {
    console.error('[server-data] getBlog failed:', err);
  }

  const blog = blogBySlug.get(slug);
  if (!blog) return null;
  return { data: blog };
}
