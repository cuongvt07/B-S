'use client';

import Link from 'next/link';
import { Map } from '@/components/icons';
import { useListings } from '@/lib/hooks/useListings';
import { useFilterParams } from '@/lib/hooks/useFilterParams';
import { ListingGrid } from '@/components/listing';
import { Button } from '@/components/ui';
import { FilterPanel } from './FilterPanel';
import { FilterChips } from './FilterChips';
import { SortDropdown } from './SortDropdown';
import { Pagination } from './Pagination';
import { SaveSearchButton } from './SaveSearchButton';
import { PROPERTY_TYPE_LABELS } from '@/lib/constants';
import type { ListingFilter, SortBy } from '@/types';

function filterToParams(f: ListingFilter): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(f) as [keyof ListingFilter, unknown][]) {
    if (v === undefined || v === null || v === '' || v === false) continue;
    out[k as string] = String(v);
  }
  return out;
}

function buildSuggestedLabel(f: ListingFilter): string {
  const pt = f.propertyType ? PROPERTY_TYPE_LABELS[f.propertyType] : 'BĐS';
  const tx =
    f.transactionType === 'rent' ? 'cho thuê' : f.transactionType === 'sale' ? 'mua bán' : '';
  return `Tìm kiếm ${pt}${tx ? ' ' + tx : ''}`.replace(/\s+/g, ' ').trim();
}

interface SearchResultsProps {
  initialFilter?: Partial<ListingFilter>;
}

export function SearchResults({ initialFilter = {} }: SearchResultsProps) {
  const { filter: urlFilter, setFilter } = useFilterParams();
  const filter: ListingFilter = {
    ...urlFilter,
    transactionType: urlFilter.transactionType ?? initialFilter.transactionType,
    propertyType: urlFilter.propertyType ?? initialFilter.propertyType,
    cityCode: urlFilter.cityCode ?? initialFilter.cityCode,
    districtCode: urlFilter.districtCode ?? initialFilter.districtCode,
  };
  const { data, isLoading } = useListings(filter);
  const paramsAsStrings = filterToParams(filter);
  const suggestedLabel = buildSuggestedLabel(filter);

  return (
    <div className="container-app grid grid-cols-1 gap-6 py-6 lg:grid-cols-[280px_1fr]">
      <FilterPanel filter={filter} setFilter={setFilter} />

      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-ink-muted">
              {data?.meta.total ?? 0} tin đăng phù hợp
              {data?.meta.totalPages && data.meta.totalPages > 1
                ? ` · Trang ${data.meta.page}/${data.meta.totalPages}`
                : ''}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/tin-dang/map" className="unstyled">
              <Button variant="outline" size="sm" leftIcon={<Map size={14} />}>
                Xem bản đồ
              </Button>
            </Link>
            <SaveSearchButton params={paramsAsStrings} suggestedLabel={suggestedLabel} />
            <SortDropdown
              value={filter.sort}
              onChange={(s: SortBy) => setFilter({ sort: s })}
            />
          </div>
        </div>

        <FilterChips filter={filter} setFilter={setFilter} />

        <ListingGrid listings={data?.data} loading={isLoading} skeletonCount={6} />

        {data && data.meta.totalPages > 1 && (
          <div className="flex justify-center pt-4">
            <Pagination
              page={data.meta.page}
              totalPages={data.meta.totalPages}
              onChange={(p) => setFilter({ page: p })}
            />
          </div>
        )}
      </div>
    </div>
  );
}
