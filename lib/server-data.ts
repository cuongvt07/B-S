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
  return process.env.NEXT_PUBLIC_REAL_API_URL || 'https://vmphuthinhland.com';
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
