import Link from 'next/link';
import { ChevronLeft, ChevronRight } from '@/components/icons';
import { cn } from '@/lib/utils';

interface Props {
  page: number;
  totalPages: number;
  /** Builds the href for a given page number (lets the caller preserve other query params, e.g. tag). */
  hrefFor: (page: number) => string;
}

/**
 * Link-based pagination for server-rendered lists.
 *
 * Unlike the client `Pagination` (search), this renders real <Link>s so the
 * paginated blog index stays crawlable and works without client JS.
 */
export function BlogPagination({ page, totalPages, hrefFor }: Props) {
  if (totalPages <= 1) return null;

  const pages: (number | '...')[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  const cell =
    'inline-flex h-9 min-w-[36px] items-center justify-center rounded-sm border border-brdr px-2 text-sm';

  return (
    <nav className="mt-8 flex items-center justify-center gap-1" aria-label="Phân trang">
      {page <= 1 ? (
        <span className={cn(cell, 'opacity-40')} aria-disabled="true">
          <ChevronLeft size={16} />
        </span>
      ) : (
        <Link href={hrefFor(page - 1)} className={cn(cell, 'text-ink hover:bg-surface-subtle')} aria-label="Trang trước" rel="prev">
          <ChevronLeft size={16} />
        </Link>
      )}

      {pages.map((p, idx) =>
        p === '...' ? (
          <span key={`gap-${idx}`} className="px-2 text-ink-muted">
            …
          </span>
        ) : p === page ? (
          <span key={p} className={cn(cell, 'border-primary font-semibold text-primary')} aria-current="page">
            {p}
          </span>
        ) : (
          <Link key={p} href={hrefFor(p)} className={cn(cell, 'text-ink hover:bg-surface-subtle')}>
            {p}
          </Link>
        )
      )}

      {page >= totalPages ? (
        <span className={cn(cell, 'opacity-40')} aria-disabled="true">
          <ChevronRight size={16} />
        </span>
      ) : (
        <Link href={hrefFor(page + 1)} className={cn(cell, 'text-ink hover:bg-surface-subtle')} aria-label="Trang sau" rel="next">
          <ChevronRight size={16} />
        </Link>
      )}
    </nav>
  );
}
