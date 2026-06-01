import type { Listing } from '@/types';
import { ListingCard } from './ListingCard';
import { ListingCardSkeleton } from './ListingCardSkeleton';

interface Props {
  listings?: Listing[];
  loading?: boolean;
  skeletonCount?: number;
  empty?: React.ReactNode;
}

export function ListingGrid({ listings, loading, skeletonCount = 6, empty }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ListingCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  if (!listings || listings.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-brdr p-8 text-center text-ink-muted">
        {empty ?? 'Chưa có tin đăng nào phù hợp.'}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((l) => (
        <ListingCard key={l.id} listing={l} />
      ))}
    </div>
  );
}
