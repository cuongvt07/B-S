'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { List, PlusCircle, Heart, Eye } from 'lucide-react';
import { Card, Spinner } from '@/components/ui';
import { meApi } from '@/lib/api/auth';
import { useCurrentUser } from '@/lib/hooks/useAuth';

export default function DashboardHome() {
  const { data: user } = useCurrentUser();
  const listings = useQuery({
    queryKey: ['me', 'listings'],
    queryFn: () => meApi.listListings(),
    retry: 1,
  });

  if (!user || listings.isLoading) {
    return (
      <div className="flex items-center justify-center gap-3 rounded-md border border-brdr bg-white p-10 text-sm text-ink-muted">
        <Spinner />
        <span>Đang tải tổng quan...</span>
      </div>
    );
  }

  const myListings = listings.data?.data ?? [];
  const totalViews = myListings.reduce((s, l) => s + l.viewCount, 0);
  const activeCount = myListings.filter((l) => l.status === 'active').length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-ink">Chào {user.name}</h1>
        <p className="mt-1 text-sm text-ink-muted">Tổng quan hoạt động của bạn trên website.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-wide text-ink-muted">Tin đăng hiển thị</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{activeCount}</p>
          <p className="mt-1 text-xs text-ink-muted">trên tổng {myListings.length} tin</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-ink-muted">Tổng lượt xem</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{totalViews.toLocaleString('vi-VN')}</p>
          <p className="mt-1 text-xs text-ink-muted">tích lũy từ tất cả tin</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-ink-muted">Tài khoản</p>
          <p className="mt-2 text-base font-semibold text-ink">{user.role === 'broker' ? 'Môi giới / CTV' : 'Cá nhân'}</p>
          <p className="mt-1 text-xs text-ink-muted">{user.email}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link href="/tai-khoan/dang-tin" className="unstyled">
          <Card className="hover:border-primary">
            <PlusCircle size={24} className="text-primary" />
            <p className="mt-2 font-semibold text-ink">Đăng tin mới</p>
            <p className="mt-1 text-xs text-ink-muted">Bắt đầu cho thuê hoặc bán BĐS của bạn</p>
          </Card>
        </Link>
        <Link href="/tai-khoan/tin-cua-toi" className="unstyled">
          <Card className="hover:border-primary">
            <List size={24} className="text-primary" />
            <p className="mt-2 font-semibold text-ink">Tin của tôi</p>
            <p className="mt-1 text-xs text-ink-muted">Sửa, xóa và theo dõi tin đăng</p>
          </Card>
        </Link>
        <Link href="/tai-khoan/yeu-thich" className="unstyled">
          <Card className="hover:border-primary">
            <Heart size={24} className="text-primary" />
            <p className="mt-2 font-semibold text-ink">Yêu thích</p>
            <p className="mt-1 text-xs text-ink-muted">Theo dõi tin đã lưu</p>
          </Card>
        </Link>
      </div>

      {myListings.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Hoạt động gần đây</h2>
          <ul className="space-y-2">
            {myListings.slice(0, 3).map((l) => (
              <li key={l.id}>
                <Link
                  href={`/tin-dang/${l.slug}`}
                  className="unstyled flex items-center justify-between rounded-sm border border-brdr bg-white px-3 py-2 text-sm hover:border-primary"
                >
                  <span className="line-clamp-1">{l.title}</span>
                  <span className="inline-flex items-center gap-1 text-xs text-ink-muted">
                    <Eye size={12} /> {l.viewCount}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
