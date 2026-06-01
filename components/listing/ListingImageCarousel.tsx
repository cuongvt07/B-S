'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ListingImage } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  images: ListingImage[];
  alt: string;
  sizes?: string;
  className?: string;
}

export function ListingImageCarousel({ images, alt, sizes, className }: Props) {
  const [idx, setIdx] = useState(0);
  const touchStartX = useRef<number | null>(null);

  if (!images.length) {
    return <div className={cn('bg-surface-subtle', className)} />;
  }

  const total = images.length;
  const safeIdx = ((idx % total) + total) % total;
  const current = images[safeIdx];

  function go(delta: number, e?: React.MouseEvent) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIdx((v) => v + delta);
  }

  function jumpTo(target: number, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIdx(target);
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      setIdx((v) => v + (delta < 0 ? 1 : -1));
    }
    touchStartX.current = null;
  }

  return (
    <div
      className={cn('relative h-full w-full overflow-hidden', className)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <Image
        key={current.id}
        src={current.url}
        alt={current.alt ?? alt}
        fill
        sizes={sizes ?? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => go(-1, e)}
            aria-label="Ảnh trước"
            className="absolute left-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink opacity-0 shadow-raised transition-all hover:bg-white group-hover:opacity-100"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={(e) => go(1, e)}
            aria-label="Ảnh sau"
            className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink opacity-0 shadow-raised transition-all hover:bg-white group-hover:opacity-100"
          >
            <ChevronRight size={16} />
          </button>

          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
            {images.slice(0, Math.min(total, 6)).map((img, i) => (
              <button
                key={img.id}
                type="button"
                onClick={(e) => jumpTo(i, e)}
                aria-label={`Đi tới ảnh ${i + 1}`}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  i === safeIdx ? 'w-5 bg-white' : 'w-1.5 bg-white/60 hover:bg-white/90'
                )}
              />
            ))}
            {total > 6 && (
              <span className="ml-1 grid place-items-center text-[10px] font-semibold text-white">
                +{total - 6}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
