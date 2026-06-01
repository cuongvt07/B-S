/**
 * Listings API — proxies the real Laravel endpoints at https://vmphuthinhland.com/api/v1
 * and adapts the response into our local `Listing` shape so all existing UI keeps working.
 */
import { realFetch } from './realClient';
import {
  mapApiListing,
  mapFilterToApi,
  mapPaginated,
  type LaravelListing,
  type LaravelPaginated,
} from './laravelAdapter';
import type { ApiResponse, Listing, ListingFilter, PaginatedResponse } from '@/types';

export const listingApi = {
  async list(filter: ListingFilter = {}): Promise<PaginatedResponse<Listing>> {
    const query = mapFilterToApi(filter) as unknown as Record<
      string,
      string | number | boolean | undefined | null
    >;
    const res = await realFetch<LaravelPaginated<LaravelListing>>('/listings', { query });
    return mapPaginated(res);
  },

  async get(idOrCode: string): Promise<ApiResponse<Listing>> {
    const res = await realFetch<{ data: LaravelListing }>(`/listings/${idOrCode}`);
    return { data: mapApiListing(res.data) };
  },
};
