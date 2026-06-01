import type { Direction, FurnishLevel, PropertyType } from '@/types';

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  apartment: 'Căn hộ / Chung cư',
  room: 'Phòng trọ',
  house: 'Nhà nguyên căn',
  office: 'Văn phòng / Mặt bằng',
  land: 'Nhà đất',
  shared: 'Ở ghép',
};

export const DIRECTION_LABELS: Record<Direction, string> = {
  east: 'Đông',
  west: 'Tây',
  south: 'Nam',
  north: 'Bắc',
  ne: 'Đông Bắc',
  nw: 'Tây Bắc',
  se: 'Đông Nam',
  sw: 'Tây Nam',
};

export const FURNISH_LABELS: Record<FurnishLevel, string> = {
  none: 'Không nội thất',
  basic: 'Nội thất cơ bản',
  full: 'Đầy đủ nội thất',
};

export const PRICE_BRACKETS_RENT: { label: string; min?: number; max?: number }[] = [
  { label: 'Dưới 3 triệu', max: 3_000_000 },
  { label: '3 - 5 triệu', min: 3_000_000, max: 5_000_000 },
  { label: '5 - 10 triệu', min: 5_000_000, max: 10_000_000 },
  { label: '10 - 20 triệu', min: 10_000_000, max: 20_000_000 },
  { label: 'Trên 20 triệu', min: 20_000_000 },
];

export const PRICE_BRACKETS_SALE: { label: string; min?: number; max?: number }[] = [
  { label: 'Dưới 1 tỷ', max: 1_000_000_000 },
  { label: '1 - 3 tỷ', min: 1_000_000_000, max: 3_000_000_000 },
  { label: '3 - 5 tỷ', min: 3_000_000_000, max: 5_000_000_000 },
  { label: '5 - 10 tỷ', min: 5_000_000_000, max: 10_000_000_000 },
  { label: 'Trên 10 tỷ', min: 10_000_000_000 },
];

export const AREA_BRACKETS: { label: string; min?: number; max?: number }[] = [
  { label: 'Dưới 30 m²', max: 30 },
  { label: '30 - 50 m²', min: 30, max: 50 },
  { label: '50 - 80 m²', min: 50, max: 80 },
  { label: '80 - 150 m²', min: 80, max: 150 },
  { label: 'Trên 150 m²', min: 150 },
];

export const AMENITIES: { value: string; label: string }[] = [
  { value: 'parking', label: 'Chỗ để xe' },
  { value: 'elevator', label: 'Thang máy' },
  { value: 'aircon', label: 'Máy lạnh' },
  { value: 'fridge', label: 'Tủ lạnh' },
  { value: 'washer', label: 'Máy giặt' },
  { value: 'wifi', label: 'Wifi' },
  { value: 'security', label: 'An ninh 24/7' },
  { value: 'balcony', label: 'Ban công' },
  { value: 'pet', label: 'Cho phép thú cưng' },
  { value: 'kitchen', label: 'Bếp riêng' },
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'priceAsc', label: 'Giá thấp đến cao' },
  { value: 'priceDesc', label: 'Giá cao đến thấp' },
  { value: 'areaAsc', label: 'Diện tích nhỏ đến lớn' },
  { value: 'areaDesc', label: 'Diện tích lớn đến nhỏ' },
] as const;

export const SITE = {
  name: 'BDS Việt',
  tagline: 'Nền tảng tin đăng bất động sản hàng đầu',
  url: 'https://bds.vn',
  contactPhone: '1900 1234',
  contactEmail: 'hotro@bds.vn',
};
