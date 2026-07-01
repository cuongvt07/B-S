'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { PlusCircle, Car, ListChecks } from '@/components/icons';
import { Button, Card, EmptyState, Spinner } from '@/components/ui';
import { MyVehicleRow } from '@/components/dashboard';
import { vehicleApi } from '@/lib/api/vehicles';
import type { Vehicle, ListingStatus } from '@/types';

const FETCH_SIZE = 200;

type StatusKey = 'all' | ListingStatus;

const STATUS_TABS: { key: StatusKey; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'active', label: 'Đang hiển thị' },
  { key: 'pending', label: 'Chờ duyệt' },
  { key: 'expired', label: 'Hết hạn' },
  { key: 'sold', label: 'Đã bán' },
];

export default function MyVehiclesPage() {
  const [status, setStatus] = useState<StatusKey>('all');

  const vehicles = useQuery({
    queryKey: ['me', 'vehicles', 'all', FETCH_SIZE],
    queryFn: () => vehicleApi.listMine({ page: 1, pageSize: FETCH_SIZE }),
    placeholderData: (previous) => previous,
    retry: 1,
  });

  const all: Vehicle[] = useMemo(() => vehicles.data?.data ?? [], [vehicles.data]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: all.length };
    for (const v of all) c[v.status] = (c[v.status] ?? 0) + 1;
    return c;
  }, [all]);

  const filtered = useMemo(
    () => (status === 'all' ? all : all.filter((v) => v.status === status)),
    [all, status]
  );

  return (
    <div className="space-y-5">
      <header className="overflow-hidden rounded-md border border-primary/20 bg-gradient-to-r from-primary/10 via-white to-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="icon-chip grid h-11 w-11 shrink-0 place-items-center rounded-md bg-primary text-white">
              <ListChecks size={22} />
            </span>
            <div>
              <h1 className="text-2xl font-semibold text-ink">Tin xe của tôi</h1>
              <p className="mt-1 text-sm text-ink-muted">Quản lý, chỉnh sửa các tin xe đã đăng.</p>
            </div>
          </div>
          <Link href="/tai-khoan/dang-tin-xe" className="unstyled">
            <Button leftIcon={<PlusCircle size={16} />}>Đăng tin xe</Button>
          </Link>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-2 rounded-md border border-brdr bg-surface px-3 py-2.5">
        {STATUS_TABS.map((t) => {
          const n = counts[t.key] ?? 0;
          const active = status === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setStatus(t.key)}
              className={
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ' +
                (active
                  ? 'border-primary bg-primary text-white'
                  : 'border-brdr bg-white text-ink-muted hover:border-primary/50 hover:text-ink')
              }
            >
              {t.label}
              <span
                className={
                  'rounded-full px-1.5 text-[11px] font-bold ' +
                  (active ? 'bg-white/20 text-white' : 'bg-surface-subtle text-ink-muted')
                }
              >
                {n}
              </span>
            </button>
          );
        })}
        <span className="ml-auto inline-flex items-center gap-2 text-xs text-ink-muted">
          {vehicles.isFetching && <Spinner className="h-3.5 w-3.5" />}
          {filtered.length} tin
        </span>
      </div>

      {vehicles.isLoading ? (
        <div className="flex items-center justify-center gap-3 rounded-md border border-brdr bg-white p-10 text-sm text-ink-muted">
          <Spinner />
          <span>Đang tải tin xe của bạn...</span>
        </div>
      ) : vehicles.isError ? (
        <Card padded className="!p-0">
          <EmptyState
            icon={Car}
            title="Không tải được tin xe của bạn"
            description="Vui lòng kiểm tra đăng nhập hoặc kết nối API."
            action={
              <Link href="/tai-khoan/dang-tin-xe" className="unstyled">
                <Button leftIcon={<PlusCircle size={16} />}>Đăng tin xe</Button>
              </Link>
            }
          />
        </Card>
      ) : all.length === 0 ? (
        <Card padded className="!p-0">
          <EmptyState
            icon={Car}
            title="Bạn chưa đăng tin xe nào"
            description="Tạo tin xe đầu tiên để bắt đầu nhận liên hệ."
            action={
              <Link href="/tai-khoan/dang-tin-xe" className="unstyled">
                <Button leftIcon={<PlusCircle size={16} />}>Đăng tin xe đầu tiên</Button>
              </Link>
            }
          />
        </Card>
      ) : filtered.length === 0 ? (
        <Card padded className="py-10 text-center text-sm text-ink-muted">
          Không có tin nào ở trạng thái này.
        </Card>
      ) : (
        <section className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          {filtered.map((v) => (
            <div key={v.id} className="rounded-md border border-brdr bg-white px-3 shadow-raised sm:px-4">
              <MyVehicleRow vehicle={v} />
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
