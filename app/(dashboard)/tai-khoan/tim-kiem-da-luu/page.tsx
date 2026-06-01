'use client';

import Link from 'next/link';
import { Bookmark, Trash2 } from 'lucide-react';
import { useSavedSearches } from '@/lib/hooks/useSavedSearches';
import { Badge, Button, Card, EmptyState, Skeleton } from '@/components/ui';
import { formatTimeAgo } from '@/lib/utils/format';
import {
  PROPERTY_TYPE_LABELS,
  DIRECTION_LABELS,
  FURNISH_LABELS,
} from '@/lib/constants';
import { cityByCode } from '@/mocks/data/cities';

function translateParam(key: string, value: string): { label: string; value: string } {
  switch (key) {
    case 'q':
      return { label: 'Từ khoá', value };
    case 'transactionType':
      return { label: 'Giao dịch', value: value === 'rent' ? 'Cho thuê' : 'Mua bán' };
    case 'propertyType':
      return {
        label: 'Loại BĐS',
        value: PROPERTY_TYPE_LABELS[value as keyof typeof PROPERTY_TYPE_LABELS] ?? value,
      };
    case 'cityCode':
      return { label: 'Tỉnh/TP', value: cityByCode.get(value)?.name ?? value };
    case 'districtCode':
      return { label: 'Quận/Huyện', value };
    case 'priceMin':
      return { label: 'Giá từ', value };
    case 'priceMax':
      return { label: 'Giá đến', value };
    case 'areaMin':
      return { label: 'Diện tích từ', value };
    case 'areaMax':
      return { label: 'Diện tích đến', value };
    case 'bedrooms':
      return { label: 'Phòng ngủ', value: `${value}+` };
    case 'direction':
      return {
        label: 'Hướng',
        value: DIRECTION_LABELS[value as keyof typeof DIRECTION_LABELS] ?? value,
      };
    case 'furnish':
      return {
        label: 'Nội thất',
        value: FURNISH_LABELS[value as keyof typeof FURNISH_LABELS] ?? value,
      };
    case 'vipOnly':
      return { label: 'VIP', value: value === 'true' ? 'Có' : '' };
    case 'sort':
      return { label: 'Sắp xếp', value };
    default:
      return { label: key, value };
  }
}

export default function SavedSearchesPage() {
  const { items, remove, hydrated } = useSavedSearches();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-ink">Tìm kiếm đã lưu</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Theo dõi các bộ lọc tìm kiếm bạn quan tâm
        </p>
      </header>

      {!hydrated ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} padded>
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="mt-3 h-4 w-2/3" />
              <Skeleton className="mt-2 h-8 w-32" />
            </Card>
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card padded className="!p-0">
          <EmptyState
            icon={Bookmark}
            title="Bạn chưa lưu tìm kiếm nào"
            description="Vào trang tìm kiếm, đặt bộ lọc và bấm 'Lưu tìm kiếm' để theo dõi."
            action={
              <Link href="/tin-dang" className="unstyled">
                <Button>Bắt đầu tìm kiếm</Button>
              </Link>
            }
          />
        </Card>
      ) : (
        <ul className="space-y-3">
          {items.map((it) => (
            <Card key={it.id} padded>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{it.label}</p>
                  <p className="text-xs text-ink-muted">Đã lưu {formatTimeAgo(it.createdAt)}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {Object.entries(it.params).map(([k, v]) => {
                  const t = translateParam(k, v);
                  if (!t.value) return null;
                  return (
                    <Badge key={k} variant="outline">
                      {t.label}: {t.value}
                    </Badge>
                  );
                })}
              </div>
              <div className="mt-4 flex gap-2">
                <Link
                  href={`/tin-dang?${new URLSearchParams(it.params).toString()}`}
                  className="unstyled"
                >
                  <Button variant="outline" size="sm">
                    Xem kết quả
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Trash2 size={14} />}
                  onClick={() => {
                    if (confirm('Xoá tìm kiếm này?')) remove(it.id);
                  }}
                >
                  Xoá
                </Button>
              </div>
            </Card>
          ))}
        </ul>
      )}
    </div>
  );
}
