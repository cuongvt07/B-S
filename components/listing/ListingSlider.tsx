'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Listing } from '@/types';
import { ListingCard } from './ListingCard';
import { cn } from '@/lib/utils';

interface Props {
  listings: Listing[];
  emptyText?: string;
}

export function ListingSlider({ listings, emptyText }: Props) {
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
  }, [update, listings.length]);

  const step = useCallback((direction: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-card]');
    if (!card) return;
    const nextCard = card.nextElementSibling as HTMLElement | null;
    const cardStep = nextCard ? nextCard.offsetLeft - card.offsetLeft : card.offsetWidth;
    const curIdx = Math.round(el.scrollLeft / cardStep);
    const target = Math.max(0, Math.min(listings.length - 1, curIdx + direction));
    el.scrollTo({ left: target * cardStep, behavior: 'smooth' });
  }, [listings.length]);

  if (!listings.length) {
    return (
      <div className="rounded-md border border-dashed border-brdr p-8 text-center text-ink-muted">
        {emptyText ?? 'Chưa có tin đăng nào phù hợp.'}
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="-mx-2 flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto overscroll-x-contain px-2 pb-2 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        {listings.map((l) => (
          <div
            key={l.id}
            data-card
            className="flex h-[420px] w-[288px] min-w-[288px] snap-start"
          >
            <ListingCard listing={l} />
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Tin trước"
        onClick={() => step(-1)}
        disabled={!canPrev}
        className={cn(
          'absolute -left-4 top-[40%] hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-brdr bg-white shadow-elevated transition md:grid',
          canPrev ? 'opacity-100 hover:border-primary hover:text-primary' : 'opacity-0 pointer-events-none'
        )}
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        aria-label="Tin sau"
        onClick={() => step(1)}
        disabled={!canNext}
        className={cn(
          'absolute -right-4 top-[40%] hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-brdr bg-white shadow-elevated transition md:grid',
          canNext ? 'opacity-100 hover:border-primary hover:text-primary' : 'opacity-0 pointer-events-none'
        )}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
