/**
 * Adapter mapping between MediaBDS (Laravel) shapes and our local UI types.
 * UI components depend on the local `Listing` shape, so this adapter shields
 * them from the actual API response differences.
 */
import type {
  Listing,
  ListingImage,
  TransactionType,
  PropertyType,
  Direction,
  PaginatedResponse,
} from '@/types';
import { cities } from '@/mocks/data/cities';
import { buildListingSlug } from '@/lib/utils/slugify';

// ── Laravel API types (subset we care about) ──
// NOTE: production API returns several numeric fields as STRINGS (e.g. price="1000000000.00").
// We accept both number and string and coerce via toNum().
export interface LaravelListing {
  id: number;
  code: string;
  title: string;
  type: string;
  property_type: string | null;
  price: number | string;
  price_unit: string | number;
  area: number | string;
  address: string | null;
  ward_name: string | null;
  district_name: string | null;
  province_name: string | null;
  floors: number | string | null;
  bedrooms: number | string | null;
  toilets: number | string | null;
  direction: string | null;
  front_width: number | string | null;
  road_width: number | string | null;
  avatar: string | null;
  images: string[];
  is_sold: boolean;
  created_at: string;
  updated_at: string;
  can_view_phone: boolean;
  contact_phone: string | null;
  contact_phones: string[];
  description?: string | null;
}

