/**
 * Auth + Me API backed by the MediaBDS Laravel API.
 */
import { realFetch, setApiToken } from './realClient';
import {
  mapApiListing,
  mapPaginated,
  type LaravelListing,
  type LaravelPaginated,
} from './laravelAdapter';
import { cities, getDistrict } from '@/mocks/data/cities';
import type { ApiResponse, Direction, Listing, PaginatedResponse, PropertyType, User } from '@/types';

interface ApiUser {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  role: 'buyer' | 'ctv' | 'admin';
  avatar: string | null;
  invite_code: string | null;
  is_admin: boolean;
  created_at: string;
  trial_ends_at: string | null;
  license_expires_at: string | null;
}

interface AuthPayload {
  user: ApiUser;
  token: string;
}

interface Envelope<T> {
  success?: boolean;
  data: T;
  message?: string;
}

export interface UploadedListingImage {
  url: string;
  path: string;
  disk: string;
  name: string;
  size: number;
  mime: string;
}

function mapUser(u: ApiUser): User {
  return {
    id: String(u.id),
    email: u.email ?? `${u.phone}@bds.vn`,
    name: u.name,
    phone: u.phone,
    avatarUrl: u.avatar ?? undefined,
    role: u.role === 'admin' || u.role === 'ctv' ? 'broker' : 'user',
    verifiedAt: u.is_admin ? u.created_at : undefined,
    createdAt: u.created_at,
  };
}

const PROPERTY_TO_CODE: Record<PropertyType, number> = {
  apartment: 103,
  room: 115,
  house: 108,
  office: 107,
  land: 104,
  shared: 115,
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

function listingPayload(payload: Partial<Listing>) {
  const city = payload.cityCode ? cities.find((c) => c.code === payload.cityCode) : undefined;
  const district =
    payload.cityCode && payload.districtCode
      ? getDistrict(payload.cityCode, payload.districtCode)
      : undefined;
  const imageUrls = payload.images?.map((image) => image.url).filter(Boolean) ?? [];
  const isRent = payload.transactionType === 'rent';
  const isMonthly = payload.priceUnit === 'month';

  return {
    title: payload.title ?? '',
    type: isRent ? 'Cho thuê' : 'Cần bán',
    property_type: PROPERTY_TO_CODE[payload.propertyType ?? 'house'],
    category_id: payload.categoryId,
    price: isMonthly ? payload.price ?? 0 : (payload.price ?? 0) / 1_000_000_000,
    price_unit: isMonthly ? 'VNĐ/tháng' : 'Tỷ',
    area: payload.area ?? 0,
    contact_phone: payload.contact?.phone ?? '',
    contact_name: payload.contact?.name,
    address: payload.addressLine ?? '',
    province_id: payload.cityCode,
    district_id: payload.districtCode,
    ward_name: payload.wardName,
    province_name: city?.name,
    district_name: district?.name,
    description: payload.description ?? '',
    bedrooms: payload.bedrooms,
    toilets: payload.bathrooms,
    direction: payload.direction ? DIRECTION_TO_API[payload.direction] : undefined,
    furnish: payload.furnish,
    images: imageUrls,
    avatar: imageUrls[0],
    amenities: payload.amenities ?? [],
    tags: payload.tags ?? [],
    lat: payload.lat,
    lng: payload.lng,
  };
}

export const authApi = {
  async login(input: { email?: string; phone?: string; password: string }): Promise<
    ApiResponse<{ user: User; token: string }>
  > {
    const phone = input.phone ?? input.email ?? '';
    const res = await realFetch<Envelope<AuthPayload>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password: input.password }),
    });
    setApiToken(res.data.token);
    return { data: { user: mapUser(res.data.user), token: res.data.token } };
  },

  async register(input: {
    name: string;
    phone?: string;
    email?: string;
    password: string;
    inviteCode?: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    const phone = input.phone ?? input.email ?? '';
    const res = await realFetch<Envelope<AuthPayload>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: input.name,
        phone,
        password: input.password,
        password_confirmation: input.password,
        ...(input.inviteCode ? { invite_code: input.inviteCode } : {}),
      }),
    });
    setApiToken(res.data.token);
    return { data: { user: mapUser(res.data.user), token: res.data.token } };
  },

  async logout(): Promise<ApiResponse<{ ok: boolean }>> {
    try {
      await realFetch('/auth/logout', { method: 'POST' });
    } finally {
      setApiToken(null);
    }
    return { data: { ok: true } };
  },

  async me(): Promise<ApiResponse<User>> {
    const res = await realFetch<Envelope<ApiUser>>('/auth/me');
    return { data: mapUser(res.data) };
  },
};

export const meApi = {
  async listListings({
    page = 1,
    pageSize = 100,
  }: { page?: number; pageSize?: number } = {}): Promise<PaginatedResponse<Listing>> {
    const res = await realFetch<LaravelPaginated<LaravelListing>>('/me/listings', {
      query: { page, per_page: pageSize },
    });
    return mapPaginated(res);
  },

  async createListing(payload: Partial<Listing>): Promise<ApiResponse<Listing>> {
    const res = await realFetch<Envelope<LaravelListing>>('/listings', {
      method: 'POST',
      body: JSON.stringify(listingPayload(payload)),
    });
    return { data: mapApiListing(res.data) };
  },

  async updateListing(id: string, payload: Partial<Listing>): Promise<ApiResponse<Listing>> {
    const res = await realFetch<Envelope<LaravelListing>>(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(listingPayload(payload)),
    });
    return { data: mapApiListing(res.data) };
  },

  async uploadListingImages(files: File[]): Promise<ApiResponse<UploadedListingImage[]>> {
    const body = new FormData();
    files.forEach((file) => {
      body.append('images[]', file);
    });
    const res = await realFetch<Envelope<UploadedListingImage[]>>('/listings/images', {
      method: 'POST',
      body,
    });
    return { data: res.data };
  },

  async deleteListing(id: string): Promise<void> {
    await realFetch(`/listings/${id}`, { method: 'DELETE' });
  },

  async listFavorites(): Promise<ApiResponse<Listing[]>> {
    const res = await realFetch<{ data: LaravelListing[] }>('/me/favorites');
    return { data: res.data.map(mapApiListing) };
  },

  async toggleFavorite(listingId: string): Promise<
    ApiResponse<{ listingId: string; favorited: boolean }>
  > {
    const res = await realFetch<Envelope<{
      listingId?: string;
      listing_id?: string | number;
      favorited: boolean;
    }>>('/me/favorites', {
      method: 'POST',
      body: JSON.stringify({ listing_id: listingId, listingId }),
    });
    return {
      data: {
        listingId: String(res.data.listingId ?? res.data.listing_id ?? listingId),
        favorited: res.data.favorited,
      },
    };
  },

  async stats(): Promise<{
    success: boolean;
    data: {
      total_revenue: number;
      invites_count: number;
      listings_count: number;
      listings_sold: number;
      rank?: { name: string; min_price: number } | null;
    };
  }> {
    return realFetch('/me/stats');
  },
};
