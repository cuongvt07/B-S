'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { PlusCircle, FileText } from 'lucide-react';
import { Button, Card, EmptyState, Spinner } from '@/components/ui';
import { MyListingRow } from '@/components/dashboard';
import { meApi } from '@/lib/api/auth';

export default function MyListingsPage() {
  const listings = useQuery({
    queryKey: ['me', 'listings'],
    queryFn: () => meApi.listListings(),
    retry: 1,
  });

  const myListings = listings.data?.data ?? [];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Tin cua toi</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {listings.isLoading ? 'Dang tai...' : `${myListings.length} tin dang`}
          </p>
        </div>
        <Link href="/tai-khoan/dang-tin" className="unstyled">
          <Button leftIcon={<PlusCircle size={16} />}>Dang tin moi</Button>
        </Link>
      </header>

      {listings.isLoading ? (
        <div className="flex items-center justify-center gap-3 rounded-md border border-brdr bg-white p-10 text-sm text-ink-muted">
          <Spinner />
          <span>Dang tai tin cua ban...</span>
        </div>
      ) : listings.isError ? (
        <Card padded className="!p-0">
          <EmptyState
            icon={FileText}
            title="Khong tai duoc tin cua ban"
            description="Vui long kiem tra dang nhap hoac ket noi API."
            action={
              <Link href="/tai-khoan/dang-tin" className="unstyled">
                <Button leftIcon={<PlusCircle size={16} />}>Dang tin moi</Button>
              </Link>
            }
          />
        </Card>
      ) : myListings.length === 0 ? (
        <Card padded className="!p-0">
          <EmptyState
            icon={FileText}
            title="Ban chua co tin dang nao"
            description="Tao tin dang dau tien de bat dau nhan lien he tu khach hang."
            action={
              <Link href="/tai-khoan/dang-tin" className="unstyled">
                <Button leftIcon={<PlusCircle size={16} />}>Dang tin dau tien</Button>
              </Link>
            }
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {myListings.map((l) => (
            <MyListingRow key={l.id} listing={l} />
          ))}
        </div>
      )}
    </div>
  );
}
