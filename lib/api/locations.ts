import { realFetch } from './realClient';
import type { ApiResponse, City } from '@/types';

export const locationApi = {
  cities(): Promise<ApiResponse<City[]>> {
    return realFetch<ApiResponse<City[]>>('/locations');
  },
};
