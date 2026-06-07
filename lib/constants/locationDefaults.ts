import type { City, District } from '@/types';

export const DEFAULT_POST_CITY_CODE = '52';

export const BINH_DINH_DISTRICTS: District[] = [
  { code: '540', name: 'Thành phố Quy Nhơn', slug: 'quy-nhon', cityCode: DEFAULT_POST_CITY_CODE },
  { code: '542', name: 'Huyện An Lão', slug: 'an-lao', cityCode: DEFAULT_POST_CITY_CODE },
  { code: '543', name: 'Thị xã Hoài Nhơn', slug: 'hoai-nhon', cityCode: DEFAULT_POST_CITY_CODE },
  { code: '544', name: 'Huyện Hoài Ân', slug: 'hoai-an', cityCode: DEFAULT_POST_CITY_CODE },
  { code: '545', name: 'Huyện Phù Mỹ', slug: 'phu-my', cityCode: DEFAULT_POST_CITY_CODE },
  { code: '546', name: 'Huyện Vĩnh Thạnh', slug: 'vinh-thanh', cityCode: DEFAULT_POST_CITY_CODE },
  { code: '547', name: 'Huyện Tây Sơn', slug: 'tay-son', cityCode: DEFAULT_POST_CITY_CODE },
  { code: '548', name: 'Huyện Phù Cát', slug: 'phu-cat', cityCode: DEFAULT_POST_CITY_CODE },
  { code: '549', name: 'Thị xã An Nhơn', slug: 'an-nhon', cityCode: DEFAULT_POST_CITY_CODE },
  { code: '550', name: 'Huyện Tuy Phước', slug: 'tuy-phuoc', cityCode: DEFAULT_POST_CITY_CODE },
  { code: '551', name: 'Huyện Vân Canh', slug: 'van-canh', cityCode: DEFAULT_POST_CITY_CODE },
];

export const BINH_DINH_CITY: City = {
  code: DEFAULT_POST_CITY_CODE,
  name: 'Bình Định',
  slug: 'binh-dinh',
  districts: BINH_DINH_DISTRICTS,
};

export function ensureDefaultPostCity(cities: City[]): City[] {
  const existing = cities.find((city) => city.code === DEFAULT_POST_CITY_CODE);
  if (!existing) return [BINH_DINH_CITY, ...cities];
  if (existing.districts.length > 0) return cities;
  return cities.map((city) =>
    city.code === DEFAULT_POST_CITY_CODE ? { ...city, districts: BINH_DINH_DISTRICTS } : city
  );
}
