import { apiFetch } from './client';
import { realFetch } from './realClient';
import {
  mapApiListing,
  type LaravelListing,
  type LaravelPaginated,
} from './laravelAdapter';
import type { ApiResponse, City } from '@/types';

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
  async suggest(q: string): Promise<SuggestResponse> {
    const term = q.trim();
    if (term.length < 2) {
      return { data: { locations: [], listings: [] } };
    }

    try {
      const [listingRes, locationRes] = await Promise.all([
        realFetch<LaravelPaginated<LaravelListing>>('/listings', {
          query: { q: term, per_page: 5 },
        }),
        realFetch<ApiResponse<City[]>>('/locations'),
      ]);

      const normalized = normalize(term);
      const locations = locationRes.data.flatMap((city) => {
        const out: SuggestLocation[] = [];
        if (normalize(city.name).includes(normalized)) {
          out.push({ type: 'city', cityCode: city.code, label: city.name });
        }
        city.districts.forEach((district) => {
          if (normalize(district.name).includes(normalized)) {
            out.push({
              type: 'district',
              cityCode: city.code,
              districtCode: district.code,
              label: `${district.name}, ${city.name}`,
            });
          }
        });
        return out;
      }).slice(0, 6);

      return {
        data: {
          locations,
          listings: listingRes.data.slice(0, 5).map((item) => {
            const listing = mapApiListing(item);
            return {
              id: listing.id,
              slug: listing.slug,
              title: listing.title,
              price: listing.price,
              priceUnit: listing.priceUnit,
              cover: listing.images[0]?.url,
              cityCode: listing.cityCode,
            };
          }),
        },
      };
    } catch {
      return apiFetch<SuggestResponse>('/search/suggest', { query: { q: term } });
    }
  },
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}
