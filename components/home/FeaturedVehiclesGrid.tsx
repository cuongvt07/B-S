import Link from 'next/link';
import { ArrowRight, Car, Bike } from '@/components/icons';
import type { Vehicle } from '@/types';
import { VehicleCard } from '@/components/vehicle';
import { CardCarousel } from '@/components/ui';

export function FeaturedVehiclesGrid({
  vehicles,
  title = 'Xe nổi bật',
  description = 'Ô tô & xe máy mới đăng — giá tốt, cập nhật liên tục',
  href = '/xe',
  showTypeLinks = false,
}: {
  vehicles: Vehicle[];
  title?: string;
  description?: string;
  href?: string;
  /** Hiện thêm 2 chip Ô tô / Xe máy bên cạnh "Xem tất cả". */
  showTypeLinks?: boolean;
}) {
  if (!vehicles.length) return null;

  return (
    <section className="container-app py-8">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold uppercase text-ink sm:text-2xl">{title}</h2>
          <p className="mt-1 text-sm text-ink-muted">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          {showTypeLinks && (
            <>
              <Link
                href="/xe?loai=car"
                className="unstyled hidden items-center gap-1 rounded-full border border-brdr px-3 py-1.5 text-sm font-medium text-ink hover:bg-surface-subtle sm:inline-flex"
              >
                <Car size={14} /> Ô tô
              </Link>
              <Link
                href="/xe?loai=motorbike"
                className="unstyled hidden items-center gap-1 rounded-full border border-brdr px-3 py-1.5 text-sm font-medium text-ink hover:bg-surface-subtle sm:inline-flex"
              >
                <Bike size={14} /> Xe máy
              </Link>
            </>
          )}
          <Link
            href={href}
            className="unstyled inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-hover"
          >
            Xem tất cả <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <CardCarousel items={vehicles.map((v) => <VehicleCard key={v.id} vehicle={v} />)} />
    </section>
  );
}
