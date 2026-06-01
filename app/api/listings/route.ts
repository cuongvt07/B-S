import { NextResponse, type NextRequest } from 'next/server';
import type { PaginatedResponse, Listing } from '@/types';
import { listingsStore } from '@/mocks/store';
import { applyFilter, applySort, parseFilterFromSearchParams } from '@/mocks/handlers/filter';
import { paginate } from '@/mocks/handlers/paginate';

export async function GET(req: NextRequest) {
  const filter = parseFilterFromSearchParams(req.nextUrl.searchParams);
  const all = listingsStore.all();
  const filtered = applyFilter(all, filter);
  const sorted = applySort(filtered, filter.sort);
  const result: PaginatedResponse<Listing> = paginate(sorted, filter.page, filter.pageSize);
  return NextResponse.json(result);
}
