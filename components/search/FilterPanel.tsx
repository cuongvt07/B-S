'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { cities, cityByCode } from '@/mocks/data/cities';
import {
  PRICE_BRACKETS_RENT,
  PRICE_BRACKETS_SALE,
  AREA_BRACKETS,
  DIRECTION_LABELS,
  FURNISH_LABELS,
  PROPERTY_TYPE_LABELS,
} from '@/lib/constants';
import type { ListingFilter } from '@/types';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Section({ title, children, defaultOpen = true }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-brdr py-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left text-sm font-semibold text-ink"
      >
        {title}
        <ChevronDown
          size={16}
          className={cn('text-ink-muted transition-transform', open && 'rotate-180')}
        />
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

function Radio({
  name,
  checked,
  onChange,
  label,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink cursor-pointer hover:text-primary">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="accent-primary"
      />
      {label}
    </label>
  );
}

interface Props {
  filter: ListingFilter;
  setFilter: (next: Partial<ListingFilter>) => void;
}

export function FilterPanel({ filter, setFilter }: Props) {
  const priceBrackets =
    filter.transactionType === 'sale' ? PRICE_BRACKETS_SALE : PRICE_BRACKETS_RENT;
  const city = filter.cityCode ? cityByCode.get(filter.cityCode) : undefined;

  return (
    <aside className="w-full lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
      <div className="rounded-md border border-brdr bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink">Bộ lọc tìm kiếm</h3>
          <button
            type="button"
            onClick={() => setFilter({
              categoryId: undefined,
              transactionType: undefined,
              propertyType: undefined,
              cityCode: undefined,
              districtCode: undefined,
              priceMin: undefined,
              priceMax: undefined,
              areaMin: undefined,
              areaMax: undefined,
              bedrooms: undefined,
              direction: undefined,
              furnish: undefined,
              vipOnly: false,
            })}
            className="text-xs text-primary hover:underline"
          >
            Xoá lọc
          </button>
        </div>

        <Section title="Loại giao dịch">
          <Radio
            name="tx"
            label="Tất cả"
            checked={!filter.transactionType}
            onChange={() => setFilter({ transactionType: undefined })}
          />
          <Radio
            name="tx"
            label="Cho thuê"
            checked={filter.transactionType === 'rent'}
            onChange={() => setFilter({ transactionType: 'rent' })}
          />
          <Radio
            name="tx"
            label="Mua bán"
            checked={filter.transactionType === 'sale'}
            onChange={() => setFilter({ transactionType: 'sale' })}
          />
        </Section>

        <Section title="Loại bất động sản">
          <Radio
            name="pt"
            label="Tất cả"
            checked={!filter.propertyType}
            onChange={() => setFilter({ propertyType: undefined })}
          />
          {Object.entries(PROPERTY_TYPE_LABELS).map(([v, l]) => (
            <Radio
              key={v}
              name="pt"
              label={l}
              checked={filter.propertyType === v}
              onChange={() => setFilter({ propertyType: v as ListingFilter['propertyType'] })}
            />
          ))}
        </Section>

        <Section title="Khu vực">
          <select
            value={filter.cityCode ?? ''}
            onChange={(e) => setFilter({ cityCode: e.target.value || undefined, districtCode: undefined })}
            className="w-full rounded-sm border border-brdr px-2 py-1 text-sm"
          >
            <option value="">Tất cả tỉnh / thành</option>
            {cities.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
          {city && city.districts.length > 0 ? (
            <select
              value={filter.districtCode ?? ''}
              onChange={(e) => setFilter({ districtCode: e.target.value || undefined })}
              className="mt-2 w-full rounded-sm border border-brdr px-2 py-1 text-sm"
            >
              <option value="">Tất cả quận / huyện</option>
              {city.districts.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.name}
                </option>
              ))}
            </select>
          ) : city ? (
            <p className="mt-2 text-xs text-ink-muted">
              Đang cập nhật danh sách quận / huyện cho khu vực này.
            </p>
          ) : null}
        </Section>

        <Section title="Khoảng giá">
          <Radio
            name="price"
            label="Tất cả"
            checked={!filter.priceMin && !filter.priceMax}
            onChange={() => setFilter({ priceMin: undefined, priceMax: undefined })}
          />
          {priceBrackets.map((b, i) => (
            <Radio
              key={i}
              name="price"
              label={b.label}
              checked={filter.priceMin === b.min && filter.priceMax === b.max}
              onChange={() => setFilter({ priceMin: b.min, priceMax: b.max })}
            />
          ))}
        </Section>

        <Section title="Diện tích" defaultOpen={false}>
          <Radio
            name="area"
            label="Tất cả"
            checked={!filter.areaMin && !filter.areaMax}
            onChange={() => setFilter({ areaMin: undefined, areaMax: undefined })}
          />
          {AREA_BRACKETS.map((b, i) => (
            <Radio
              key={i}
              name="area"
              label={b.label}
              checked={filter.areaMin === b.min && filter.areaMax === b.max}
              onChange={() => setFilter({ areaMin: b.min, areaMax: b.max })}
            />
          ))}
        </Section>

        <Section title="Số phòng ngủ" defaultOpen={false}>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilter({ bedrooms: undefined })}
              className={cn(
                'rounded-sm border px-3 py-1 text-xs',
                !filter.bedrooms ? 'border-primary text-primary' : 'border-brdr text-ink'
              )}
            >
              Tất cả
            </button>
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setFilter({ bedrooms: n })}
                className={cn(
                  'rounded-sm border px-3 py-1 text-xs',
                  filter.bedrooms === n ? 'border-primary text-primary' : 'border-brdr text-ink'
                )}
              >
                {n}+
              </button>
            ))}
          </div>
        </Section>

        <Section title="Hướng nhà" defaultOpen={false}>
          <select
            value={filter.direction ?? ''}
            onChange={(e) =>
              setFilter({ direction: (e.target.value as ListingFilter['direction']) || undefined })
            }
            className="w-full rounded-sm border border-brdr px-2 py-1 text-sm"
          >
            <option value="">Tất cả hướng</option>
            {Object.entries(DIRECTION_LABELS).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </Section>

        <Section title="Nội thất" defaultOpen={false}>
          {(['none', 'basic', 'full'] as const).map((v) => (
            <Radio
              key={v}
              name="furnish"
              label={FURNISH_LABELS[v]}
              checked={filter.furnish === v}
              onChange={() => setFilter({ furnish: v })}
            />
          ))}
          <Radio
            name="furnish"
            label="Tất cả"
            checked={!filter.furnish}
            onChange={() => setFilter({ furnish: undefined })}
          />
        </Section>

        <Section title="Khác" defaultOpen={false}>
          <label className="flex items-center gap-2 text-sm text-ink cursor-pointer">
            <input
              type="checkbox"
              checked={!!filter.vipOnly}
              onChange={(e) => setFilter({ vipOnly: e.target.checked })}
              className="accent-primary"
            />
            Chỉ tin VIP
          </label>
        </Section>
      </div>
    </aside>
  );
}
