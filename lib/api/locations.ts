import { apiFetch } from './client';
import type { ApiResponse, City } from '@/types';

export const locationApi = {
  cities(): Promise<ApiResponse<City[]>> {
    return apiFetch<ApiResponse<City[]>>('/locations');
  },
};
