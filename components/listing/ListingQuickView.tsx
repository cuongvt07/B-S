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
import {
  formatPrice,
  formatArea,
  formatTimeAgo,
  formatNumber,
} from '@/lib/utils/format';
import { formatLocation } from '@/mocks/data/cities';
import { DIRECTION_LABELS, FURNISH_LABELS, PROPERTY_TYPE_LABELS } from '@/lib/constants';
import { AuthGate } from '@/components/auth';
import { ContactActions } from './ContactActions';
import { ListingImageCarousel } from './ListingImageCarousel';

interface Props {
  open: boolean;
  onClose: () => void;
  listing: Listing;
}

export function ListingQuickView({ open, onClose, listing }: Props) {
  const href = `/tin-dang/${listing.slug}`;
  const ownerHref = `/nguoi-dang/${listing.ownerId}`;

  const footer = (
    <>
      <AuthGate title="Đăng nhập để liên hệ" blur="sm">
        <ContactActions contact={listing.contact} size="md" showLabels />
      </AuthGate>
      <Link href={href} onClick={onClose} className="unstyled">
        <Button rightIcon={<ArrowRight size={16} />}>Xem chi tiết</Button>
      </Link>
    </>
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
        {/* Gallery with carousel */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-brdr group">
          <ListingImageCarousel images={listing.images} alt={listing.title} sizes="500px" />
          {listing.vipTier !== 'normal' && (
            <div className="pointer-events-none absolute left-3 top-3 z-10">
              <Badge variant="vip">
                <Star size={12} fill="currentColor" />
                VIP {listing.vipTier.replace('vip', '')}
              </Badge>
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

          <p className="text-sm leading-relaxed text-ink line-clamp-4">
            {listing.description}
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
            <span>{formatTimeAgo(listing.createdAt)}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <Eye size={12} /> {formatNumber(listing.viewCount)} lượt xem
            </span>
          </div>
        </div>
      </div>

      {/* Owner info block */}
      <div className="mt-5 rounded-md border border-brdr bg-surface-subtle p-4">
        <div className="flex flex-wrap items-center gap-3">
          {listing.contact.avatarUrl ? (
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-brdr bg-white">
              <Image
                src={listing.contact.avatarUrl}
                alt={listing.contact.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-base font-semibold text-ink-muted">
              {listing.contact.name.charAt(0)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <Link
              href={ownerHref}
              onClick={onClose}
              className="unstyled font-semibold text-ink hover:text-primary"
            >
              {listing.contact.name}
            </Link>
            <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-ink-muted">
              <span className="inline-flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-price" />
                Đang hoạt động
              </span>
              <span>·</span>
              <span>Phản hồi: 92%</span>
              <span>·</span>
              <Link
                href={ownerHref}
                onClick={onClose}
                className="unstyled text-primary hover:underline"
              >
                Xem tin khác
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
