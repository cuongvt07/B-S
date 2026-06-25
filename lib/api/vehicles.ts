/**
 * Vehicle API — endpoints công khai + ghi (auth) tại /api/v1/vehicles.
 * Adapt response Laravel → kiểu `Vehicle` nội bộ.
 */
import { realFetch } from './realClient';
import { mapApiVehicle, mapVehiclePaginated, type LaravelVehicle } from './vehicleAdapter';
import type { LaravelPaginated } from './laravelAdapter';
import type { ApiResponse, PaginatedResponse, Vehicle } from '@/types';

export interface VehicleInput {
  title: string;
  vehicleType: 'car' | 'motorbike';
  brand?: string;
  modelName?: string;
  year?: number;
  mileage?: number;
  transmission?: string;
  fuelType?: string;
  engineCapacity?: string;
  color?: string;
  seats?: number;
  condition?: string;
  origin?: string;
  price?: number;
  priceUnit?: string;
  provinceName?: string;
  districtName?: string;
  address?: string;
  contactName?: string;
  contactPhone: string;
  contactZalo?: string;
  description?: string;
  images: string[];
  tags?: string[];
  youtubeLink?: string;
}

interface Envelope<T> {
  data: T;
}

function toPayload(input: VehicleInput): Record<string, unknown> {
  return {
    title: input.title,
    type: 'Cần bán',
    vehicle_type: input.vehicleType,
    brand: input.brand || null,
    model_name: input.modelName || null,
    year: input.year || null,
    mileage: input.mileage ?? null,
    transmission: input.transmission || null,
    fuel_type: input.fuelType || null,
    engine_capacity: input.engineCapacity || null,
    color: input.color || null,
    seats: input.seats || null,
    condition: input.condition || null,
    origin: input.origin || null,
    price: input.price ?? null,
    price_unit: input.priceUnit || 'Triệu',
    province_name: input.provinceName || null,
    district_name: input.districtName || null,
    address: input.address || null,
    contact_name: input.contactName || null,
    contact_phone: input.contactPhone,
    contact_zalo: input.contactZalo || null,
    description: input.description || null,
    images: input.images,
    tags: input.tags ?? [],
    youtube_link: input.youtubeLink || null,
  };
}

export const vehicleApi = {
  async get(idOrSlug: string): Promise<ApiResponse<Vehicle>> {
    const res = await realFetch<{ data: LaravelVehicle }>(`/vehicles/${idOrSlug}`);
    return { data: mapApiVehicle(res.data) };
  },

  async listMine({ page = 1, pageSize = 100 }: { page?: number; pageSize?: number } = {}): Promise<
    PaginatedResponse<Vehicle>
  > {
    const res = await realFetch<LaravelPaginated<LaravelVehicle>>('/me/vehicles', {
      query: { page, per_page: pageSize },
    });
    return mapVehiclePaginated(res);
  },

  async create(input: VehicleInput): Promise<ApiResponse<Vehicle>> {
    const res = await realFetch<Envelope<LaravelVehicle>>('/vehicles', {
      method: 'POST',
      body: JSON.stringify(toPayload(input)),
    });
    return { data: mapApiVehicle(res.data) };
  },

  async update(id: string, input: VehicleInput): Promise<ApiResponse<Vehicle>> {
    const res = await realFetch<Envelope<LaravelVehicle>>(`/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(toPayload(input)),
    });
    return { data: mapApiVehicle(res.data) };
  },

  async remove(id: string): Promise<void> {
    await realFetch(`/vehicles/${id}`, { method: 'DELETE' });
  },
};
