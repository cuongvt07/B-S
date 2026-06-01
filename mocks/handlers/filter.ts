import type { Listing, ListingFilter, SortBy } from '@/types';

export function applyFilter(items: Listing[], f: ListingFilter): Listing[] {
  return items.filter((l) => {
    if (f.q) {
      const q = f.q.toLowerCase();
      const hay = `${l.title} ${l.description} ${l.addressLine}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (f.categoryId && l.categoryId !== f.categoryId) return false;
    if (f.transactionType && l.transactionType !== f.transactionType) return false;
    if (f.propertyType && l.propertyType !== f.propertyType) return false;
    if (f.cityCode && l.cityCode !== f.cityCode) return false;
    if (f.districtCode && l.districtCode !== f.districtCode) return false;
    if (f.priceMin !== undefined && l.price < f.priceMin) return false;
    if (f.priceMax !== undefined && l.price > f.priceMax) return false;
    if (f.areaMin !== undefined && l.area < f.areaMin) return false;
    if (f.areaMax !== undefined && l.area > f.areaMax) return false;
    if (f.bedrooms !== undefined && (l.bedrooms ?? 0) < f.bedrooms) return false;
    if (f.direction && l.direction !== f.direction) return false;
    if (f.furnish && l.furnish !== f.furnish) return false;
    if (f.vipOnly && l.vipTier === 'normal') return false;
    return true;
  });
}

const vipRank: Record<string, number> = { vip3: 3, vip2: 2, vip1: 1, normal: 0 };

export function applySort(items: Listing[], sort?: SortBy): Listing[] {
  const sorted = [...items];
  switch (sort) {
    case 'priceAsc':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'priceDesc':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'areaAsc':
      sorted.sort((a, b) => a.area - b.area);
      break;
    case 'areaDesc':
      sorted.sort((a, b) => b.area - a.area);
      break;
    case 'newest':
    default:
      sorted.sort((a, b) => {
        const vipDiff = (vipRank[b.vipTier] ?? 0) - (vipRank[a.vipTier] ?? 0);
        if (vipDiff !== 0) return vipDiff;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      break;
  }
  return sorted;
}

export function parseFilterFromSearchParams(sp: URLSearchParams): ListingFilter {
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
    sort: (str('sort') as SortBy) ?? 'newest',
    page: num('page') ?? 1,
    pageSize: num('pageSize') ?? 12,
  };
}
