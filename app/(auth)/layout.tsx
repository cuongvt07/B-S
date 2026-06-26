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
      <main className="relative flex-1 grid place-items-center px-4 py-12">
        {/* Subtle branded backdrop — decorative, degrades gracefully if it fails to load. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.12]"
          style={{ backgroundImage: "url('/bg/bg-2.jpg')" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-surface-subtle/50 via-surface-subtle/40 to-surface-subtle/95"
        />
        <div className="relative z-10 w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
