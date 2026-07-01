'use client';

import { useState } from 'react';
import { ChevronDown, SlidersHorizontal } from '@/components/icons';
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
    <div className="filter-section">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-left text-sm font-semibold text-ink"
      >
        {title}
        <ChevronDown
          size={16}
          className={cn('text-ink-muted transition-transform', open && 'rotate-180')}
        />
      </button>
      {open && <div className="mt-3">{children}</div>}
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
    <label className="filter-choice">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="filter-choice__control"
      />
      <span>{label}</span>
    </label>
  );
}

interface Props {
  filter: ListingFilter;
  setFilter: (next: Partial<ListingFilter>) => void;
}

export function FilterPanel({ filter, setFilter }: Props) {
  const [mobileOpen, setMobileOpen] = useState(true);
  const priceBrackets =
    filter.transactionType === 'sale' ? PRICE_BRACKETS_SALE : PRICE_BRACKETS_RENT;
  const city = filter.cityCode ? cityByCode.get(filter.cityCode) : undefined;

  return (
    <aside className="w-full lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
      <div className="rounded-2xl border border-brdr/70 bg-white p-3 shadow-raised lg:p-4">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="flex flex-1 items-center gap-2 text-left text-sm font-semibold text-ink lg:pointer-events-none"
            aria-expanded={mobileOpen}
          >
            <span className="icon-chip grid h-8 w-8 place-items-center rounded-full bg-primary-soft text-primary">
              <SlidersHorizontal size={16} />
            </span>
            Bộ lọc tìm kiếm
            <ChevronDown
              size={15}
              className={cn('ml-auto text-ink-muted transition-transform lg:hidden', mobileOpen && 'rotate-180')}
            />
          </button>
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

        <div className={cn('mt-3 space-y-2', mobileOpen ? 'block' : 'hidden lg:block')}>

        <Section title="Loại giao dịch" defaultOpen>
          <div className="filter-choice-grid">
          <Radio
            name="tx"
            label="Tất cả"
            checked={!filter.transactionType}
            onChange={() =>
              setFilter({ transactionType: undefined, priceMin: undefined, priceMax: undefined })
            }
          />
          <Radio
            name="tx"
            label="Cho thuê"
            checked={filter.transactionType === 'rent'}
            onChange={() =>
              setFilter({ transactionType: 'rent', priceMin: undefined, priceMax: undefined })
            }
          />
          <Radio
            name="tx"
            label="Mua bán"
            checked={filter.transactionType === 'sale'}
            onChange={() =>
              setFilter({ transactionType: 'sale', priceMin: undefined, priceMax: undefined })
            }
          />
          </div>
        </Section>

        <Section title="Loại bất động sản">
          <div className="filter-choice-grid">
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
          </div>
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
          <div className="filter-choice-grid">
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
          </div>
        </Section>

        <Section title="Diện tích">
          <div className="filter-choice-grid">
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
          </div>
        </Section>

        <Section title="Số phòng ngủ">
          <div className="filter-choice-grid">
            <Radio
              name="bedrooms"
              label="Tất cả"
              checked={!filter.bedrooms}
              onChange={() => setFilter({ bedrooms: undefined })}
            />
            {[1, 2, 3, 4].map((n) => (
              <Radio
                key={n}
                name="bedrooms"
                label={`${n}+ phòng`}
                checked={filter.bedrooms === n}
                onChange={() => setFilter({ bedrooms: n })}
              />
            ))}
          </div>
        </Section>

        <Section title="Hướng nhà">
          <div className="filter-choice-grid">
            <Radio
              name="direction"
              label="Tất cả"
              checked={!filter.direction}
              onChange={() => setFilter({ direction: undefined })}
            />
            {Object.entries(DIRECTION_LABELS).map(([v, l]) => (
              <Radio
                key={v}
                name="direction"
                label={l}
                checked={filter.direction === v}
                onChange={() => setFilter({ direction: v as ListingFilter['direction'] })}
              />
            ))}
          </div>
        </Section>

        <Section title="Nội thất">
          <div className="filter-choice-grid">
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
          </div>
        </Section>

        <Section title="Điều kiện kết hợp">
          <label className="filter-choice">
            <input
              type="checkbox"
              checked={!!filter.vipOnly}
              onChange={(e) => setFilter({ vipOnly: e.target.checked })}
              className="filter-choice__control rounded-[3px]"
            />
            Chỉ hiển thị tin VIP
          </label>
        </Section>
        </div>
      </div>
    </aside>
  );
}
