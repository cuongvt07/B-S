'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Edit3, Eye } from 'lucide-react';
import type { Vehicle } from '@/types';
import { Badge } from '@/components/ui';
import { vehicleApi } from '@/lib/api/vehicles';
import { formatPrice, formatNumber, formatTimeAgo } from '@/lib/utils/format';

const STATUS_LABELS: Record<Vehicle['status'], string> = {
  active: 'Đang hiển thị',
  pending: 'Chờ duyệt',
  expired: 'Hết hạn',
  sold: 'Đã bán',
  rejected: 'Bị từ chối',
};

export function MyVehicleRow({ vehicle }: { vehicle: Vehicle }) {
  const qc = useQueryClient();
  const cover = vehicle.images.find((i) => i.isPrimary) ?? vehicle.images[0];

  const del = useMutation({
    mutationFn: () => vehicleApi.remove(vehicle.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['me', 'vehicles'] });
    },
  });

  const specs = [
    vehicle.year ? String(vehicle.year) : null,
    vehicle.mileage !== undefined ? `${formatNumber(vehicle.mileage)} km` : null,
    vehicle.transmissionLabel ?? null,
  ].filter(Boolean);

  return (
    <article className="flex min-h-[144px] flex-col gap-4 bg-white py-4 sm:flex-row">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm bg-surface-subtle sm:h-28 sm:w-40 sm:flex-shrink-0">
        {cover ? (
          <Image
            src={cover.url}
            alt={vehicle.title}
            fill
            sizes="(min-width: 640px) 160px, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-surface-subtle" />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/xe/${vehicle.slug}`}
            className="unstyled min-w-0 font-semibold text-ink hover:text-primary line-clamp-2"
          >
            {vehicle.title}
          </Link>
          <Badge
            className="shrink-0"
            variant={vehicle.status === 'active' ? 'success' : vehicle.status === 'sold' || vehicle.status === 'rejected' ? 'danger' : 'outline'}
          >
            {STATUS_LABELS[vehicle.status]}
          </Badge>
        </div>
        <p className="text-sm">
          <span className="font-semibold text-price">
            {vehicle.price > 0 ? formatPrice(vehicle.price, 'total') : 'Thỏa thuận'}
          </span>
          {specs.length > 0 && <span className="ml-3 text-ink-muted">{specs.join(' · ')}</span>}
        </p>
        <p className="text-xs text-ink-muted">
          {vehicle.viewCount} lượt xem · Cập nhật {formatTimeAgo(vehicle.updatedAt)}
        </p>
        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          <Link
            href={`/xe/${vehicle.slug}`}
            className="unstyled inline-flex items-center gap-1 rounded-sm border border-brdr px-2 py-1 text-xs text-ink hover:border-primary"
          >
            <Eye size={12} /> Xem
          </Link>
          <Link
            href={`/tai-khoan/dang-tin-xe?edit=${vehicle.id}`}
            className="unstyled inline-flex items-center gap-1 rounded-sm border border-brdr px-2 py-1 text-xs text-ink hover:border-primary"
          >
            <Edit3 size={12} /> Sửa
          </Link>
          <button
            type="button"
            onClick={() => {
              if (confirm('Xóa tin xe này?')) del.mutate();
            }}
            disabled={del.isPending}
            className="inline-flex items-center gap-1 rounded-sm border border-brdr px-2 py-1 text-xs text-ink hover:border-danger hover:text-danger disabled:opacity-50"
          >
            <Trash2 size={12} /> Xóa
          </button>
        </div>
      </div>
    </article>
  );
}
