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
  { label: '100 - 500 triệu', min: 100_000_000, max: 500_000_000 },
  { label: '500 triệu - 1 tỷ', min: 500_000_000, max: 1_000_000_000 },
  { label: '1 - 2 tỷ', min: 1_000_000_000, max: 2_000_000_000 },
  { label: '2 - 3 tỷ', min: 2_000_000_000, max: 3_000_000_000 },
  { label: '3 - 5 tỷ', min: 3_000_000_000, max: 5_000_000_000 },
  { label: '5 - 10 tỷ', min: 5_000_000_000, max: 10_000_000_000 },
  { label: '10 - 20 tỷ', min: 10_000_000_000, max: 20_000_000_000 },
  { label: '20 - 30 tỷ', min: 20_000_000_000, max: 30_000_000_000 },
  { label: '30 - 50 tỷ', min: 30_000_000_000, max: 50_000_000_000 },
  { label: 'Trên 50 tỷ', min: 50_000_000_000 },
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

// ───────────────── XE CỘ ─────────────────
export const VEHICLE_TYPE_LABELS: Record<'car' | 'motorbike', string> = {
  car: 'Ô tô',
  motorbike: 'Xe máy',
};

export const TRANSMISSION_LABELS: Record<string, string> = {
  manual: 'Số sàn',
  automatic: 'Số tự động',
  cvt: 'Số vô cấp (CVT)',
  semi_automatic: 'Số bán tự động',
};

export const FUEL_LABELS: Record<string, string> = {
  petrol: 'Xăng',
  diesel: 'Dầu (Diesel)',
  electric: 'Điện',
  hybrid: 'Hybrid',
};

export const CONDITION_LABELS: Record<string, string> = {
  new: 'Mới',
  used: 'Đã sử dụng',
};

export const ORIGIN_LABELS: Record<string, string> = {
  imported: 'Nhập khẩu',
  domestic: 'Lắp ráp trong nước',
};

export const CAR_BRANDS = [
  'Toyota', 'Honda', 'Hyundai', 'Kia', 'Mazda', 'Ford', 'Mitsubishi',
  'Mercedes-Benz', 'BMW', 'Audi', 'VinFast', 'Suzuki', 'Nissan',
  'Chevrolet', 'Lexus', 'Peugeot', 'MG', 'Isuzu', 'Khác',
];

export const MOTORBIKE_BRANDS = [
  'Honda', 'Yamaha', 'Suzuki', 'SYM', 'Piaggio', 'Vespa', 'VinFast',
  'Kawasaki', 'Ducati', 'Harley-Davidson', 'Khác',
];

// Khoảng giá xe (VND) — chung cho ô tô & xe máy, dải rộng để phủ cả 2.
export const VEHICLE_PRICE_BRACKETS: { label: string; min?: number; max?: number }[] = [
  { label: 'Dưới 20 triệu', max: 20_000_000 },
  { label: '20 - 50 triệu', min: 20_000_000, max: 50_000_000 },
  { label: '50 - 200 triệu', min: 50_000_000, max: 200_000_000 },
  { label: '200 - 500 triệu', min: 200_000_000, max: 500_000_000 },
  { label: '500 triệu - 1 tỷ', min: 500_000_000, max: 1_000_000_000 },
  { label: 'Trên 1 tỷ', min: 1_000_000_000 },
];

export const VEHICLE_SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'priceAsc', label: 'Giá thấp đến cao' },
  { value: 'priceDesc', label: 'Giá cao đến thấp' },
  { value: 'yearDesc', label: 'Đời xe mới nhất' },
  { value: 'kmAsc', label: 'Số km ít nhất' },
] as const;

export const SITE = {
  name: 'VM Phú Thịnh Land',
  tagline: 'Nền tảng tin đăng bất động sản hàng đầu',
  url: 'https://bds.vn',
  contactPhone: '0922 255 544',
  contactEmail: 'vmphuthinhland@gmail.com',
};

export const COMPANY = {
  legalName: 'CÔNG TY TNHH MỘT THÀNH VIÊN VM PHÚ THỊNH LAND',
  taxCode: '4101690886',
  registrationDate: '08/06/2026',
  legalRepresentative: 'VÕ XUÂN PHONG',
  representativeTitle: 'Giám đốc',
  charterCapital: '1.000.000.000 VNĐ',
  address: '140 Nguyễn Diêu, Phường Quy Nhơn Đông, Tỉnh Gia Lai, Việt Nam',
  addressLines: [
    '140 Nguyễn Diêu',
    'Phường Quy Nhơn Đông',
    'Tỉnh Gia Lai, Việt Nam',
  ],
  website: null as string | null,
  primaryIndustryCode: '6810',
  primaryIndustry:
    'Kinh doanh bất động sản, quyền sử dụng đất thuộc chủ sở hữu, chủ sử dụng hoặc đi thuê.',
  industries: [
    'Xây dựng dân dụng',
    'Xây dựng công trình giao thông',
    'Hoàn thiện công trình xây dựng',
    'Tư vấn kỹ thuật xây dựng',
    'Thiết kế chuyên dụng',
    'Quảng cáo',
    'Môi giới bất động sản',
    'Cho thuê xe có động cơ',
    'Thương mại điện tử',
    'Lập trình máy tính',
    'Vận tải hành khách và hàng hóa',
  ],
} as const;
