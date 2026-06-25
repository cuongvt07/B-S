import type {
  PaginatedResponse,
  TransactionType,
  Vehicle,
  VehicleImage,
  VehicleKind,
  VipTier,
} from '@/types';
import type { LaravelPaginated } from './laravelAdapter';
import { buildListingSlug } from '@/lib/utils/slugify';

export interface LaravelVehicle {
  id: number;
  code: string | null;
  slug?: string | null;
  title: string;
  description?: string | null;
  type: string;
  transaction_type?: TransactionType;

  vehicle_type: string;
  vehicle_type_label?: string | null;
  brand?: string | null;
  model_name?: string | null;
  year?: number | string | null;
  mileage?: number | string | null;
  transmission?: string | null;
  transmission_label?: string | null;
  fuel_type?: string | null;
  fuel_type_label?: string | null;
  engine_capacity?: string | null;
  color?: string | null;
  seats?: number | string | null;
  condition?: string | null;
  condition_label?: string | null;
  origin?: string | null;
  origin_label?: string | null;

  price: number | string | null;
  price_unit: string | number;
  price_vnd?: number | string | null;

  address: string | null;
  district_name?: string | null;
  province_name?: string | null;
  lat?: number | string | null;
  lng?: number | string | null;

  avatar: string | null;
  images: string[];
  tags?: string[] | null;
  video_url?: string | null;

  vip_tier?: VipTier | null;
  status?: 'active' | 'pending' | 'expired' | 'sold' | 'rejected' | null;
  is_sold: boolean;
  view_count?: number | string | null;
  created_at: string;
  updated_at: string;
  published_at?: string | null;

  contact_name?: string | null;
  contact_phone: string | null;
  owner?: { id: number; name: string | null; phone: string | null } | null;
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
  return Number.isFinite(n) ? n : undefined;
}

function priceToVND(api: LaravelVehicle): number {
  if (api.price_vnd !== undefined && api.price_vnd !== null) return toNum(api.price_vnd);
  const p = toNum(api.price);
  const unit = String(api.price_unit).trim();
  if (p >= 1_000_000) return p;
  if (unit === 'Tỷ' || unit === 'Tỉ' || unit === '1') return p * 1_000_000_000;
  if (unit === 'Triệu' || unit === '2') return p * 1_000_000;
  return p;
}

function mapImages(urls: string[] = [], avatar: string | null): VehicleImage[] {
  const seen = new Set<string>();
  const out: VehicleImage[] = [];
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

function vehicleKind(v: string): VehicleKind {
  return v === 'motorbike' ? 'motorbike' : 'car';
}

export function mapApiVehicle(api: LaravelVehicle): Vehicle {
  const id = String(api.id);
  const slug = api.slug || buildListingSlug(api.title || `xe-${api.code ?? id}`, id);

  return {
    id,
    slug,
    code: api.code ?? undefined,
    title: api.title || '(Không có tiêu đề)',
    description: api.description ?? '',

    vehicleType: vehicleKind(api.vehicle_type),
    vehicleTypeLabel: api.vehicle_type_label ?? (api.vehicle_type === 'motorbike' ? 'Xe máy' : 'Ô tô'),
    transactionType: api.transaction_type === 'rent' ? 'rent' : 'sale',

    brand: api.brand ?? undefined,
    modelName: api.model_name ?? undefined,
    year: toOptInt(api.year),
    mileage: toOptInt(api.mileage),
    transmission: api.transmission ?? undefined,
    transmissionLabel: api.transmission_label ?? api.transmission ?? undefined,
    fuelType: api.fuel_type ?? undefined,
    fuelTypeLabel: api.fuel_type_label ?? api.fuel_type ?? undefined,
    engineCapacity: api.engine_capacity ?? undefined,
    color: api.color ?? undefined,
    seats: toOptInt(api.seats),
    condition: api.condition ?? undefined,
    conditionLabel: api.condition_label ?? api.condition ?? undefined,
    origin: api.origin ?? undefined,
    originLabel: api.origin_label ?? api.origin ?? undefined,

    price: priceToVND(api),
    cityName: api.province_name ?? undefined,
    districtName: api.district_name ?? undefined,
    addressLine: api.address ?? undefined,

    images: mapImages(api.images ?? [], api.avatar),
    videoUrl: api.video_url ?? undefined,
    tags: api.tags ?? [],

    vipTier: api.vip_tier ?? 'normal',
    status: api.is_sold ? 'sold' : api.status ?? 'active',
    isSold: Boolean(api.is_sold),
    contact: {
      name: api.contact_name ?? api.owner?.name ?? '',
      phone: api.contact_phone ?? api.owner?.phone ?? '',
    },
    viewCount: toNum(api.view_count),
    createdAt: api.created_at,
    updatedAt: api.updated_at,
    publishedAt: api.published_at ?? api.created_at,
  };
}

export function mapVehiclePaginated(api: LaravelPaginated<LaravelVehicle>): PaginatedResponse<Vehicle> {
  return {
    data: api.data.map(mapApiVehicle),
    meta: {
      page: api.meta.current_page,
      pageSize: api.meta.per_page,
      total: api.meta.total,
      totalPages: api.meta.last_page,
    },
  };
}
