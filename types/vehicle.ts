import type { TransactionType, VipTier, ListingStatus } from './listing';

export type VehicleKind = 'car' | 'motorbike';

export interface VehicleImage {
  id: string;
  url: string;
  isPrimary?: boolean;
}

export interface VehicleContact {
  name: string;
  phone: string;
  zalo?: string;
}

export interface Vehicle {
  id: string;
  slug: string;
  code?: string;
  title: string;
  description: string;

  vehicleType: VehicleKind;
  vehicleTypeLabel: string;
  transactionType: TransactionType;

  // Thông số xe
  brand?: string;
  modelName?: string;
  year?: number;
  mileage?: number;
  transmission?: string;
  transmissionLabel?: string;
  fuelType?: string;
  fuelTypeLabel?: string;
  engineCapacity?: string;
  color?: string;
  seats?: number;
  condition?: string;
  conditionLabel?: string;
  origin?: string;
  originLabel?: string;

  price: number; // đã quy đổi VND
  cityName?: string;
  districtName?: string;
  addressLine?: string;

  images: VehicleImage[];
  videoUrl?: string;
  tags: string[];

  vipTier: VipTier;
  status: ListingStatus;
  isSold: boolean;
  contact: VehicleContact;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}
