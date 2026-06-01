import { NextResponse, type NextRequest } from 'next/server';
import type { ApiResponse, Listing } from '@/types';
import { listingsStore } from '@/mocks/store';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const listing = listingsStore.get(params.id);
  if (!listing) {
    return NextResponse.json({ message: 'Không tìm thấy tin đăng' }, { status: 404 });
  }
  listingsStore.upsert({ ...listing, viewCount: listing.viewCount + 1 });
  const res: ApiResponse<Listing> = { data: listing };
  return NextResponse.json(res);
}
