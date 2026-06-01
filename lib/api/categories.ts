import { apiFetch } from './client';
import type { ApiResponse, Category } from '@/types';

export const categoryApi = {
  list(): Promise<ApiResponse<Category[]>> {
    return apiFetch<ApiResponse<Category[]>>('/categories');
  },
};
