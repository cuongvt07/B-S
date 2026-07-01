'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search } from '@/components/icons';

export function NotFoundSearch() {
  const router = useRouter();
  const [q, setQ] = useState('');

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = q.trim();
    router.push(v ? `/tin-dang?q=${encodeURIComponent(v)}` : '/tin-dang');
  }

  return (
    <form
      role="search"
      onSubmit={onSubmit}
      className="flex items-center rounded-sm border border-brdr bg-white p-1 shadow-raised focus-within:border-primary"
    >
      <Search size={18} className="mx-2 shrink-0 text-ink-muted" />
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Tìm theo địa điểm, dự án, đường..."
        className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none"
        aria-label="Tìm kiếm tin đăng"
      />
      <button
        type="submit"
        className="ml-2 inline-flex items-center whitespace-nowrap rounded-sm bg-champagne px-4 py-2 text-sm font-semibold text-champagne-ink transition hover:bg-champagne-hover"
      >
        Tìm kiếm
      </button>
    </form>
  );
}
