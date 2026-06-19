'use client';

import Link from 'next/link';
import { memo, useState, type MouseEvent } from 'react';
import { MapPin, Maximize2, BedDouble, Star } from 'lucide-react';
import type { Listing } from '@/types';
import { Badge } from '@/components/ui';
import { formatPrice, formatArea, formatTimeAgo } from '@/lib/utils/format';
import { formatLocation } from '@/mocks/data/cities';
import { FavoriteButton } from './FavoriteButton';
import { ListingQuickView } from './ListingQuickView';
import { AddToCompareButton } from './AddToCompareButton';
import { ListingImageCarousel } from './ListingImageCarousel';

const STATUS_LABELS: Record<Listing['status'], string> = {
  active: 'Đang hiển thị',
  pending: 'Chờ duyệt',
  expired: 'Hết hạn',
  sold: 'Đã giao dịch',
};

export const ListingCard = memo(function ListingCard({
  listing,
  priority,
}: {
  listing: Listing;
  /** Hint to load image eagerly (above-the-fold). */
  priority?: boolean;
}) {
  const isVip = listing.vipTier !== 'normal';
  const href = `/tin-dang/${listing.slug}`;
  const [quickOpen, setQuickOpen] = useState(false);
  const hasMultipleImages = listing.images.length > 1;

  function openQuick(e: MouseEvent) {
    if (e.metaKey || e.ctrlKey || e.button === 1) return;
    e.preventDefault();
    setQuickOpen(true);
  }

  return (
    <>
      <article className="group flex h-full w-full min-w-0 flex-col overflow-hidden rounded-md border border-brdr bg-white shadow-raised transition-shadow hover:shadow-elevated">
        <Link
          href={href}
          onClick={openQuick}
          aria-label={listing.title}
          className="listing-card__media unstyled relative block aspect-[4/3] shrink-0 overflow-hidden"
        >
          <ListingImageCarousel images={listing.images} alt={listing.title} priority={priority} />

          {isVip && (
            <div className="pointer-events-none absolute left-2 top-2 z-10">
              <Badge variant="vip">
                <Star size={12} fill="currentColor" />
                VIP {listing.vipTier.replace('vip', '')}
              </Badge>
            </div>
          )}
          <FavoriteButton
            listingId={listing.id}
            initialActive={listing.isFavorited}
            className="absolute right-2 top-2 z-10"
          />
          <AddToCompareButton listingId={listing.id} className="absolute right-12 top-2 z-10" />
          {listing.status !== 'active' && (
            <div className="pointer-events-none absolute left-2 bottom-2 z-10">
              <Badge variant={listing.status === 'sold' ? 'danger' : 'outline'} className="bg-white/90">
                {STATUS_LABELS[listing.status]}
              </Badge>
            </div>
          )}
          {hasMultipleImages && (
            <div className="pointer-events-none absolute right-2 top-12 z-10 rounded-sm bg-black/60 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
              {listing.images.length} ảnh
            </div>
          )}
        </Link>

        <div className="flex flex-1 flex-col gap-2 p-3">
          <Link
            href={href}
            onClick={openQuick}
            className="unstyled min-h-[48px] text-base font-semibold text-ink hover:text-primary line-clamp-2"
          >
            {listing.title}
          </Link>

          <div className="flex min-w-0 items-center gap-2 text-sm">
            <span className="truncate font-semibold text-price">
              {formatPrice(listing.price, listing.priceUnit)}
            </span>
            <span className="text-ink-muted">·</span>
            <span className="inline-flex shrink-0 items-center gap-1 text-ink-muted">
              <Maximize2 size={14} /> {formatArea(listing.area)}
            </span>
            {listing.bedrooms ? (
              <>
                <span className="text-ink-muted">·</span>
                <span className="inline-flex shrink-0 items-center gap-1 text-ink-muted">
                  <BedDouble size={14} /> {listing.bedrooms} PN
                </span>
              </>
            ) : null}
          </div>

          <p className="flex min-w-0 items-center gap-1 text-xs leading-5 text-ink-muted">
            <MapPin size={14} className="flex-shrink-0" aria-hidden="true" />
            <span className="truncate">
              {formatLocation(listing.cityCode, listing.districtCode, listing.wardName)}
            </span>
          </p>

          <div className="mt-auto flex min-w-0 items-center justify-between gap-2 text-xs text-ink-muted">
            <div className="flex min-w-0 gap-1 overflow-hidden">
              {listing.tags.slice(0, 2).map((t) => (
                <Badge key={t} variant="outline">
                  {t}
                </Badge>
              ))}
            </div>
            <span className="shrink-0">{formatTimeAgo(listing.createdAt)}</span>
          </div>
        </div>
      </article>

      {quickOpen ? (
        <ListingQuickView open onClose={() => setQuickOpen(false)} listing={listing} />
      ) : null}
    </>
  );
});
