/**
 * Server-side data access for Server Components.
 *
 * MOCK mode: reads directly from mocks/store to avoid HTTP round-trip during SSR.
 * SWAP-TO-LARAVEL: replace each function body with `apiFetch` calls using an
 * absolute base URL (e.g. process.env.LARAVEL_API_URL), or use a server-side
 * fetch wrapper. Function signatures are stable.
 */
import 'server-only';
import type { Listing, ListingFilter, Blog, PaginatedResponse, ApiResponse } from '@/types';
import { listingsStore } from '@/mocks/store';
import { blogs as blogsData, blogBySlug } from '@/mocks/data/blogs';
import { applyFilter, applySort } from '@/mocks/handlers/filter';
import { paginate } from '@/mocks/handlers/paginate';

export async function listListings(filter: ListingFilter = {}): Promise<PaginatedResponse<Listing>> {
  const all = listingsStore.all();
  const filtered = applyFilter(all, filter);
  const sorted = applySort(filtered, filter.sort);
  return paginate(sorted, filter.page, filter.pageSize);
}

export async function getListing(id: string): Promise<ApiResponse<Listing> | null> {
  const listing = listingsStore.get(id);
  if (!listing) return null;
  return { data: listing };
}

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
