'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { Spinner } from '@/components/ui';
import { useCurrentUser } from '@/lib/hooks/useAuth';

export function AuthRequired({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (isLoading || user) return;
    const qs = searchParams.toString();
    const next = `${pathname}${qs ? `?${qs}` : ''}`;
    router.replace(`/dang-nhap?next=${encodeURIComponent(next)}`);
  }, [isLoading, pathname, router, searchParams, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-3 rounded-md border border-brdr bg-white p-10 text-sm text-ink-muted">
        <Spinner />
        <span>Đang kiểm tra đăng nhập...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center gap-3 rounded-md border border-brdr bg-white p-10 text-sm text-ink-muted">
        <Spinner />
        <span>Đang chuyển đến trang đăng nhập...</span>
      </div>
    );
  }

  return <>{children}</>;
}
