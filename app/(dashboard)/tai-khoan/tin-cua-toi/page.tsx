'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { PlusCircle, FileText, ListChecks } from 'lucide-react';
import { Button, Card, EmptyState, Spinner } from '@/components/ui';
import { MyListingRow } from '@/components/dashboard';
import { Pagination } from '@/components/search';
import { meApi } from '@/lib/api/auth';

const PAGE_SIZE = 6;

export default function MyListingsPage() {
  const [page, setPage] = useState(1);
  const listings = useQuery({
    queryKey: ['me', 'listings', page, PAGE_SIZE],
    queryFn: () => meApi.listListings({ page, pageSize: PAGE_SIZE }),
    placeholderData: (previous) => previous,
    retry: 1,
  });

  const myListings = listings.data?.data ?? [];
  const meta = listings.data?.meta;
  const total = meta?.total ?? myListings.length;
  const totalPages = meta?.totalPages ?? 1;

  useEffect(() => {
    if (!listings.isFetching && myListings.length === 0 && page > totalPages) {
      setPage(Math.max(1, totalPages));
    }
  }, [listings.isFetching, myListings.length, page, totalPages]);

  function changePage(nextPage: number) {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="space-y-6">
      <header className="overflow-hidden rounded-md border border-primary/20 bg-gradient-to-r from-primary/10 via-white to-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-primary text-white">
              <ListChecks size={22} />
            </span>
            <div>
              <h1 className="text-2xl font-semibold text-ink">Tin của tôi</h1>
              <p className="mt-1 text-sm text-ink-muted">
                Quản lý, chỉnh sửa và theo dõi hiệu quả các tin đã đăng.
              </p>
            </div>
          </div>
          <Link href="/tai-khoan/dang-tin" className="unstyled">
            <Button leftIcon={<PlusCircle size={16} />}>Đăng tin mới</Button>
          </Link>
        </div>
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
        <section className="overflow-hidden rounded-md border border-brdr bg-surface shadow-raised">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brdr px-4 py-3">
            <div>
              <h2 className="font-semibold text-ink">Danh sách tin đăng</h2>
              <p className="mt-0.5 text-xs text-ink-muted">
                {total.toLocaleString('vi-VN')} tin · Trang {page}/{totalPages}
              </p>
            </div>
            {listings.isFetching && <Spinner className="h-4 w-4" />}
          </div>

          <div className="divide-y divide-brdr px-3 sm:px-4">
            {myListings.map((l) => (
              <MyListingRow key={l.id} listing={l} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center border-t border-brdr px-4 py-4">
              <Pagination page={page} totalPages={totalPages} onChange={changePage} />
            </div>
          )}
        </section>
      )}
    </div>
  );
}
