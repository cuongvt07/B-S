'use client';

import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Heart } from '@/components/icons';
import { cn } from '@/lib/utils';
import { meApi } from '@/lib/api/auth';

export function FavoriteButton({
  listingId,
  initialActive = false,
  className,
}: {
  listingId: string;
  initialActive?: boolean;
  className?: string;
}) {
  const [active, setActive] = useState(initialActive);
  const [pending, setPending] = useState(false);
  const qc = useQueryClient();

  useEffect(() => {
    setActive(initialActive);
  }, [initialActive]);

  return (
    <button
      type="button"
      aria-label={active ? 'Bỏ yêu thích' : 'Yêu thích'}
      disabled={pending}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (pending) return;
        const next = !active;
        setActive(next);
        setPending(true);
        meApi
          .toggleFavorite(listingId)
          .then((res) => {
            setActive(res.data.favorited);
            qc.invalidateQueries({ queryKey: ['me', 'favorites'] });
          })
          .catch(() => {
            setActive(!next);
          })
          .finally(() => {
            setPending(false);
          });
      }}
      className={cn(
        'grid h-8 w-8 place-items-center rounded-full bg-white/90 shadow-raised hover:text-danger disabled:cursor-wait',
        active ? 'text-danger' : 'text-ink',
        pending && 'opacity-70',
        className
      )}
    >
      <Heart size={16} weight={active ? 'fill' : 'regular'} />
    </button>
  );
}
