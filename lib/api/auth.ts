/**
 * Auth + Me API — calls the real Laravel endpoints (Sanctum SPA flow).
 */
import { realFetch } from './realClient';
import { apiFetch } from './client';
import {
  mapApiListing,
  mapPaginated,
  type LaravelListing,
  type LaravelPaginated,
} from './laravelAdapter';
import type { ApiResponse, Listing, User } from '@/types';

// ── Laravel User envelope ──
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

interface UserEnvelope {
  success?: boolean;
  data: ApiUser;
  message?: string;
}

export const authApi = {
  async login(input: { email?: string; phone?: string; password: string }): Promise<
    ApiResponse<{ user: User; token: string }>
  > {
    // Laravel API uses `phone`. If caller passes email, fall back to it as-is.
    const phone = input.phone ?? input.email ?? '';
    const res = await realFetch<UserEnvelope>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password: input.password }),
    });
    return { data: { user: mapUser(res.data), token: 'sanctum-cookie' } };
  },

  async register(input: {
    name: string;
    phone?: string;
    email?: string;
    password: string;
    inviteCode?: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    const phone = input.phone ?? input.email ?? '';
    const res = await realFetch<UserEnvelope>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: input.name,
        phone,
        password: input.password,
        password_confirmation: input.password,
        ...(input.inviteCode ? { invite_code: input.inviteCode } : {}),
      }),
    });
    return { data: { user: mapUser(res.data), token: 'sanctum-cookie' } };
  },

  async logout(): Promise<ApiResponse<{ ok: boolean }>> {
    await realFetch('/auth/logout', { method: 'POST' });
    return { data: { ok: true } };
  },

  async me(): Promise<ApiResponse<User>> {
    const res = await realFetch<UserEnvelope | { data: ApiUser }>('/auth/me');
    const data = 'success' in res ? res.data : res.data;
    return { data: mapUser(data) };
  },
};

export const meApi = {
  async listListings(): Promise<ApiResponse<Listing[]>> {
    const res = await realFetch<LaravelPaginated<LaravelListing>>('/me/listings', {
      query: { per_page: 100 },
    });
    return { data: mapPaginated(res).data };
  },

  async createListing(payload: Partial<Listing>): Promise<ApiResponse<Listing>> {
    // Map a tiny subset (local Listing → Laravel ListingInput).
    const body = {
      title: payload.title ?? '',
      type: payload.transactionType === 'rent' ? 'Cho thuê' : 'Cần bán',
      property_type: 108, // Nhà riêng (default) — could be mapped from propertyType
      price: payload.price ? payload.price / 1_000_000_000 : 0,
      price_unit: payload.priceUnit === 'month' ? 'VNĐ/tháng' : 'Tỷ',
      area: payload.area ?? 0,
      contact_phone: payload.contact?.phone ?? '',
      address: payload.addressLine ?? '',
      description: payload.description ?? '',
      bedrooms: payload.bedrooms ?? undefined,
      toilets: payload.bathrooms ?? undefined,
    };
    const res = await realFetch<{ data: LaravelListing }>('/listings', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return { data: mapApiListing(res.data) };
  },

  async updateListing(id: string, payload: Partial<Listing>): Promise<ApiResponse<Listing>> {
    const body = {
      title: payload.title ?? '',
      type: payload.transactionType === 'rent' ? 'Cho thuê' : 'Cần bán',
      property_type: 108,
      price: payload.price ? payload.price / 1_000_000_000 : 0,
      price_unit: payload.priceUnit === 'month' ? 'VNĐ/tháng' : 'Tỷ',
      area: payload.area ?? 0,
      contact_phone: payload.contact?.phone ?? '',
    };
    const res = await realFetch<{ data: LaravelListing }>(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    return { data: mapApiListing(res.data) };
  },

  async deleteListing(id: string): Promise<void> {
    await realFetch(`/listings/${id}`, { method: 'DELETE' });
  },

  // Favorites endpoint isn't available on Laravel yet — fall back to local mock.
  async listFavorites(): Promise<ApiResponse<Listing[]>> {
    return apiFetch<ApiResponse<Listing[]>>('/me/favorites');
  },

  async toggleFavorite(listingId: string): Promise<
    ApiResponse<{ listingId: string; favorited: boolean }>
  > {
    return apiFetch('/me/favorites', {
      method: 'POST',
      body: JSON.stringify({ listingId }),
    });
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
