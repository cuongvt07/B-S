'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import {
  VEHICLE_TYPE_LABELS,
  TRANSMISSION_LABELS,
  FUEL_LABELS,
  CAR_BRANDS,
  MOTORBIKE_BRANDS,
  VEHICLE_PRICE_BRACKETS,
  VEHICLE_SORT_OPTIONS,
} from '@/lib/constants';

const selectCls =
  'h-9 rounded-sm border border-brdr bg-white px-2 text-sm text-ink focus:border-primary focus:outline-none';

export function VehicleFilterPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const loai = sp.get('loai') ?? '';
  const brands = loai === 'motorbike' ? MOTORBIKE_BRANDS : CAR_BRANDS;

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(sp.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete('page'); // đổi filter → về trang 1
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, sp]
  );

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      <select className={selectCls} value={loai} onChange={(e) => setParam('loai', e.target.value)}>
        <option value="">Tất cả loại xe</option>
        {Object.entries(VEHICLE_TYPE_LABELS).map(([k, label]) => (
          <option key={k} value={k}>{label}</option>
        ))}
      </select>

      <select className={selectCls} value={sp.get('hang') ?? ''} onChange={(e) => setParam('hang', e.target.value)}>
        <option value="">Tất cả hãng</option>
        {brands.map((b) => (
          <option key={b} value={b}>{b}</option>
        ))}
      </select>

      <select className={selectCls} value={sp.get('hopso') ?? ''} onChange={(e) => setParam('hopso', e.target.value)}>
        <option value="">Hộp số</option>
        {Object.entries(TRANSMISSION_LABELS).map(([k, label]) => (
          <option key={k} value={k}>{label}</option>
        ))}
      </select>

      <select className={selectCls} value={sp.get('nl') ?? ''} onChange={(e) => setParam('nl', e.target.value)}>
        <option value="">Nhiên liệu</option>
        {Object.entries(FUEL_LABELS).map(([k, label]) => (
          <option key={k} value={k}>{label}</option>
        ))}
      </select>

      <select className={selectCls} value={sp.get('gia') ?? ''} onChange={(e) => setParam('gia', e.target.value)}>
        <option value="">Khoảng giá</option>
        {VEHICLE_PRICE_BRACKETS.map((b, i) => (
          <option key={b.label} value={String(i)}>{b.label}</option>
        ))}
      </select>

      <select
        className={`${selectCls} ml-auto`}
        value={sp.get('sort') ?? 'newest'}
        onChange={(e) => setParam('sort', e.target.value === 'newest' ? '' : e.target.value)}
      >
        {VEHICLE_SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
