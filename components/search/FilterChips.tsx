'use client';

import { X } from 'lucide-react';
import type { ListingFilter } from '@/types';
import {
  PROPERTY_TYPE_LABELS,
  DIRECTION_LABELS,
  FURNISH_LABELS,
} from '@/lib/constants';
import { cities, cityByCode } from '@/mocks/data/cities';
import { formatPrice, formatArea } from '@/lib/utils/format';

interface Chip {
  label: string;
  onRemove: () => void;
}

export function FilterChips({
  filter,
  setFilter,
}: {
  filter: ListingFilter;
  setFilter: (next: Partial<ListingFilter>) => void;
}) {
  const chips: Chip[] = [];

  if (filter.q) chips.push({ label: `Từ khoá: "${filter.q}"`, onRemove: () => setFilter({ q: undefined }) });
  if (filter.transactionType)
    chips.push({
      label: filter.transactionType === 'rent' ? 'Cho thuê' : 'Mua bán',
      onRemove: () => setFilter({ transactionType: undefined }),
    });
  if (filter.propertyType)
    chips.push({
      label: PROPERTY_TYPE_LABELS[filter.propertyType],
      onRemove: () => setFilter({ propertyType: undefined }),
    });
  if (filter.cityCode) {
    const city = cityByCode.get(filter.cityCode);
    if (city) chips.push({ label: city.name, onRemove: () => setFilter({ cityCode: undefined, districtCode: undefined }) });
  }
  if (filter.districtCode) {
    const city = cityByCode.get(filter.cityCode ?? '');
    const d = city?.districts.find((x) => x.code === filter.districtCode);
    if (d) chips.push({ label: d.name, onRemove: () => setFilter({ districtCode: undefined }) });
  }
  if (filter.priceMin || filter.priceMax) {
    const isMonth = filter.transactionType !== 'sale';
    const unit: 'month' | 'total' = isMonth ? 'month' : 'total';
    const label = `Giá: ${filter.priceMin ? formatPrice(filter.priceMin, unit) : ''}${filter.priceMin && filter.priceMax ? ' - ' : ''}${filter.priceMax ? formatPrice(filter.priceMax, unit) : ''}`;
    chips.push({ label, onRemove: () => setFilter({ priceMin: undefined, priceMax: undefined }) });
  }
  if (filter.areaMin || filter.areaMax) {
    chips.push({
      label: `Diện tích: ${filter.areaMin ? formatArea(filter.areaMin) : ''}${filter.areaMin && filter.areaMax ? ' - ' : ''}${filter.areaMax ? formatArea(filter.areaMax) : ''}`,
      onRemove: () => setFilter({ areaMin: undefined, areaMax: undefined }),
    });
  }
  if (filter.bedrooms)
    chips.push({ label: `${filter.bedrooms}+ phòng ngủ`, onRemove: () => setFilter({ bedrooms: undefined }) });
  if (filter.direction)
    chips.push({ label: `Hướng ${DIRECTION_LABELS[filter.direction]}`, onRemove: () => setFilter({ direction: undefined }) });
  if (filter.furnish)
    chips.push({ label: FURNISH_LABELS[filter.furnish], onRemove: () => setFilter({ furnish: undefined }) });
  if (filter.vipOnly) chips.push({ label: 'Chỉ VIP', onRemove: () => setFilter({ vipOnly: false }) });

  if (chips.length === 0) return null;

  // Avoid unused cities warning
  void cities;

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((c, i) => (
        <button
          key={i}
          type="button"
          onClick={c.onRemove}
          className="inline-flex items-center gap-1 rounded-sm border border-brdr bg-white px-2 py-1 text-xs text-ink hover:border-primary hover:text-primary"
        >
          {c.label}
          <X size={12} />
        </button>
      ))}
    </div>
  );
}
