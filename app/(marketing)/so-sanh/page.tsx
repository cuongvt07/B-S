'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQueries } from '@tanstack/react-query';
import { X } from '@/components/icons';
import { useCompare } from '@/lib/hooks/useCompare';
import { listingApi } from '@/lib/api/listings';
import { GitCompare } from '@/components/icons';
import { Badge, Button, Card, EmptyState, Skeleton } from '@/components/ui';
import { Breadcrumbs } from '@/components/seo';
import {
  formatPrice,
  formatArea,
  formatTimeAgo,
} from '@/lib/utils/format';
import { formatLocation } from '@/mocks/data/cities';
import {
  PROPERTY_TYPE_LABELS,
  DIRECTION_LABELS,
  FURNISH_LABELS,
} from '@/lib/constants';
import type { Listing } from '@/types';
import { useCurrentUser } from '@/lib/hooks/useAuth';
import { useAuthModal } from '@/lib/hooks/useAuthModal';

export default function ComparePage() {
  const ids = useCompare((s) => s.ids);
  const toggle = useCompare((s) => s.toggle);
  const clear = useCompare((s) => s.clear);

  const queries = useQueries({
    queries: ids.map((id) => ({
      queryKey: ['listings', 'detail', id],
      queryFn: () => listingApi.get(id).then((r) => r.data),
    })),
  });

  const listings: (Listing | undefined)[] = queries.map((q) => q.data);

  if (!ids.length) {
    return (
      <div className="container-app py-8">
        <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: 'So sánh tin đăng' }]} />
        <Card padded className="mx-auto mt-8 max-w-md !p-0">
          <EmptyState
            icon={GitCompare}
            title="Chưa có tin đăng nào để so sánh"
            description="Bấm nút so sánh trên thẻ tin (góc trên phải) để thêm tối đa 3 tin vào danh sách."
            action={
              <Link href="/tin-dang" className="unstyled">
                <Button>Khám phá tin đăng</Button>
              </Link>
            }
          />
        </Card>
      </div>
    );
  }

  const rows: { label: string; render: (l: Listing) => React.ReactNode }[] = [
    {
      label: 'Giá',
      render: (l) => (
        <span className="font-semibold text-price">{formatPrice(l.price, l.priceUnit)}</span>
      ),
    },
    { label: 'Diện tích', render: (l) => formatArea(l.area) },
    { label: 'Phòng ngủ', render: (l) => l.bedrooms ?? '—' },
    { label: 'Phòng tắm', render: (l) => l.bathrooms ?? '—' },
    { label: 'Hướng', render: (l) => (l.direction ? DIRECTION_LABELS[l.direction] : '—') },
    { label: 'Nội thất', render: (l) => (l.furnish ? FURNISH_LABELS[l.furnish] : '—') },
    {
      label: 'Khu vực',
      render: (l) => formatLocation(l.cityCode, l.districtCode, l.wardName),
    },
    { label: 'Loại BĐS', render: (l) => PROPERTY_TYPE_LABELS[l.propertyType] },
    {
      label: 'Giao dịch',
      render: (l) => (l.transactionType === 'rent' ? 'Cho thuê' : 'Mua bán'),
    },
    {
      label: 'VIP',
      render: (l) =>
        l.vipTier !== 'normal' ? (
          <Badge variant="vip">VIP {l.vipTier.replace('vip', '')}</Badge>
        ) : (
          '—'
        ),
    },
    { label: 'Người đăng', render: (l) => l.contact.name },
    {
      label: 'Liên hệ',
      render: (l) => <ComparePhoneCell phone={l.contact.phone} />,
    },
    { label: 'Đăng cách đây', render: (l) => formatTimeAgo(l.createdAt) },
    {
      label: 'Hành động',
      render: (l) => (
        <Link
          href={`/tin-dang/${l.slug}`}
          className="unstyled text-sm font-semibold text-primary"
        >
          Xem chi tiết →
        </Link>
      ),
    },
  ];

  return (
    <div className="container-app py-8">
      <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: 'So sánh tin đăng' }]} />
      <header className="mt-4 mb-2">
        <h1 className="text-2xl font-semibold text-ink">So sánh tin đăng</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Đối chiếu giá, diện tích, tiện ích giữa các tin đăng đã chọn.
        </p>
      </header>

      <div className="mt-6 overflow-x-auto rounded-md border border-brdr bg-white">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 w-40 border border-brdr bg-surface-subtle p-3 text-left">
                Tiêu chí
              </th>
              {ids.map((id, idx) => {
                const listing = listings[idx];
                const loading = queries[idx].isLoading;
                return (
                  <th
                    key={id}
                    className="relative min-w-[220px] border border-brdr p-3 text-left align-top"
                  >
                    <button
                      type="button"
                      onClick={() => toggle(id)}
                      aria-label="Bỏ khỏi so sánh"
                      className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/90 shadow-raised hover:bg-danger hover:text-white"
                    >
                      <X size={14} />
                    </button>
                    {loading ? (
                      <>
                        <Skeleton className="h-28 w-full" />
                        <Skeleton className="mt-2 h-4 w-3/4" />
                      </>
                    ) : listing ? (
                      <>
                        <div className="relative h-28 w-full overflow-hidden rounded-sm">
                          {listing.images[0]?.url && (
                            <Image
                              src={listing.images[0].url}
                              alt={listing.title}
                              fill
                              sizes="(max-width: 768px) 50vw, 25vw"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <Link
                          href={`/tin-dang/${listing.slug}`}
                          className="unstyled mt-2 line-clamp-2 block font-semibold text-ink hover:text-primary"
                        >
                          {listing.title}
                        </Link>
                      </>
                    ) : (
                      <p className="text-xs text-ink-muted">Không tải được tin</p>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label}>
                <td className="sticky left-0 z-10 w-40 border border-brdr bg-surface-subtle p-3 font-semibold text-ink">
                  {r.label}
                </td>
                {ids.map((id, idx) => {
                  const listing = listings[idx];
                  const loading = queries[idx].isLoading;
                  return (
                    <td key={id} className="border border-brdr p-3 align-top text-ink">
                      {loading ? <Skeleton className="h-4 w-full" /> : listing ? r.render(listing) : '—'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <Button variant="ghost" onClick={clear}>
          Xoá tất cả khỏi so sánh
        </Button>
      </div>
    </div>
  );
}

function ComparePhoneCell({ phone }: { phone: string }) {
  const { data: user } = useCurrentUser();
  const openLogin = useAuthModal((s) => s.openLogin);
  if (user) {
    return (
      <a href={`tel:${phone}`} className="text-primary">
        {phone}
      </a>
    );
  }
  const masked = phone.replace(/\d{3}(?=\d{3}$)/, '***');
  return (
    <button
      type="button"
      onClick={() => openLogin()}
      className="text-primary underline decoration-dotted underline-offset-2 hover:text-primary-hover"
    >
      {masked} · Đăng nhập
    </button>
  );
}
