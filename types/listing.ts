export type TransactionType = 'rent' | 'sale';

export type PropertyType =
  | 'apartment'
  | 'room'
  | 'house'
  | 'office'
  | 'land'
  | 'shared';

export type Direction =
  | 'east'
  | 'west'
  | 'south'
  | 'north'
  | 'ne'
  | 'nw'
  | 'se'
  | 'sw';

export type FurnishLevel = 'none' | 'basic' | 'full';

export type ListingStatus = 'active' | 'pending' | 'expired' | 'sold';

export type VipTier = 'normal' | 'vip1' | 'vip2' | 'vip3';

export interface ListingImage {
  id: string;
  url: string;
  alt?: string;
  isPrimary?: boolean;
}

export interface ListingContact {
  name: string;
  phone: string;
  zalo?: string;
  messengerId?: string;
  avatarUrl?: string;
}

export interface Listing {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  priceUnit: 'month' | 'total';
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  direction?: Direction;
  furnish?: FurnishLevel;
  transactionType: TransactionType;
  propertyType: PropertyType;
  categoryId: string;
  cityCode: string;
  districtCode: string;
  wardName?: string;
  addressLine: string;
  lat?: number;
  lng?: number;
  images: ListingImage[];
  videoUrl?: string;
  amenities: string[];
  tags: string[];
  vipTier: VipTier;
  status: ListingStatus;
  contact: ListingContact;
  ownerId: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}
