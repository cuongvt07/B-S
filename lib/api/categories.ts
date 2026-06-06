import { realFetch } from './realClient';
import type { ApiResponse, Category } from '@/types';

export const categoryApi = {
  list(): Promise<ApiResponse<Category[]>> {
    return realFetch<ApiResponse<Category[]>>('/categories');
  },
};
