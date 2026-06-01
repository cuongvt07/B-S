'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Maximize2,
  BedDouble,
  Bath,
  Compass,
  Sofa,
  ArrowRight,
  Star,
  Eye,
} from 'lucide-react';
import { Modal, Badge, Button } from '@/components/ui';
import type { Listing } from '@/types';
import { formatPrice, formatArea, formatTimeAgo, formatNumber } from '@/lib/utils/format';
import { formatLocation } from '@/mocks/data/cities';
import { DIRECTION_LABELS, FURNISH_LABELS, PROPERTY_TYPE_LABELS } from '@/lib/constants';
import { ContactActions } from './ContactActions';

interface Props {
  open: boolean;
  onClose: () => void;
  listing: Listing;
}

export function ListingQuickView({ open, onClose, listing }: Props) {
  const cover = listing.images.find((i) => i.isPrimary) ?? listing.images[0];
  const href = `/tin-dang/${listing.slug}`;

  const footer = (
    <div className="flex w-full flex-wrap items-center justify-between gap-3">
      <ContactActions contact={listing.contact} size="md" showLabels />
      <Link href={href} onClick={onClose} className="unstyled">
        <Button rightIcon={<ArrowRight size={16} />}>Xem chi tiết</Button>
      </Link>
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Xem nhanh tin đăng"
      size="lg"
      footer={footer}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-[1.1fr_1fr]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-brdr">
          {cover && (
            <Image
              src={cover.url}
              alt={listing.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          )}
          {listing.vipTier !== 'normal' && (
            <div className="absolute left-3 top-3">
              <Badge variant="vip">
                <Star size={12} fill="currentColor" />
                VIP {listing.vipTier.replace('vip', '')}
              </Badge>
            </div>
          )}
          {listing.images.length > 1 && (
            <div className="absolute bottom-3 right-3 rounded-sm bg-black/60 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
              {listing.images.length} ảnh
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-1">
            <Badge variant="outline">{PROPERTY_TYPE_LABELS[listing.propertyType]}</Badge>
            <Badge variant="outline">
              {listing.transactionType === 'rent' ? 'Cho thuê' : 'Mua bán'}
            </Badge>
          </div>

          <h3 className="text-base font-semibold text-ink line-clamp-2 sm:text-lg">
            {listing.title}
          </h3>

          <p className="text-3xl font-semibold text-price">
            {formatPrice(listing.price, listing.priceUnit)}
          </p>

          <div className="grid grid-cols-2 gap-x-3 gap-y-2 rounded-sm border border-brdr bg-surface-subtle p-3 text-sm">
            <div className="inline-flex items-center gap-2 text-ink-muted">
              <Maximize2 size={14} />
              <span className="text-ink">{formatArea(listing.area)}</span>
            </div>
            {listing.bedrooms ? (
              <div className="inline-flex items-center gap-2 text-ink-muted">
                <BedDouble size={14} />
                <span className="text-ink">{listing.bedrooms} PN</span>
              </div>
            ) : null}
            {listing.bathrooms ? (
              <div className="inline-flex items-center gap-2 text-ink-muted">
                <Bath size={14} />
                <span className="text-ink">{listing.bathrooms} WC</span>
              </div>
            ) : null}
            {listing.direction ? (
              <div className="inline-flex items-center gap-2 text-ink-muted">
                <Compass size={14} />
                <span className="text-ink">{DIRECTION_LABELS[listing.direction]}</span>
              </div>
            ) : null}
            {listing.furnish ? (
              <div className="inline-flex items-center gap-2 text-ink-muted">
                <Sofa size={14} />
                <span className="text-ink">{FURNISH_LABELS[listing.furnish]}</span>
              </div>
            ) : null}
          </div>

          <p className="inline-flex items-start gap-1 text-sm text-ink-muted">
            <MapPin size={14} className="mt-0.5 flex-shrink-0" />
            <span>
              {listing.addressLine},{' '}
              {formatLocation(listing.cityCode, listing.districtCode, listing.wardName)}
            </span>
          </p>

          <p className="text-sm leading-relaxed text-ink line-clamp-4">{listing.description}</p>

          <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-brdr pt-3 text-xs text-ink-muted">
            <span>
              Đăng bởi <span className="font-semibold text-ink">{listing.contact.name}</span>
            </span>
            <span>·</span>
            <span>{formatTimeAgo(listing.createdAt)}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <Eye size={12} /> {formatNumber(listing.viewCount)} lượt xem
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
