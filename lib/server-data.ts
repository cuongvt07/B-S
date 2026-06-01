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

const REAL_HOST = process.env.NEXT_PUBLIC_REAL_API_URL ?? 'https://vmphuthinhland.com';

async function realServerFetch<T>(path: string, query?: Record<string, unknown>): Promise<T> {
  const url = new URL(`${REAL_HOST}/api/v1${path.startsWith('/') ? path : `/${path}`}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null || v === '') continue;
      url.searchParams.append(k, String(v));
    }
  }
  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
    // No ISR cache on listings for now — always reflect real-time API.
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`API ${path} ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
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
  const blog = blogBySlug.get(slug);
  if (!blog) return null;
  return { data: blog };
}
