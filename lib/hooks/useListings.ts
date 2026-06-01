'use client';

import { useQuery } from '@tanstack/react-query';
import { listingApi } from '@/lib/api';
import type { ListingFilter } from '@/types';

export function useListings(filter: ListingFilter) {
  return useQuery({
    queryKey: ['listings', filter],
    queryFn: () => listingApi.list(filter),
    placeholderData: (prev) => prev,
  });
}

export function useListing(id: string | undefined) {
  return useQuery({
    queryKey: ['listings', 'detail', id],
    queryFn: () => listingApi.get(id!),
    enabled: Boolean(id),
  });
}
