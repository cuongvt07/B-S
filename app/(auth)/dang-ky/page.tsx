'use client';

import Link from 'next/link';
import { RegisterForm } from '@/components/auth';

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md rounded-md border border-brdr bg-white p-6 shadow-raised">
      <h1 className="mb-2 text-2xl font-semibold">Đăng ký tài khoản</h1>
      <p className="mb-6 text-sm text-ink-muted">
        Tạo tài khoản miễn phí để đăng tin và quản lý BĐS của bạn.
      </p>
      <RegisterForm />
      <p className="mt-6 text-center text-sm text-ink-muted">
        Đã có tài khoản?{' '}
        <Link href="/dang-nhap" className="text-primary">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
