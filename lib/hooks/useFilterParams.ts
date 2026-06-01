'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import type { ListingFilter } from '@/types';

function readFilter(sp: URLSearchParams): ListingFilter {
  const num = (k: string) => {
    const v = sp.get(k);
    return v ? Number(v) : undefined;
  };
  const str = <T extends string>(k: string): T | undefined => (sp.get(k) ?? undefined) as T | undefined;
  return {
    q: str('q'),
    categoryId: str('categoryId'),
    transactionType: str('transactionType') as ListingFilter['transactionType'],
    propertyType: str('propertyType') as ListingFilter['propertyType'],
    cityCode: str('cityCode'),
    districtCode: str('districtCode'),
    priceMin: num('priceMin'),
    priceMax: num('priceMax'),
    areaMin: num('areaMin'),
    areaMax: num('areaMax'),
    bedrooms: num('bedrooms'),
    direction: str('direction') as ListingFilter['direction'],
    furnish: str('furnish') as ListingFilter['furnish'],
    vipOnly: sp.get('vipOnly') === 'true',
    sort: (str('sort') as ListingFilter['sort']) ?? 'newest',
    page: num('page') ?? 1,
    pageSize: num('pageSize') ?? 12,
  };
}

export function useFilterParams() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const filter = readFilter(new URLSearchParams(sp.toString()));

  const setFilter = useCallback(
    (next: Partial<ListingFilter>) => {
      const params = new URLSearchParams(sp.toString());
      for (const [k, v] of Object.entries(next)) {
        if (v === undefined || v === null || v === '' || v === false) {
          params.delete(k);
        } else {
          params.set(k, String(v));
        }
      }
      // Reset page when filter changes (unless explicitly setting page)
      if (!('page' in next)) params.delete('page');
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, sp]
  );

  const reset = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  return { filter, setFilter, reset };
}
