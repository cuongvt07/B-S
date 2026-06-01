'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { cities } from '@/mocks/data/cities';
import { getCityCenter } from '@/lib/utils/coords';
import { cn } from '@/lib/utils';

interface LocationItem {
  key: string;
  label: string;
  sublabel?: string;
  cityCode: string;
  districtCode?: string;
  type: 'city' | 'district';
  lng: number;
  lat: number;
  zoom: number;
}

interface Props {
  onPick: (item: LocationItem) => void;
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd');
}

const QUICK = [
  { label: 'TP.HCM', cityCode: 'hcm' },
  { label: 'Hà Nội', cityCode: 'hn' },
  { label: 'Đà Nẵng', cityCode: 'dnang' },
  { label: 'Hải Phòng', cityCode: 'hp' },
  { label: 'Bình Dương', cityCode: 'bd' },
  { label: 'Đồng Nai', cityCode: 'dn' },
];

export function LocationSearch({ onPick }: Props) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Build flat list of city + district locations
  const allLocations: LocationItem[] = useMemo(() => {
    const out: LocationItem[] = [];
    for (const c of cities) {
      const [lng, lat] = getCityCenter(c.code);
      out.push({
        key: `c:${c.code}`,
        label: c.name,
        cityCode: c.code,
        type: 'city',
        lng,
        lat,
        zoom: 11,
      });
      for (const d of c.districts) {
        out.push({
          key: `d:${c.code}:${d.code}`,
          label: d.name,
          sublabel: c.name,
          cityCode: c.code,
          districtCode: d.code,
          type: 'district',
          lng,
          lat,
          zoom: 13,
        });
      }
    }
    return out;
  }, []);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const nq = normalize(q.trim());
    const matches: LocationItem[] = [];
    for (const it of allLocations) {
      const hay = normalize(`${it.label} ${it.sublabel ?? ''}`);
      if (hay.includes(nq)) matches.push(it);
      if (matches.length >= 12) break;
    }
    return matches;
  }, [q, allLocations]);

  useEffect(() => {
    if (!active) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setActive(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [active]);

  function pick(it: LocationItem) {
    onPick(it);
    setQ(it.label);
    setActive(false);
  }

  function pickQuick(cityCode: string) {
    const found = allLocations.find((l) => l.type === 'city' && l.cityCode === cityCode);
    if (found) pick(found);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!active || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((v) => Math.min(v + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((v) => Math.max(v - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      pick(results[highlight] ?? results[0]);
    } else if (e.key === 'Escape') {
      setActive(false);
    }
  }

  return (
    <div ref={wrapRef} className="relative">
      <div className="flex items-center rounded-sm border border-brdr bg-white px-3 py-2 focus-within:border-primary">
        <Search size={14} className="text-ink-muted" />
        <input
          type="text"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(true);
            setHighlight(0);
          }}
          onFocus={() => setActive(true)}
          onKeyDown={onKeyDown}
          placeholder="Tìm tỉnh, quận, huyện..."
          className="ml-2 w-full min-w-0 bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none"
        />
        {q && (
          <button
            type="button"
            onClick={() => {
              setQ('');
              setActive(false);
            }}
            aria-label="Xoá"
            className="ml-1 text-ink-muted hover:text-ink"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Quick chips */}
      <div className="mt-2 flex flex-wrap gap-1.5">
        {QUICK.map((c) => (
          <button
            key={c.cityCode}
            type="button"
            onClick={() => pickQuick(c.cityCode)}
            className="rounded-full border border-brdr bg-white px-2.5 py-1 text-xs text-ink hover:border-primary hover:text-primary"
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Dropdown */}
      {active && q.trim() && (
        <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-72 overflow-y-auto rounded-md border border-brdr bg-white shadow-elevated animate-fadeIn">
          {results.length === 0 ? (
            <p className="px-3 py-2 text-sm text-ink-muted">
              Không tìm thấy địa điểm cho &ldquo;{q}&rdquo;
            </p>
          ) : (
            results.map((it, i) => (
              <button
                key={it.key}
                type="button"
                onMouseEnter={() => setHighlight(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(it)}
                className={cn(
                  'flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition',
                  i === highlight ? 'bg-surface-subtle' : 'hover:bg-surface-subtle'
                )}
              >
                <MapPin size={14} className="text-ink-muted" />
                <span className="flex-1">
                  <span className="font-medium text-ink">{it.label}</span>
                  {it.sublabel && (
                    <span className="ml-1 text-xs text-ink-muted">— {it.sublabel}</span>
                  )}
                </span>
                <span className="text-[10px] uppercase tracking-wide text-ink-muted">
                  {it.type === 'district' ? 'Q/H' : 'Tỉnh'}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
