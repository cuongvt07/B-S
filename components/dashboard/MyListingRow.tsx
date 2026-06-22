'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Edit3, Eye } from 'lucide-react';
import type { Listing } from '@/types';
import { Badge } from '@/components/ui';
import { meApi } from '@/lib/api/auth';
import { formatPrice, formatArea, formatTimeAgo } from '@/lib/utils/format';

const STATUS_LABELS: Record<Listing['status'], string> = {
  active: 'Đang hiển thị',
  pending: 'Chờ duyệt',
  expired: 'Hết hạn',
  sold: 'Đã giao dịch',
  rejected: 'Bị từ chối',
};

export function MyListingRow({ listing }: { listing: Listing }) {
  const qc = useQueryClient();
  const cover = listing.images.find((i) => i.isPrimary) ?? listing.images[0];

  const del = useMutation({
    mutationFn: () => meApi.deleteListing(listing.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['me', 'listings'] });
    },
  });

  return (
    <article className="flex min-h-[144px] flex-col gap-4 bg-white py-4 sm:flex-row">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm bg-surface-subtle sm:h-28 sm:w-40 sm:flex-shrink-0">
        {cover ? (
          <Image
            src={cover.url}
            alt={listing.title}
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
            href={`/tin-dang/${listing.slug}`}
            className="unstyled min-w-0 font-semibold text-ink hover:text-primary line-clamp-2"
          >
            {listing.title}
          </Link>
          <Badge className="shrink-0" variant={listing.status === 'active' ? 'success' : listing.status === 'sold' || listing.status === 'rejected' ? 'danger' : 'outline'}>
            {STATUS_LABELS[listing.status]}
          </Badge>
        </div>
        {listing.status === 'rejected' && listing.rejectionReason && (
          <div className="rounded-sm border border-danger/30 bg-danger-soft px-3 py-2 text-xs text-danger">
            <span className="font-semibold">Lý do từ chối:</span> {listing.rejectionReason}
          </div>
        )}
        <p className="text-sm">
          <span className="font-semibold text-price">{formatPrice(listing.price, listing.priceUnit)}</span>
          <span className="ml-3 text-ink-muted">{formatArea(listing.area)}</span>
        </p>
        <p className="text-xs text-ink-muted">
          {listing.viewCount} lượt xem - Cập nhật {formatTimeAgo(listing.updatedAt)}
        </p>
        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          <Link
            href={`/tin-dang/${listing.slug}`}
            className="unstyled inline-flex items-center gap-1 rounded-sm border border-brdr px-2 py-1 text-xs text-ink hover:border-primary"
          >
            <Eye size={12} /> Xem
          </Link>
          <Link
            href={`/tai-khoan/dang-tin?edit=${listing.id}`}
            className="unstyled inline-flex items-center gap-1 rounded-sm border border-brdr px-2 py-1 text-xs text-ink hover:border-primary"
          >
            <Edit3 size={12} /> Sửa
          </Link>
          <button
            type="button"
            onClick={() => {
              if (confirm('Xóa tin đăng này?')) del.mutate();
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
