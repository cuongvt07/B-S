import { apiFetch } from './client';
import type { ApiResponse, Listing, ListingFilter, PaginatedResponse } from '@/types';

function filterToQuery(f: ListingFilter): Record<string, string | number | boolean | undefined> {
  return {
    q: f.q,
    categoryId: f.categoryId,
    transactionType: f.transactionType,
    propertyType: f.propertyType,
    cityCode: f.cityCode,
    districtCode: f.districtCode,
    priceMin: f.priceMin,
    priceMax: f.priceMax,
    areaMin: f.areaMin,
    areaMax: f.areaMax,
    bedrooms: f.bedrooms,
    direction: f.direction,
    furnish: f.furnish,
    vipOnly: f.vipOnly || undefined,
    sort: f.sort,
    page: f.page,
    pageSize: f.pageSize,
  };
}

export const listingApi = {
  list(filter: ListingFilter = {}): Promise<PaginatedResponse<Listing>> {
    return apiFetch<PaginatedResponse<Listing>>('/listings', { query: filterToQuery(filter) });
  },

  get(id: string): Promise<ApiResponse<Listing>> {
    return apiFetch<ApiResponse<Listing>>(`/listings/${id}`);
  },
};
