import type { Listing } from '@/types';
import { listings as seedListings } from './data/listings';

// In-memory mutable store. Resets on process restart (acceptable for MVP).
// On Vercel serverless, cold-start wipes state — documented in plan.
const listingStore = new Map<string, Listing>(seedListings.map((l) => [l.id, { ...l }]));

export const listingsStore = {
  all(): Listing[] {
    return Array.from(listingStore.values());
  },
  get(id: string): Listing | undefined {
    return listingStore.get(id);
  },
  upsert(listing: Listing): Listing {
    listingStore.set(listing.id, listing);
    return listing;
  },
  delete(id: string): boolean {
    return listingStore.delete(id);
  },
  ofOwner(ownerId: string): Listing[] {
    return this.all().filter((l) => l.ownerId === ownerId);
  },
};

const favoriteStore = new Map<string, Set<string>>(); // userId -> Set<listingId>

export const favoritesStore = {
  list(userId: string): string[] {
    return Array.from(favoriteStore.get(userId) ?? []);
  },
  toggle(userId: string, listingId: string): boolean {
    const set = favoriteStore.get(userId) ?? new Set<string>();
    let added: boolean;
    if (set.has(listingId)) {
      set.delete(listingId);
      added = false;
    } else {
      set.add(listingId);
      added = true;
    }
    favoriteStore.set(userId, set);
    return added;
  },
  has(userId: string, listingId: string): boolean {
    return favoriteStore.get(userId)?.has(listingId) ?? false;
  },
};
