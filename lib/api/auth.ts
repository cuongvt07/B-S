import { apiFetch } from './client';
import type { ApiResponse, Listing, User } from '@/types';

export const authApi = {
  login(input: { email: string; password: string }): Promise<ApiResponse<{ user: User; token: string }>> {
    return apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(input) });
  },
  register(input: { email: string; password: string; name: string; phone: string }): Promise<
    ApiResponse<{ user: User; token: string }>
  > {
    return apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(input) });
  },
  logout(): Promise<ApiResponse<{ ok: boolean }>> {
    return apiFetch('/auth/logout', { method: 'POST' });
  },
  me(): Promise<ApiResponse<User>> {
    return apiFetch('/me');
  },
};

export const meApi = {
  listListings(): Promise<ApiResponse<Listing[]>> {
    return apiFetch('/me/listings');
  },
  createListing(payload: Partial<Listing>): Promise<ApiResponse<Listing>> {
    return apiFetch('/me/listings', { method: 'POST', body: JSON.stringify(payload) });
  },
  updateListing(id: string, payload: Partial<Listing>): Promise<ApiResponse<Listing>> {
    return apiFetch(`/me/listings/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  },
  deleteListing(id: string): Promise<void> {
    return apiFetch(`/me/listings/${id}`, { method: 'DELETE' });
  },
  listFavorites(): Promise<ApiResponse<Listing[]>> {
    return apiFetch('/me/favorites');
  },
  toggleFavorite(listingId: string): Promise<ApiResponse<{ listingId: string; favorited: boolean }>> {
    return apiFetch('/me/favorites', { method: 'POST', body: JSON.stringify({ listingId }) });
  },
};
