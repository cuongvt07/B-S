import { apiFetch } from './client';

export interface SuggestLocation {
  type: 'city' | 'district';
  cityCode: string;
  districtCode?: string;
  label: string;
}

export interface SuggestListing {
  id: string;
  slug: string;
  title: string;
  price: number;
  priceUnit: 'month' | 'total';
  cover?: string;
  cityCode: string;
}

export interface SuggestResponse {
  data: {
    locations: SuggestLocation[];
    listings: SuggestListing[];
  };
}

export const searchApi = {
  suggest(q: string): Promise<SuggestResponse> {
    return apiFetch<SuggestResponse>('/search/suggest', { query: { q } });
  },
};
