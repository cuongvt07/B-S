'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, PlusCircle } from 'lucide-react';
import { Logo } from './Logo';
import { MegaMenu } from './MegaMenu';
import { HeaderSearch } from './HeaderSearch';
import { MobileDrawer } from './MobileDrawer';
import { NotificationBell } from './NotificationBell';
import { useAuthModal } from '@/lib/hooks/useAuthModal';

export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const openLogin = useAuthModal((s) => s.openLogin);
  const openRegister = useAuthModal((s) => s.openRegister);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-brdr">
        {/* Row 1: Logo + Search + Auth + CTA */}
        <div className="container-app flex h-16 items-center gap-4">
          <button
            type="button"
            aria-label="Mở menu"
            className="lg:hidden p-2 text-ink"
            onClick={() => setDrawerOpen(true)}
          >
            <Menu size={22} />
          </button>

          <Logo />

          <HeaderSearch />

          <div className="ml-auto flex shrink-0 items-center gap-1 whitespace-nowrap">
            <span className="hidden md:inline-flex">
              <NotificationBell />
            </span>
            <div className="hidden md:flex items-center gap-1">
              <button
                type="button"
                onClick={() => openLogin()}
                className="px-3 py-2 text-sm font-semibold text-ink hover:text-primary"
              >
                Đăng nhập
              </button>
              <span className="text-ink-muted">·</span>
              <button
                type="button"
                onClick={() => openRegister()}
                className="px-3 py-2 text-sm font-semibold text-ink hover:text-primary"
              >
                Đăng ký
              </button>
            </div>
            <Link
              href="/tai-khoan/dang-tin"
              className="unstyled ml-2 inline-flex items-center gap-1 rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
            >
              <PlusCircle size={16} />
              <span className="hidden sm:inline">Đăng tin</span>
            </Link>
          </div>
        </div>

        {/* Row 2: Mega menu (desktop only) */}
        <div className="hidden lg:block border-t border-brdr bg-white">
          <div className="container-app">
            <MegaMenu />
          </div>
        </div>
      </header>
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
