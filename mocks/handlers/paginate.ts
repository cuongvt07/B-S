import type { PaginatedResponse } from '@/types';

export function paginate<T>(items: T[], page = 1, pageSize = 12): PaginatedResponse<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const data = items.slice(start, start + pageSize);
  return { data, meta: { page: safePage, pageSize, total, totalPages } };
}
