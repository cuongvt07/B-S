'use client';

import { useQuery } from '@tanstack/react-query';
import { useRecentlyViewed } from '@/lib/hooks/useRecentlyViewed';
import { listingApi } from '@/lib/api/listings';
import { ListingSlider } from './ListingSlider';
import { ListingCardSkeleton } from './ListingCardSkeleton';

interface Props {
  excludeId?: string;
}

export function RecentlyViewed({ excludeId }: Props) {
  const { ids, hydrated } = useRecentlyViewed();
  const filtered = excludeId ? ids.filter((id) => id !== excludeId) : ids;

  const { data, isLoading } = useQuery({
    queryKey: ['recently-viewed', filtered],
    queryFn: () =>
      Promise.all(filtered.map((id) => listingApi.get(id))).then((rs) => rs.map((r) => r.data)),
    enabled: filtered.length > 0,
  });

  if (!hydrated) return null;
  if (filtered.length === 0) return null;

  return (
    <section className="container-app py-8">
      <div className="mb-4">
        <h2 className="text-xl font-semibold uppercase text-ink sm:text-2xl">Tin đã xem gần đây</h2>
        <p className="mt-1 text-sm text-ink-muted">Tiếp tục với những tin bạn đã quan tâm</p>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: Math.min(4, filtered.length) }).map((_, i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </div>
      ) : data && data.length > 0 ? (
        <ListingSlider listings={data} />
      ) : null}
    </section>
  );
}
