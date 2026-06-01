'use client';

import Link from 'next/link';
import {
  X,
  MapPin,
  Maximize2,
  BedDouble,
  Bath,
  Compass,
  Sofa,
  ArrowRight,
  Eye,
  Star,
} from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import { ListingImageCarousel, ContactActions } from '@/components/listing';
import type { Listing } from '@/types';
import { formatPrice, formatArea, formatTimeAgo, formatNumber } from '@/lib/utils/format';
import { formatLocation } from '@/mocks/data/cities';
import { DIRECTION_LABELS, FURNISH_LABELS, PROPERTY_TYPE_LABELS } from '@/lib/constants';

interface Props {
  listing: Listing;
  onClose: () => void;
}

export function MapListingPanel({ listing, onClose }: Props) {
  const href = `/tin-dang/${listing.slug}`;

  return (
    <aside className="flex h-full flex-col overflow-hidden rounded-md border border-brdr bg-white shadow-elevated animate-slideInLeft">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-brdr px-3 py-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Chi tiết tin đăng
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="grid h-7 w-7 place-items-center rounded-sm text-ink-muted hover:bg-surface-subtle hover:text-ink"
        >
          <X size={16} />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Gallery */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <ListingImageCarousel images={listing.images} alt={listing.title} sizes="360px" />
          {listing.vipTier !== 'normal' && (
            <div className="pointer-events-none absolute left-2 top-2 z-10">
              <Badge variant="vip">
                <Star size={12} fill="currentColor" />
                VIP {listing.vipTier.replace('vip', '')}
              </Badge>
            </div>
          )}
        </div>

        <div className="space-y-3 p-4">
          <div className="flex flex-wrap items-center gap-1">
            <Badge variant="outline">{PROPERTY_TYPE_LABELS[listing.propertyType]}</Badge>
            <Badge variant="outline">
              {listing.transactionType === 'rent' ? 'Cho thuê' : 'Mua bán'}
            </Badge>
          </div>

          <Link
            href={href}
            className="unstyled block text-base font-semibold text-ink hover:text-primary line-clamp-2"
          >
            {listing.title}
          </Link>

          <p className="text-2xl font-semibold text-price">
            {formatPrice(listing.price, listing.priceUnit)}
          </p>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-2 rounded-sm border border-brdr bg-surface-subtle p-3 text-sm">
            <div className="inline-flex items-center gap-1.5 text-ink-muted">
              <Maximize2 size={14} />
              <span className="text-ink">{formatArea(listing.area)}</span>
            </div>
            {listing.bedrooms ? (
              <div className="inline-flex items-center gap-1.5 text-ink-muted">
                <BedDouble size={14} />
                <span className="text-ink">{listing.bedrooms} PN</span>
              </div>
            ) : null}
            {listing.bathrooms ? (
              <div className="inline-flex items-center gap-1.5 text-ink-muted">
                <Bath size={14} />
                <span className="text-ink">{listing.bathrooms} WC</span>
              </div>
            ) : null}
            {listing.direction ? (
              <div className="inline-flex items-center gap-1.5 text-ink-muted">
                <Compass size={14} />
                <span className="text-ink">{DIRECTION_LABELS[listing.direction]}</span>
              </div>
            ) : null}
            {listing.furnish ? (
              <div className="col-span-2 inline-flex items-center gap-1.5 text-ink-muted">
                <Sofa size={14} />
                <span className="text-ink">{FURNISH_LABELS[listing.furnish]}</span>
              </div>
            ) : null}
          </div>

          <p className="inline-flex items-start gap-1 text-xs text-ink-muted">
            <MapPin size={14} className="mt-0.5 flex-shrink-0" />
            <span>
              {listing.addressLine},{' '}
              {formatLocation(listing.cityCode, listing.districtCode, listing.wardName)}
            </span>
          </p>

          <p className="text-sm leading-relaxed text-ink line-clamp-4">{listing.description}</p>

          {listing.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {listing.tags.slice(0, 4).map((t) => (
                <Badge key={t} variant="outline">
                  {t}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 border-t border-brdr pt-3 text-xs text-ink-muted">
            <span>
              Đăng bởi <span className="font-semibold text-ink">{listing.contact.name}</span>
            </span>
            <span>·</span>
            <span>{formatTimeAgo(listing.createdAt)}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <Eye size={12} /> {formatNumber(listing.viewCount)}
            </span>
          </div>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="border-t border-brdr bg-white p-3 space-y-2">
        <ContactActions contact={listing.contact} size="md" fullWidth showLabels />
        <Link href={href} className="unstyled block">
          <Button fullWidth rightIcon={<ArrowRight size={16} />}>
            Xem chi tiết
          </Button>
        </Link>
      </div>
    </aside>
  );
}
