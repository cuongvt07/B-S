import { apiFetch } from './client';
import type { ApiResponse, Blog, PaginatedResponse } from '@/types';

export const blogApi = {
  list(params: { tag?: string; page?: number; pageSize?: number } = {}): Promise<
    PaginatedResponse<Blog>
  > {
    return apiFetch<PaginatedResponse<Blog>>('/blogs', { query: params });
  },

  get(slug: string): Promise<ApiResponse<Blog>> {
    return apiFetch<ApiResponse<Blog>>(`/blogs/${slug}`);
  },
};
