import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Calendar, Gauge, Settings2, Star } from '@/components/icons';
import type { Vehicle } from '@/types';
import { Badge } from '@/components/ui';
import { formatPrice, formatNumber, formatTimeAgo } from '@/lib/utils/format';

export function VehicleCard({ vehicle, priority }: { vehicle: Vehicle; priority?: boolean }) {
  const isVip = vehicle.vipTier !== 'normal';
  const href = `/xe/${vehicle.slug}`;
  const cover = vehicle.images[0]?.url;
  const location = [vehicle.districtName, vehicle.cityName].filter(Boolean).join(', ');

  return (
    <article className="group flex h-full w-full min-w-0 flex-col overflow-hidden rounded-md border border-brdr bg-white shadow-raised transition-shadow hover:shadow-elevated">
      <Link
        href={href}
        aria-label={vehicle.title}
        className="unstyled relative block aspect-[4/3] shrink-0 overflow-hidden bg-surface-subtle"
      >
        {cover ? (
          <Image
            src={cover}
            alt={vehicle.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform group-hover:scale-105"
            priority={priority}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-muted text-sm">Không có ảnh</div>
        )}
        {isVip && (
          <div className="pointer-events-none absolute left-2 top-2 z-10">
            <Badge variant="vip">
              <Star size={12} fill="currentColor" />
              VIP {vehicle.vipTier.replace('vip', '')}
            </Badge>
          </div>
        )}
        <div className="pointer-events-none absolute right-2 top-2 z-10">
          <Badge variant="outline" className="bg-white/90">
            {vehicle.vehicleTypeLabel}
          </Badge>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <Link
          href={href}
          className="unstyled min-h-[48px] text-base font-semibold text-ink hover:text-primary line-clamp-2"
        >
          {vehicle.title}
        </Link>

        <span className="truncate text-sm font-semibold text-price">
          {vehicle.price > 0 ? formatPrice(vehicle.price, 'total') : 'Thỏa thuận'}
        </span>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
          {vehicle.year ? (
            <span className="inline-flex items-center gap-1">
              <Calendar size={13} /> {vehicle.year}
            </span>
          ) : null}
          {vehicle.mileage !== undefined ? (
            <span className="inline-flex items-center gap-1">
              <Gauge size={13} /> {formatNumber(vehicle.mileage)} km
            </span>
          ) : null}
          {vehicle.transmissionLabel ? (
            <span className="inline-flex items-center gap-1">
              <Settings2 size={13} /> {vehicle.transmissionLabel}
            </span>
          ) : null}
        </div>

        {location && (
          <p className="flex min-w-0 items-center gap-1 text-xs leading-5 text-ink-muted">
            <MapPin size={14} className="flex-shrink-0" aria-hidden="true" />
            <span className="truncate">{location}</span>
          </p>
        )}

        <div className="mt-auto flex items-center justify-end text-xs text-ink-muted">
          <span className="shrink-0">{formatTimeAgo(vehicle.createdAt)}</span>
        </div>
      </div>
    </article>
  );
}
