import type { Category } from '@/types';

export const categories: Category[] = [
  { id: 'c-apt-rent', name: 'Cho thuê căn hộ', slug: 'cho-thue-can-ho', transactionType: 'rent' },
  { id: 'c-room-rent', name: 'Cho thuê phòng trọ', slug: 'cho-thue-phong-tro', transactionType: 'rent' },
  { id: 'c-house-rent', name: 'Cho thuê nhà nguyên căn', slug: 'cho-thue-nha-nguyen-can', transactionType: 'rent' },
  { id: 'c-office-rent', name: 'Cho thuê văn phòng', slug: 'cho-thue-van-phong', transactionType: 'rent' },
  { id: 'c-shared-rent', name: 'Ở ghép', slug: 'o-ghep', transactionType: 'rent' },
  { id: 'c-apt-sale', name: 'Bán căn hộ chung cư', slug: 'ban-can-ho', transactionType: 'sale' },
  { id: 'c-house-sale', name: 'Bán nhà riêng', slug: 'ban-nha-rieng', transactionType: 'sale' },
  { id: 'c-land-sale', name: 'Bán đất', slug: 'ban-dat', transactionType: 'sale' },
];

export const categoryById = new Map(categories.map((c) => [c.id, c]));
