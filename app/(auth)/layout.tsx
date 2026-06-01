import Link from 'next/link';
import { Logo } from '@/components/layout/Logo';
import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-subtle flex flex-col">
      <header className="border-b border-brdr bg-white">
        <div className="container-app flex h-16 items-center justify-between">
          <Logo />
          <Link href="/" className="unstyled text-sm text-ink-muted hover:text-primary">
            Quay về trang chủ
          </Link>
        </div>
      </header>
      <main className="flex-1 grid place-items-center px-4 py-12">{children}</main>
    </div>
  );
}
