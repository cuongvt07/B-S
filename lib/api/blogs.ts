import { realFetch } from './realClient';
import type { ApiResponse, Blog, PaginatedResponse } from '@/types';

export const blogApi = {
  list(params: { tag?: string; page?: number; pageSize?: number } = {}): Promise<
    PaginatedResponse<Blog>
  > {
    return realFetch<PaginatedResponse<Blog>>('/blogs', { query: params });
  },

  get(slug: string): Promise<ApiResponse<Blog>> {
    return realFetch<ApiResponse<Blog>>(`/blogs/${slug}`);
  },
};
