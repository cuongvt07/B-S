'use client';

import type { ListingFilter, SortBy } from '@/types';
import { SORT_OPTIONS } from '@/lib/constants';

interface Props {
  value?: SortBy;
  onChange: (next: SortBy) => void;
}

export function SortDropdown({ value = 'newest', onChange }: Props) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-ink">
      Sắp xếp:
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortBy)}
        className="rounded-sm border border-brdr px-2 py-1 text-sm focus:outline-none focus:border-primary"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

// Avoid unused import warning in TS strict mode
export type { ListingFilter };
