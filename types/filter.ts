import type { Direction, FurnishLevel, PropertyType, TransactionType } from './listing';

export type SortBy =
  | 'newest'
  | 'priceAsc'
  | 'priceDesc'
  | 'areaAsc'
  | 'areaDesc';

export interface ListingFilter {
  q?: string;
  categoryId?: string;
  transactionType?: TransactionType;
  propertyType?: PropertyType;
  cityCode?: string;
  districtCode?: string;
  priceMin?: number;
  priceMax?: number;
  areaMin?: number;
  areaMax?: number;
  bedrooms?: number;
  direction?: Direction;
  furnish?: FurnishLevel;
  vipOnly?: boolean;
  sort?: SortBy;
  page?: number;
  pageSize?: number;
}
