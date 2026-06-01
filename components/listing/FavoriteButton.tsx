'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FavoriteButton({ listingId, className }: { listingId: string; className?: string }) {
  const [active, setActive] = useState(false);
  return (
    <button
      type="button"
      aria-label={active ? 'Bỏ yêu thích' : 'Yêu thích'}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setActive((v) => !v);
        // TODO: mutate favorites API when auth wired (P5)
        void listingId;
      }}
      className={cn(
        'grid h-8 w-8 place-items-center rounded-full bg-white/90 shadow-raised hover:text-danger',
        active ? 'text-danger' : 'text-ink',
        className
      )}
    >
      <Heart size={16} fill={active ? 'currentColor' : 'none'} />
    </button>
  );
}
