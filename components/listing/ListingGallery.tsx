'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from '@/components/icons';
import type { ListingImage } from '@/types';
import { cn } from '@/lib/utils';

export function ListingGallery({ images, title }: { images: ListingImage[]; title: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!images.length) {
    return (
      <div className="aspect-[16/9] rounded-md border border-brdr bg-surface-subtle" />
    );
  }

  const cur = images[active];

  function go(d: number) {
    setActive((i) => (i + d + images.length) % images.length);
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-[3fr_1fr]">
        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="relative block aspect-[16/10] overflow-hidden rounded-md border border-brdr"
        >
          <Image
            src={cur.url}
            alt={cur.alt ?? title}
            fill
            sizes="(max-width: 768px) 100vw, 75vw"
            className="object-cover"
            priority
          />
          <span className="absolute bottom-2 right-2 rounded-sm bg-black/60 px-2 py-0.5 text-xs text-white">
            {active + 1} / {images.length}
          </span>
        </button>
        <div className="hidden md:grid grid-rows-3 gap-2">
          {images.slice(1, 4).map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i + 1)}
              className={cn(
                'relative block overflow-hidden rounded-md border',
                active === i + 1 ? 'border-primary' : 'border-brdr'
              )}
            >
              <Image
                src={img.url}
                alt={img.alt ?? title}
                fill
                sizes="20vw"
                className="object-cover"
              />
              {i === 2 && images.length > 4 && (
                <span className="absolute inset-0 grid place-items-center bg-black/60 text-sm font-semibold text-white">
                  + {images.length - 4} ảnh
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/90 p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            aria-label="Đóng"
            onClick={() => setLightbox(false)}
            className="absolute right-4 top-4 text-white"
          >
            <X size={28} />
          </button>
          <button
            type="button"
            aria-label="Trước"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            className="absolute left-4 grid h-12 w-12 place-items-center rounded-full bg-white/20 text-white"
          >
            <ChevronLeft />
          </button>
          <div className="relative h-[80vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={cur.url}
              alt={cur.alt ?? title}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          <button
            type="button"
            aria-label="Sau"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            className="absolute right-4 grid h-12 w-12 place-items-center rounded-full bg-white/20 text-white"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </>
  );
}
