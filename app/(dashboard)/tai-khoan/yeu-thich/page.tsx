'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import { EmptyState } from '@/components/ui';
import { ListingGrid } from '@/components/listing';
import { meApi } from '@/lib/api/auth';

export default function FavoritesPage() {
  const favorites = useQuery({
    queryKey: ['me', 'favorites'],
    queryFn: () => meApi.listFavorites(),
    retry: 1,
  });

  const listings = favorites.data?.data ?? [];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Tin yêu thích</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Theo dõi các tin đăng đã lưu và liên hệ lại khi cần.
          </p>
        </div>
      </header>

      {favorites.isError ? (
        <EmptyState
          icon={Heart}
          title="Chưa tải được danh sách yêu thích"
          description="Hãy đăng nhập lại hoặc kiểm tra kết nối với API."
          action={
            <Link
              href="/tin-dang"
              className="unstyled inline-flex items-center justify-center rounded-sm bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-hover"
            >
              Xem tin đăng
            </Link>
          }
        />
      ) : (
        <ListingGrid
          listings={listings}
          loading={favorites.isLoading}
          empty={
            <EmptyState
              icon={Heart}
              title="Chưa có tin yêu thích"
              description="Bấm biểu tượng trái tim trên tin đăng để lưu vào đây."
              action={
                <Link
                  href="/tin-dang"
                  className="unstyled inline-flex items-center justify-center rounded-sm bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-hover"
                >
                  Tìm tin đăng
                </Link>
              }
              size="sm"
            />
          }
        />
      )}
    </div>
  );
}
