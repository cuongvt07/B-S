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
          <h1 className="text-2xl font-semibold text-ink">Tin của tôi</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {listings.isLoading ? 'Đang tải...' : `${myListings.length} tin đăng`}
          </p>
        </div>
        <Link href="/tai-khoan/dang-tin" className="unstyled">
          <Button leftIcon={<PlusCircle size={16} />}>Đăng tin mới</Button>
        </Link>
      </header>

      {listings.isLoading ? (
        <div className="flex items-center justify-center gap-3 rounded-md border border-brdr bg-white p-10 text-sm text-ink-muted">
          <Spinner />
          <span>Đang tải tin của bạn...</span>
        </div>
      ) : listings.isError ? (
        <Card padded className="!p-0">
          <EmptyState
            icon={FileText}
            title="Không tải được tin của bạn"
            description="Vui lòng kiểm tra đăng nhập hoặc kết nối API."
            action={
              <Link href="/tai-khoan/dang-tin" className="unstyled">
                <Button leftIcon={<PlusCircle size={16} />}>Đăng tin mới</Button>
              </Link>
            }
          />
        </Card>
      ) : myListings.length === 0 ? (
        <Card padded className="!p-0">
          <EmptyState
            icon={FileText}
            title="Bạn chưa có tin đăng nào"
            description="Tạo tin đăng đầu tiên để bắt đầu nhận liên hệ từ khách hàng."
            action={
              <Link href="/tai-khoan/dang-tin" className="unstyled">
                <Button leftIcon={<PlusCircle size={16} />}>Đăng tin đầu tiên</Button>
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
