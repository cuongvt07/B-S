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
        <span>Dang tai tong quan...</span>
      </div>
    );
  }

  const myListings = listings.data?.data ?? [];
  const totalViews = myListings.reduce((s, l) => s + l.viewCount, 0);
  const activeCount = myListings.filter((l) => l.status === 'active').length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-ink">Chao {user.name}</h1>
        <p className="mt-1 text-sm text-ink-muted">Tong quan hoat dong cua ban tren website.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-wide text-ink-muted">Tin dang hien thi</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{activeCount}</p>
          <p className="mt-1 text-xs text-ink-muted">tren tong {myListings.length} tin</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-ink-muted">Tong luot xem</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{totalViews.toLocaleString('vi-VN')}</p>
          <p className="mt-1 text-xs text-ink-muted">tich luy tu tat ca tin</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-ink-muted">Tai khoan</p>
          <p className="mt-2 text-base font-semibold text-ink">{user.role === 'broker' ? 'Moi gioi / CTV' : 'Ca nhan'}</p>
          <p className="mt-1 text-xs text-ink-muted">{user.email}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link href="/tai-khoan/dang-tin" className="unstyled">
          <Card className="hover:border-primary">
            <PlusCircle size={24} className="text-primary" />
            <p className="mt-2 font-semibold text-ink">Dang tin moi</p>
            <p className="mt-1 text-xs text-ink-muted">Bat dau cho thue hoac ban BDS cua ban</p>
          </Card>
        </Link>
        <Link href="/tai-khoan/tin-cua-toi" className="unstyled">
          <Card className="hover:border-primary">
            <List size={24} className="text-primary" />
            <p className="mt-2 font-semibold text-ink">Tin cua toi</p>
            <p className="mt-1 text-xs text-ink-muted">Sua, xoa va theo doi tin dang</p>
          </Card>
        </Link>
        <Link href="/tai-khoan/yeu-thich" className="unstyled">
          <Card className="hover:border-primary">
            <Heart size={24} className="text-primary" />
            <p className="mt-2 font-semibold text-ink">Yeu thich</p>
            <p className="mt-1 text-xs text-ink-muted">Theo doi tin da luu</p>
          </Card>
        </Link>
      </div>

      {myListings.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Hoat dong gan day</h2>
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
