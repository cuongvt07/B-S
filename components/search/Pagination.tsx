'use client';

import { ChevronLeft, ChevronRight } from '@/components/icons';
import { cn } from '@/lib/utils';

interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;

  const pages: (number | '...')[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  const btn =
    'inline-flex h-9 min-w-[36px] items-center justify-center rounded-sm border border-brdr px-2 text-sm';

  return (
    <nav className="flex items-center gap-1" aria-label="Phân trang">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className={cn(btn, 'disabled:opacity-40')}
        aria-label="Trang trước"
      >
        <ChevronLeft size={16} />
      </button>
      {pages.map((p, idx) =>
        p === '...' ? (
          <span key={idx} className="px-2 text-ink-muted">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={cn(
              btn,
              p === page ? 'border-primary text-primary font-semibold' : 'text-ink hover:bg-surface-subtle'
            )}
          >
            {p}
          </button>
        )
      )}
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className={cn(btn, 'disabled:opacity-40')}
        aria-label="Trang sau"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
