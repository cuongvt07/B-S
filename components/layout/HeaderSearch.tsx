'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { SearchSuggestions } from './SearchSuggestions';

export function HeaderSearch({ placeholder }: { placeholder?: string }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [focused, setFocused] = useState(false);
  const blurTimer = useRef<number | undefined>(undefined);

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
      className="relative hidden min-w-0 max-w-2xl flex-1 md:flex"
    >
      <div className="flex w-full items-center rounded-sm border border-brdr bg-white py-1.5 pl-3 pr-1 focus-within:border-primary">
        <Search size={16} className="shrink-0 text-ink-muted" />
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
          placeholder={placeholder ?? 'Tìm theo địa điểm, dự án, tên đường...'}
          className="ml-2 w-full min-w-0 bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none"
        />
        <button
          type="submit"
          className="ml-2 inline-flex items-center whitespace-nowrap rounded-sm bg-primary px-4 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
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
