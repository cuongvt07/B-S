import { Fragment } from 'react';
import type { Listing } from '@/types';
import { CashbackAd } from '@/components/ads';
import { ListingCard } from './ListingCard';
import { ListingCardSkeleton } from './ListingCardSkeleton';

interface Props {
  listings?: Listing[];
  loading?: boolean;
  skeletonCount?: number;
  empty?: React.ReactNode;
  /** Number of cards to load with `priority` (above-the-fold). Default 0. */
  priorityCount?: number;
  /** Xác suất chèn khối quảng cáo Săn Cashback sau hàng tin đầu tiên. */
  adChance?: number;
}

const AD_AFTER_INDEX = 2;

export function ListingGrid({
  listings,
  loading,
  skeletonCount = 6,
  empty,
  priorityCount = 0,
  adChance,
}: Props) {
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
      {listings.map((l, i) => (
        <Fragment key={l.id}>
          <ListingCard listing={l} priority={i < priorityCount} />
          {adChance !== undefined && i === Math.min(AD_AFTER_INDEX, listings.length - 1) && (
            <CashbackAd chance={adChance} limit={2} className="my-0" />
          )}
        </Fragment>
      ))}
    </div>
  );
}
