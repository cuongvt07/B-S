'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Edit3, Eye } from 'lucide-react';
import type { Listing } from '@/types';
import { Badge } from '@/components/ui';
import { meApi } from '@/lib/api/auth';
import { formatPrice, formatArea, formatTimeAgo } from '@/lib/utils/format';

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
    <div className="flex flex-col gap-3 rounded-md border border-brdr bg-white p-3 sm:flex-row">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm sm:h-24 sm:w-32 sm:flex-shrink-0">
        {cover ? (
          <Image src={cover.url} alt={listing.title} fill sizes="128px" className="object-cover" />
        ) : (
          <div className="h-full w-full bg-surface-subtle" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/tin-dang/${listing.slug}`}
            className="unstyled font-semibold text-ink hover:text-primary line-clamp-1"
          >
            {listing.title}
          </Link>
          <Badge variant={listing.status === 'active' ? 'success' : 'outline'}>
            {listing.status === 'active' ? 'Đang hiển thị' : listing.status}
          </Badge>
        </div>
        <p className="text-sm">
          <span className="font-semibold text-price">{formatPrice(listing.price, listing.priceUnit)}</span>
          <span className="ml-3 text-ink-muted">{formatArea(listing.area)}</span>
        </p>
        <p className="text-xs text-ink-muted">
          {listing.viewCount} lượt xem · Cập nhật {formatTimeAgo(listing.updatedAt)}
        </p>
        <div className="mt-1 flex gap-2">
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
              if (confirm('Xoá tin đăng này?')) del.mutate();
            }}
            disabled={del.isPending}
            className="inline-flex items-center gap-1 rounded-sm border border-brdr px-2 py-1 text-xs text-ink hover:border-danger hover:text-danger disabled:opacity-50"
          >
            <Trash2 size={12} /> Xoá
          </button>
        </div>
      </div>
    </div>
  );
}
