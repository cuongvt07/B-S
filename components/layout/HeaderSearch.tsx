'use client';

import { Search } from '@/components/icons';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { SearchSuggestions } from './SearchSuggestions';
import { cn } from '@/lib/utils';

const HINTS = [
  'Tìm theo địa điểm, dự án, đường...',
  'Căn hộ Vinhomes Grand Park',
  'Nhà phố Quận 7, TP.HCM',
  'Đất nền Long Thành, Đồng Nai',
  'Phòng trọ gần Đại học Bách Khoa',
];

const TYPE_SPEED = 60;
const ERASE_SPEED = 28;
const HOLD_FULL = 1400;
const HOLD_EMPTY = 320;

function useTypewriter(active: boolean) {
  const [text, setText] = useState('');
  const idxRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;
    let phase: 'typing' | 'holdFull' | 'erasing' | 'holdEmpty' = 'typing';
    let cursor = 0;

    function tick() {
      if (cancelled) return;
      const phrase = HINTS[idxRef.current % HINTS.length];
      if (phase === 'typing') {
        cursor++;
        setText(phrase.slice(0, cursor));
        if (cursor >= phrase.length) {
          phase = 'holdFull';
          timer = setTimeout(tick, HOLD_FULL);
          return;
        }
        timer = setTimeout(tick, TYPE_SPEED);
        return;
      }
      if (phase === 'holdFull') {
        phase = 'erasing';
        timer = setTimeout(tick, ERASE_SPEED);
        return;
      }
      if (phase === 'erasing') {
        cursor--;
        setText(phrase.slice(0, cursor));
        if (cursor <= 0) {
          phase = 'holdEmpty';
          idxRef.current++;
          timer = setTimeout(tick, HOLD_EMPTY);
          return;
        }
        timer = setTimeout(tick, ERASE_SPEED);
        return;
      }
      if (phase === 'holdEmpty') {
        phase = 'typing';
        timer = setTimeout(tick, TYPE_SPEED);
      }
    }

    timer = setTimeout(tick, 200);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [active]);

  return text;
}

export function HeaderSearch({ placeholder }: { placeholder?: string }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [focused, setFocused] = useState(false);
  const blurTimer = useRef<number | undefined>(undefined);
  const animatePlaceholder = q.length === 0 && !focused;
  const typed = useTypewriter(animatePlaceholder && !placeholder);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    router.push(`/tin-dang${params.toString() ? `?${params.toString()}` : ''}`);
    setFocused(false);
  }

  return (
    <form
      onSubmit={onSubmit}
      role="search"
      className="relative hidden min-w-0 max-w-xl flex-1 md:flex"
    >
      <div
        className={cn(
          'flex w-full items-center rounded-sm border bg-white py-1.5 pl-3 pr-1 transition-colors',
          focused ? 'border-primary' : 'border-brdr hover:border-ink-muted/40'
        )}
      >
        <Search size={16} className="shrink-0 text-ink-muted" />
        <div className="relative ml-2 flex-1 min-w-0">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => {
              if (blurTimer.current) window.clearTimeout(blurTimer.current);
              setFocused(true);
            }}
            onBlur={() => {
              blurTimer.current = window.setTimeout(() => setFocused(false), 200);
            }}
            placeholder={placeholder ?? ' '}
            className="w-full min-w-0 bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none"
            aria-label="Tìm kiếm tin đăng"
          />
          {animatePlaceholder && !placeholder && (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 flex items-center text-sm text-ink-muted"
            >
              {typed}
              <span className="bds-typewriter-caret" />
            </span>
          )}
        </div>
        <button
          type="submit"
          className="ml-2 inline-flex shrink-0 items-center whitespace-nowrap rounded-sm bg-champagne px-4 py-1.5 text-xs font-semibold text-champagne-ink transition-colors hover:bg-champagne-hover"
        >
          Tìm kiếm
        </button>
      </div>
      <SearchSuggestions
        q={q}
        visible={focused && q.trim().length >= 1}
        onSelect={() => setFocused(false)}
      />
    </form>
  );
}
