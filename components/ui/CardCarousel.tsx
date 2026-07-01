'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from '@/components/icons';
import { cn } from '@/lib/utils';

interface Props {
  items: ReactNode[];
}

/**
 * Slider ngang dùng chung cho các khối thẻ (tin BĐS, xe...).
 * Hiển thị 4 item/lượt trên desktop, cuộn snap, có nút trước/sau.
 */
export function CardCarousel({ items }: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    update();
    const onScroll = () => update();
    el.addEventListener('scroll', onScroll, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', onScroll);
      ro.disconnect();
    };
  }, [update, items.length]);

  // Cuộn theo "trang" = số thẻ đang hiển thị trong khung nhìn.
  const step = useCallback((direction: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-card]');
    if (!card) return;
    const cardW = card.offsetWidth || 1;
    const perView = Math.max(1, Math.round(el.clientWidth / cardW));
    el.scrollBy({ left: direction * perView * cardW, behavior: 'smooth' });
  }, []);

  if (!items.length) return null;

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="-mx-2 flex snap-x snap-mandatory items-stretch overflow-x-auto overscroll-x-contain pb-2 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            data-card
            className="flex snap-start shrink-0 basis-1/2 px-2 md:basis-1/3 lg:basis-1/4"
          >
            {item}
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Trước"
        onClick={() => step(-1)}
        disabled={!canPrev}
        className={cn(
          'absolute -left-4 top-[42%] hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-brdr bg-white shadow-elevated transition md:grid',
          canPrev ? 'opacity-100 hover:border-primary hover:text-primary' : 'opacity-0 pointer-events-none'
        )}
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        aria-label="Sau"
        onClick={() => step(1)}
        disabled={!canNext}
        className={cn(
          'absolute -right-4 top-[42%] hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-brdr bg-white shadow-elevated transition md:grid',
          canNext ? 'opacity-100 hover:border-primary hover:text-primary' : 'opacity-0 pointer-events-none'
        )}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}