function toNum(v: number | string | null | undefined): number {
  if (v === null || v === undefined) return 0;
  if (typeof v === 'number') return v;
  const n = Number.parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

function toOptInt(v: number | string | null | undefined): number | undefined {
  if (v === null || v === undefined || v === '') return undefined;
  const n = typeof v === 'number' ? v : Number.parseInt(v, 10);
  if (!Number.isFinite(n) || n <= 0) return undefined;
  return n;
}

export interface LaravelPaginated<T> {
  data: T[];
  links?: { first: string; last: string; prev: string | null; next: string | null };
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

// ── Transaction type mapping ──
const TX_MAP_TO_LOCAL: Record<string, TransactionType> = {
  'Cần bán': 'sale',
  'Cho thuê': 'rent',
  'Cần mua': 'sale',
};
const TX_MAP_TO_API: Record<TransactionType, string> = {
  sale: 'Cần bán',
  rent: 'Cho thuê',
};

// ── Property type mapping ──
// Laravel codes: 102 Biệt thự · 103 Căn hộ–chung cư · 104 Đất · 105 Đất nền dự án ·
// 106 Mặt tiền · 107 Nhà mặt phố · 108 Nhà riêng · 109 Trang trại · 110 BĐS khác ·
// 111 Nhà mặt phố LG 4M-5M · 112 Khách sạn · 113 Nhà nghỉ · 114 Homestay · 115 Nhà trọ
const PROPERTY_LABEL_TO_LOCAL: Record<string, PropertyType> = {
  'Căn hộ chung cư': 'apartment',
  'Căn hộ-chung cư': 'apartment',
  'Chung cư': 'apartment',
  'Nhà trọ': 'room',
  'Nhà riêng': 'house',
  'Biệt thự': 'house',
  'Nhà mặt phố': 'house',
  'Mặt tiền': 'office',
  'Khách sạn': 'office',
  'Homestay': 'house',
  'Đất': 'land',
  'Đất nền dự án': 'land',
  'Trang trại': 'land',
  'BĐS khác': 'house',
};
const PROPERTY_LOCAL_TO_CODE: Record<PropertyType, number> = {
  apartment: 103,
  room: 115,
  house: 108,
  office: 107,
  land: 104,
  shared: 115,
};

// ── Direction mapping ──
const DIRECTION_TO_LOCAL: Record<string, Direction> = {
  Đông: 'east',
  Tây: 'west',
  Nam: 'south',
  Bắc: 'north',
  'Đông Bắc': 'ne',
  'Tây Bắc': 'nw',
  'Đông Nam': 'se',
  'Tây Nam': 'sw',
};
const DIRECTION_TO_API: Record<Direction, string> = {
  east: 'Đông',
  west: 'Tây',
  south: 'Nam',
  north: 'Bắc',
  ne: 'Đông Bắc',
  nw: 'Tây Bắc',
  se: 'Đông Nam',
  sw: 'Tây Nam',
};

// ── Price normalization ──
// Production API returns `price` as raw VND (string), `price_unit` as numeric code.
// Docs originally listed enum text. Handle both gracefully.
function priceToVND(
  rawPrice: number | string,
  rawUnit: string | number
): { price: number; priceUnit: 'month' | 'total' } {
  const p = toNum(rawPrice);
  const u = typeof rawUnit === 'string' ? rawUnit.trim() : String(rawUnit);

  // If price already large (≥ 1 triệu) → treat as raw VND
  if (p >= 1_000_000) {
    const isMonthly = u === 'VNĐ/tháng' || u === '3' || u === 'month';
    return { price: p, priceUnit: isMonthly ? 'month' : 'total' };
  }

  // Otherwise interpret unit as multiplier
  switch (u) {
    case 'Tỷ':
    case '1':
      return { price: p * 1_000_000_000, priceUnit: 'total' };
    case 'Triệu':
    case '2':
      return { price: p * 1_000_000, priceUnit: 'total' };
    case 'VNĐ/tháng':
    case '3':
      return { price: p, priceUnit: 'month' };
    default:
      return { price: p, priceUnit: 'total' };
  }
}

// Province name → cityCode lookup (loose match)
function findCityCode(provinceName: string | null | undefined): string {
  if (!provinceName) return '';
  const n = provinceName.toLowerCase();
  const found = cities.find((c) => c.name.toLowerCase().includes(n) || n.includes(c.name.toLowerCase().replace(/^tp\.\s*/, '')));
  return found?.code ?? '';
}

function findDistrictCode(cityCode: string, districtName: string | null | undefined): string {
  if (!districtName || !cityCode) return '';
  const city = cities.find((c) => c.code === cityCode);
  if (!city) return '';
  const n = districtName.toLowerCase();
  const found = city.districts.find((d) => d.name.toLowerCase().includes(n) || n.includes(d.name.toLowerCase()));
  return found?.code ?? '';
}

// ── Image mapping ──
function mapImages(urls: string[], avatar: string | null): ListingImage[] {
  const list: ListingImage[] = [];
  if (avatar) list.push({ id: 'avatar', url: avatar, isPrimary: true });
  urls.forEach((url, i) => {
    list.push({ id: `img-${i}`, url, isPrimary: !avatar && i === 0 });
  });
  return list;
}

// ── Main adapter ──
export function mapApiListing(api: LaravelListing): Listing {
  const id = String(api.id);
  const slug = buildListingSlug(api.title || `tin-${api.code}`, id);
  const transactionType: TransactionType = TX_MAP_TO_LOCAL[api.type] ?? 'sale';
  const propertyType: PropertyType =
    (api.property_type ? PROPERTY_LABEL_TO_LOCAL[api.property_type] : undefined) ?? 'house';
  const { price, priceUnit } = priceToVND(api.price, api.price_unit);
  const cityCode = findCityCode(api.province_name);
  const districtCode = findDistrictCode(cityCode, api.district_name);
  const direction =
    api.direction && DIRECTION_TO_LOCAL[api.direction]
      ? DIRECTION_TO_LOCAL[api.direction]
      : undefined;
  const images = mapImages(api.images ?? [], api.avatar);

  return {
    id,
    slug,
    title: api.title || '(Không có tiêu đề)',
    description: api.description ?? '',
    price,
    priceUnit,
    area: toNum(api.area),
    bedrooms: toOptInt(api.bedrooms),
    bathrooms: toOptInt(api.toilets),
    direction,
    furnish: undefined,
    transactionType,
    propertyType,
    categoryId: '',
    cityCode,
    districtCode,
    wardName: api.ward_name ?? undefined,
    addressLine: api.address ?? '',
    lat: undefined,
    lng: undefined,
    images,
    videoUrl: undefined,
    amenities: [],
    tags: [],
    vipTier: 'normal',
    status: api.is_sold ? 'sold' : 'active',
    contact: {
      name: '',
      phone: api.contact_phone ?? '',
      zalo: undefined,
      messengerId: undefined,
      avatarUrl: undefined,
    },
    ownerId: api.code,
    viewCount: 0,
    createdAt: api.created_at,
    updatedAt: api.updated_at,
    expiresAt: api.updated_at,
  };
}

export function mapPaginated<T extends LaravelListing>(
  api: LaravelPaginated<T>
): PaginatedResponse<Listing> {
  return {
    data: api.data.map(mapApiListing),
    meta: {
      page: api.meta.current_page,
      pageSize: api.meta.per_page,
      total: api.meta.total,
      totalPages: api.meta.last_page,
    },
  };
}

// ── Filter mapping ──
export interface LaravelListingQuery {
  per_page?: number;
  page?: number;
  type?: string;
  property_type?: number;
  province?: string;
  district?: string;
  ward?: string;
  bedrooms?: number;
  direction?: string;
  min_area?: number;
  max_area?: number;
  min_price?: number;
  max_price?: number;
  sort_by?: 'created_at' | 'price' | 'area';
  sort_order?: 'asc' | 'desc';
}

import type { ListingFilter } from '@/types';

export function mapFilterToApi(f: ListingFilter): LaravelListingQuery {
  const out: LaravelListingQuery = {};
  if (f.pageSize) out.per_page = Math.min(f.pageSize, 30);
  if (f.page) out.page = f.page;
  if (f.transactionType) out.type = TX_MAP_TO_API[f.transactionType];
  if (f.propertyType) out.property_type = PROPERTY_LOCAL_TO_CODE[f.propertyType];
  if (f.cityCode) {
    const city = cities.find((c) => c.code === f.cityCode);
    if (city) out.province = city.name;
  }
  if (f.districtCode && f.cityCode) {
    const city = cities.find((c) => c.code === f.cityCode);
    const d = city?.districts.find((x) => x.code === f.districtCode);
    if (d) out.district = d.name;
  }
  if (f.bedrooms !== undefined) out.bedrooms = f.bedrooms;
  if (f.direction) out.direction = DIRECTION_TO_API[f.direction];
  if (f.areaMin !== undefined) out.min_area = f.areaMin;
  if (f.areaMax !== undefined) out.max_area = f.areaMax;
  // API min/max price is in TỶ (billions)
  if (f.priceMin !== undefined) out.min_price = f.priceMin / 1_000_000_000;
  if (f.priceMax !== undefined) out.max_price = f.priceMax / 1_000_000_000;
  if (f.sort) {
    switch (f.sort) {
      case 'priceAsc':
        out.sort_by = 'price';
        out.sort_order = 'asc';
        break;
      case 'priceDesc':
        out.sort_by = 'price';
        out.sort_order = 'desc';
        break;
      case 'areaAsc':
        out.sort_by = 'area';
        out.sort_order = 'asc';
        break;
      case 'areaDesc':
        out.sort_by = 'area';
        out.sort_order = 'desc';
        break;
      case 'newest':
      default:
        out.sort_by = 'created_at';
        out.sort_order = 'desc';
        break;
    }
  }
  return out;
}
