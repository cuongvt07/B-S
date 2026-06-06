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
          <h1 className="text-2xl font-semibold text-ink">Tin yeu thich</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Theo doi cac tin dang da luu va lien he lai khi can.
          </p>
        </div>
      </header>

      {favorites.isError ? (
        <EmptyState
          icon={Heart}
          title="Chua tai duoc danh sach yeu thich"
          description="Hay dang nhap lai hoac kiem tra ket noi voi API."
          action={
            <Link
              href="/tin-dang"
              className="unstyled inline-flex items-center justify-center rounded-sm bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-hover"
            >
              Xem tin dang
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
              title="Chua co tin yeu thich"
              description="Bam bieu tuong trai tim tren tin dang de luu vao day."
              action={
                <Link
                  href="/tin-dang"
                  className="unstyled inline-flex items-center justify-center rounded-sm bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-hover"
                >
                  Tim tin dang
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
