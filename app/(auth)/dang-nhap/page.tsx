'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { LoginForm } from '@/components/auth';

function LoginContent() {
  const sp = useSearchParams();
  const next = sp.get('next') ?? '/tai-khoan';

  return (
    <div className="w-full max-w-md rounded-md border border-brdr bg-white p-6 shadow-raised">
      <h1 className="mb-2 text-2xl font-semibold">Đăng nhập</h1>
      <p className="mb-6 text-sm text-ink-muted">
        Đăng nhập để quản lý tin đăng, lưu yêu thích và theo dõi bộ lọc.
      </p>
      <LoginForm nextUrl={next} />
      <p className="mt-6 text-center text-sm text-ink-muted">
        Chưa có tài khoản?{' '}
        <Link href="/dang-ky" className="text-primary">
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
