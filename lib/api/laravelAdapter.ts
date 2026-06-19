import type {
  Direction,
  Listing,
  ListingFilter,
  ListingImage,
  PaginatedResponse,
  PropertyType,
  TransactionType,
  VipTier,
} from '@/types';
import { cities } from '@/mocks/data/cities';
import { buildListingSlug } from '@/lib/utils/slugify';

export interface LaravelListing {
  id: number;
  code: string | null;
  slug?: string | null;
  title: string;
  description?: string | null;
  type: string;
  transaction_type?: TransactionType;
  property_type: string | null;
  property_type_code?: number | null;
  property_kind?: PropertyType | null;
  category_id?: string | null;
  price: number | string;
  price_unit: string | number;
  price_vnd?: number | string | null;
  price_unit_normalized?: 'month' | 'total' | null;
  area: number | string;
  address: string | null;
  ward_id?: string | null;
  ward_name: string | null;
  district_id?: string | null;
  district_name: string | null;
  province_id?: string | null;
  province_name: string | null;
  lat?: number | string | null;
  lng?: number | string | null;
  floors: number | string | null;
  bedrooms: number | string | null;
  toilets: number | string | null;
  direction: string | null;
  furnish?: string | null;
  front_width: number | string | null;
  road_width: number | string | null;
  avatar: string | null;
  images: string[];
  amenities?: string[] | null;
  tags?: string[] | null;
  video_url?: string | null;
  vip_tier?: VipTier | null;
  status?: 'active' | 'pending' | 'expired' | 'sold' | null;
  is_favorited?: boolean | null;
  is_sold: boolean;
  view_count?: number | string | null;
  created_at: string;
  updated_at: string;
  expires_at?: string | null;
  can_view_phone: boolean;
  contact_name?: string | null;
  contact_phone: string | null;
  contact_phones: string[];
  contact_avatar?: string | null;
  owner?: {
    id: number;
    name: string | null;
    phone: string | null;
    avatar: string | null;
  } | null;
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

const PROPERTY_LOCAL_TO_CODE: Record<PropertyType, number> = {
  apartment: 103,
  room: 115,
  house: 108,
  office: 107,
  land: 104,
  shared: 115,
};

const PROPERTY_CODE_TO_LOCAL: Record<number, PropertyType> = {
  102: 'house',
  103: 'apartment',
  104: 'land',
  105: 'land',
  106: 'office',
  107: 'office',
  108: 'house',
  109: 'land',
  111: 'office',
  112: 'office',
  113: 'office',
  114: 'house',
  115: 'room',
};

const TX_MAP_TO_API: Record<TransactionType, string> = {
  sale: 'Cần bán',
  rent: 'Cho thuê',
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

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}

function transactionType(api: LaravelListing): TransactionType {
  if (api.transaction_type === 'rent' || api.transaction_type === 'sale') return api.transaction_type;
  return normalizeText(api.type).includes('thue') ? 'rent' : 'sale';
}

function propertyType(api: LaravelListing): PropertyType {
  if (api.property_kind) return api.property_kind;
  if (api.property_type_code && PROPERTY_CODE_TO_LOCAL[api.property_type_code]) {
    return PROPERTY_CODE_TO_LOCAL[api.property_type_code];
  }
  const label = normalizeText(api.property_type ?? '');
  if (label.includes('can ho') || label.includes('chung cu')) return 'apartment';
  if (label.includes('tro')) return 'room';
  if (label.includes('dat') || label.includes('trang trai')) return 'land';
  if (label.includes('mat tien') || label.includes('van phong') || label.includes('khach san')) {
    return 'office';
  }
  return 'house';
}

function direction(apiDirection: string | null): Direction | undefined {
  if (!apiDirection) return undefined;
  const d = normalizeText(apiDirection);
  if (d.includes('dong') && d.includes('bac')) return 'ne';
  if (d.includes('dong') && d.includes('nam')) return 'se';
  if (d.includes('tay') && d.includes('bac')) return 'nw';
  if (d.includes('tay') && d.includes('nam')) return 'sw';
  if (d.includes('dong')) return 'east';
  if (d.includes('tay')) return 'west';
  if (d.includes('nam')) return 'south';
  if (d.includes('bac')) return 'north';
  return undefined;
}

function priceToVND(api: LaravelListing): { price: number; priceUnit: 'month' | 'total' } {
  if (api.price_vnd !== undefined && api.price_vnd !== null) {
    return {
      price: toNum(api.price_vnd),
      priceUnit: api.price_unit_normalized === 'month' ? 'month' : 'total',
    };
  }

  const p = toNum(api.price);
  const unit = String(api.price_unit).trim();
  if (p >= 1_000_000) {
    return { price: p, priceUnit: unit.includes('tháng') || unit === '3' ? 'month' : 'total' };
  }
  if (unit === 'Tỷ' || unit === 'Tỉ' || unit === '1') return { price: p * 1_000_000_000, priceUnit: 'total' };
  if (unit === 'Triệu' || unit === '2') return { price: p * 1_000_000, priceUnit: 'total' };
  return { price: p, priceUnit: unit.includes('tháng') || unit === '3' ? 'month' : 'total' };
}

function findCityCode(api: LaravelListing): string {
  if (api.province_id && cities.some((c) => c.code === api.province_id)) return api.province_id;
  if (!api.province_name) return '';
  const n = normalizeText(api.province_name);
  const found = cities.find((c) => {
    const city = normalizeText(c.name).replace(/^tp\.\s*/, '');
    return city.includes(n) || n.includes(city);
  });
  return found?.code ?? '';
}

function findDistrictCode(cityCode: string, api: LaravelListing): string {
  if (!cityCode) return '';
  const city = cities.find((c) => c.code === cityCode);
  if (!city) return '';
  if (api.district_id && city.districts.some((d) => d.code === api.district_id)) return api.district_id;
  if (!api.district_name) return '';
  const n = normalizeText(api.district_name);
  const found = city.districts.find((d) => {
    const district = normalizeText(d.name);
    return district.includes(n) || n.includes(district);
  });
  return found?.code ?? '';
}

function mapImages(urls: string[] = [], avatar: string | null): ListingImage[] {
  const seen = new Set<string>();
  const out: ListingImage[] = [];
  if (avatar) {
    seen.add(avatar);
    out.push({ id: 'avatar', url: avatar, isPrimary: true });
  }
  urls.forEach((url, i) => {
    if (!url || seen.has(url)) return;
    seen.add(url);
    out.push({ id: `img-${i}`, url, isPrimary: !avatar && out.length === 0 });
  });
  return out;
}

export function mapApiListing(api: LaravelListing): Listing {
  const id = String(api.id);
  const slug = api.slug || buildListingSlug(api.title || `tin-${api.code ?? id}`, id);
  const { price, priceUnit } = priceToVND(api);
  const cityCode = findCityCode(api);
  const districtCode = findDistrictCode(cityCode, api);
  const ownerId = api.owner?.id ? String(api.owner.id) : api.code ?? id;

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
    direction: direction(api.direction),
    furnish: api.furnish === 'none' || api.furnish === 'basic' || api.furnish === 'full' ? api.furnish : undefined,
    transactionType: transactionType(api),
    propertyType: propertyType(api),
    categoryId: api.category_id ?? '',
    cityCode,
    districtCode,
    wardName: api.ward_name ?? undefined,
    addressLine: api.address ?? '',
    lat: api.lat === null || api.lat === undefined ? undefined : toNum(api.lat),
    lng: api.lng === null || api.lng === undefined ? undefined : toNum(api.lng),
    images: mapImages(api.images ?? [], api.avatar),
    videoUrl: api.video_url ?? undefined,
    amenities: api.amenities ?? [],
    tags: api.tags ?? [],
    vipTier: api.vip_tier ?? 'normal',
    status: api.is_sold ? 'sold' : api.status ?? 'active',
    isFavorited: Boolean(api.is_favorited),
    contact: {
      name: api.contact_name ?? api.owner?.name ?? '',
      phone: api.contact_phone ?? api.owner?.phone ?? '',
      avatarUrl: api.contact_avatar ?? api.owner?.avatar ?? undefined,
    },
    ownerId,
    viewCount: toNum(api.view_count),
    createdAt: api.created_at,
    updatedAt: api.updated_at,
    expiresAt: api.expires_at ?? api.updated_at,
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

export interface LaravelListingQuery {
  per_page?: number;
  page?: number;
  q?: string;
  category_id?: string;
  type?: string;
  property_type?: number;
  province?: string;
  district?: string;
  ward?: string;
  bedrooms?: number;
  direction?: string;
  furnish?: string;
  vip_only?: boolean;
  min_area?: number;
  max_area?: number;
  min_price?: number;
  max_price?: number;
  sort_by?: 'created_at' | 'price' | 'area' | 'view_count';
  sort_order?: 'asc' | 'desc';
}

export function mapFilterToApi(f: ListingFilter): LaravelListingQuery {
  const out: LaravelListingQuery = {};
  if (f.pageSize) out.per_page = Math.min(f.pageSize, 30);
  if (f.page) out.page = f.page;
  if (f.q) out.q = f.q;
  if (f.categoryId) out.category_id = f.categoryId;
  if (f.transactionType) out.type = TX_MAP_TO_API[f.transactionType];
  if (f.propertyType) out.property_type = PROPERTY_LOCAL_TO_CODE[f.propertyType];
  if (f.cityCode) {
    const city = cities.find((c) => c.code === f.cityCode);
    if (city) out.province = city.name;
  }
  if (f.districtCode && f.cityCode) {
    const city = cities.find((c) => c.code === f.cityCode);
    const district = city?.districts.find((d) => d.code === f.districtCode);
    if (district) out.district = district.name;
  }
  if (f.bedrooms !== undefined) out.bedrooms = f.bedrooms;
  if (f.direction) out.direction = DIRECTION_TO_API[f.direction];
  if (f.furnish) out.furnish = f.furnish;
  if (f.vipOnly) out.vip_only = true;
  if (f.areaMin !== undefined) out.min_area = f.areaMin;
  if (f.areaMax !== undefined) out.max_area = f.areaMax;
  // Laravel stores the entered numeric value together with its price unit:
  // sale prices are expressed in billions, rent prices in millions/month.
  const priceDivisor = f.transactionType === 'sale' ? 1_000_000_000 : 1_000_000;
  if (f.priceMin !== undefined) out.min_price = f.priceMin / priceDivisor;
  if (f.priceMax !== undefined) out.max_price = f.priceMax / priceDivisor;
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
