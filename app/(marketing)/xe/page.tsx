import type { Metadata } from 'next';
import { Suspense } from 'react';
import { VehicleCard, VehicleFilterPanel } from '@/components/vehicle';
import { BlogPagination } from '@/components/blog';
import { listVehicles, type VehicleQuery } from '@/lib/server-data';
import { VEHICLE_PRICE_BRACKETS } from '@/lib/constants';

const PAGE_SIZE = 12;

interface PageProps {
  searchParams: {
    loai?: string;
    hang?: string;
    hopso?: string;
    nl?: string;
    gia?: string;
    q?: string;
    sort?: string;
    page?: string;
  };
}

function parsePage(raw?: string): number {
  const n = Number.parseInt(raw ?? '1', 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function parseKind(raw?: string): 'car' | 'motorbike' | undefined {
  return raw === 'car' || raw === 'motorbike' ? raw : undefined;
}

function sortToApi(sort?: string): Pick<VehicleQuery, 'sortBy' | 'sortOrder'> {
  switch (sort) {
    case 'priceAsc':
      return { sortBy: 'price', sortOrder: 'asc' };
    case 'priceDesc':
      return { sortBy: 'price', sortOrder: 'desc' };
    case 'yearDesc':
      return { sortBy: 'year', sortOrder: 'desc' };
    case 'kmAsc':
      return { sortBy: 'mileage', sortOrder: 'asc' };
    default:
      return { sortBy: 'created_at', sortOrder: 'desc' };
  }
}

export function generateMetadata({ searchParams }: PageProps): Metadata {
  const kind = parseKind(searchParams.loai);
  const page = parsePage(searchParams.page);
  const title = kind === 'car' ? 'Mua bán ô tô' : kind === 'motorbike' ? 'Mua bán xe máy' : 'Mua bán xe cộ';
  // Canonical giữ 'loai' + 'page' (chiều có ý nghĩa), bỏ tham số lọc/sắp xếp
  // nhiễu → gom các biến thể, tránh "trùng lặp chưa chọn canonical".
  const cp = new URLSearchParams();
  if (kind) cp.set('loai', kind);
  if (page > 1) cp.set('page', String(page));
  const cqs = cp.toString();
  return {
    title: page > 1 ? `${title} — Trang ${page}` : title,
    description: 'Tin đăng mua bán ô tô, xe máy cũ và mới — cập nhật liên tục.',
    alternates: { canonical: cqs ? `/xe?${cqs}` : '/xe' },
  };
}

// Dynamic (SSR) vì đọc searchParams; dữ liệu fetch vẫn cache 5 phút.
export default async function VehicleListPage({ searchParams }: PageProps) {
  const page = parsePage(searchParams.page);
  const kind = parseKind(searchParams.loai);
  const bracket =
    searchParams.gia !== undefined ? VEHICLE_PRICE_BRACKETS[Number(searchParams.gia)] : undefined;

  const result = await listVehicles({
    vehicleType: kind,
    brand: searchParams.hang || undefined,
    transmission: searchParams.hopso || undefined,
    fuelType: searchParams.nl || undefined,
    minPrice: bracket?.min,
    maxPrice: bracket?.max,
    page,
    pageSize: PAGE_SIZE,
    ...sortToApi(searchParams.sort),
  });

  const { total, totalPages } = result.meta;

  const hrefFor = (p: number) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams)) {
      if (v && k !== 'page') params.set(k, String(v));
    }
    if (p > 1) params.set('page', String(p));
    const qs = params.toString();
    return qs ? `/xe?${qs}` : '/xe';
  };

  return (
    <div className="container-app py-8">
      <header className="mb-5">
        <h1 className="text-2xl font-semibold text-ink sm:text-4xl">Mua bán xe cộ</h1>
        <p className="mt-2 text-sm text-ink-muted">
          {total} tin đăng
          {totalPages > 1 ? ` · Trang ${page}/${totalPages}` : ' · Ô tô & Xe máy'}
        </p>
      </header>

      <Suspense fallback={<div className="mb-5 h-9" />}>
        <VehicleFilterPanel />
      </Suspense>

      {result.data.length === 0 ? (
        <p className="rounded-md border border-brdr bg-surface-subtle p-8 text-center text-ink-muted">
          Không tìm thấy tin xe phù hợp.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.data.map((v, i) => (
              <VehicleCard key={v.id} vehicle={v} priority={i < 3} />
            ))}
          </div>
          <BlogPagination page={page} totalPages={totalPages} hrefFor={hrefFor} />
        </>
      )}
    </div>
  );
}
