'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Menu, PlusCircle } from 'lucide-react';
import { Logo } from './Logo';
import { MegaMenu } from './MegaMenu';
import { HeaderSearch } from './HeaderSearch';
import { MobileDrawer } from './MobileDrawer';
import { NotificationBell } from './NotificationBell';
import { useAuthModal } from '@/lib/hooks/useAuthModal';
import { cn } from '@/lib/utils';

export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hideMenu, setHideMenu] = useState(false);
  const lastYRef = useRef(0);
  const openLogin = useAuthModal((s) => s.openLogin);
  const openRegister = useAuthModal((s) => s.openRegister);

  // Auto-collapse Row 2 (mega menu) when scrolling DOWN past threshold,
  // reveal again on scroll UP or when near top.
  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      const last = lastYRef.current;
      if (y < 80) {
        setHideMenu(false);
      } else if (y > last + 4) {
        setHideMenu(true);
      } else if (y < last - 4) {
        setHideMenu(false);
      }
      lastYRef.current = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-brdr shadow-[0_1px_0_rgba(0,0,0,0.04)]">
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

        {/* Row 2: Mega menu — auto-collapse on scroll-down, slide back on scroll-up */}
        <div
          className={cn(
            'hidden lg:block overflow-hidden border-t border-brdr bg-white',
            'transition-[max-height,opacity,transform] duration-300 ease-out',
            hideMenu
              ? 'max-h-0 opacity-0 -translate-y-1 pointer-events-none'
              : 'max-h-20 opacity-100 translate-y-0'
          )}
          aria-hidden={hideMenu}
        >
          <div className="container-app">
            <MegaMenu />
          </div>
        </div>
      </header>
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
