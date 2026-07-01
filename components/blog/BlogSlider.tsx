'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from '@/components/icons';
import type { Blog } from '@/types';
import { BlogCard } from './BlogCard';
import { cn } from '@/lib/utils';

interface Props {
  blogs: Blog[];
  emptyText?: string;
}

export function BlogSlider({ blogs, emptyText }: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [current, setCurrent] = useState(0);
  const total = blogs.length;

  // Reset về 0 khi danh sách thay đổi
  useEffect(() => { setCurrent(0); }, [total]);

  const goTo = useCallback(
    (idx: number) => {
      const el = trackRef.current;
      if (!el) return;
      const clamped = Math.max(0, Math.min(total - 1, idx));
      setCurrent(clamped);
      const card = el.children[clamped] as HTMLElement | undefined;
      if (card) {
        el.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
      }
    },
    [total]
  );

  if (!blogs.length) {
    return (
      <div className="rounded-md border border-dashed border-brdr p-8 text-center text-ink-muted">
        {emptyText ?? 'Chưa có bài viết nào.'}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Track — ẩn scrollbar, mỗi card chiếm 100% width */}
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory overflow-x-hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        {blogs.map((b) => (
          <div
            key={b.id}
            className="w-full shrink-0 snap-start"
          >
            <BlogCard blog={b} />
          </div>
        ))}
      </div>

      {/* Điều hướng prev / next */}
      {total > 1 && (
        <>
          <button
            type="button"
            aria-label="Bài trước"
            onClick={() => goTo(current - 1)}
            disabled={current === 0}
            className={cn(
              'absolute -left-4 top-[40%] hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-brdr bg-white shadow-elevated transition md:grid',
              current === 0 ? 'pointer-events-none opacity-0' : 'opacity-100 hover:border-primary hover:text-primary'
            )}
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            aria-label="Bài sau"
            onClick={() => goTo(current + 1)}
            disabled={current === total - 1}
            className={cn(
              'absolute -right-4 top-[40%] hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-brdr bg-white shadow-elevated transition md:grid',
              current === total - 1 ? 'pointer-events-none opacity-0' : 'opacity-100 hover:border-primary hover:text-primary'
            )}
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {total > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {blogs.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Bài ${i + 1}`}
              onClick={() => goTo(i)}
              className={cn(
                'h-1.5 rounded-full transition-all',
                i === current ? 'w-5 bg-primary' : 'w-1.5 bg-brdr hover:bg-ink-muted'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}