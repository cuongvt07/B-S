'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Menu, PlusCircle } from 'lucide-react';
import { Logo } from './Logo';
import { MegaMenu } from './MegaMenu';
import { HeaderSearch } from './HeaderSearch';
import { MobileDrawer } from './MobileDrawer';
import { NotificationBell } from './NotificationBell';
import { AccountMenu } from './AccountMenu';
import { cn } from '@/lib/utils';

const TOP_THRESHOLD = 120;
const DELTA = 16; // ignore noise / small movements

export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hideMenu, setHideMenu] = useState(false);
  const lastYRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    function onScroll() {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const y = window.scrollY;
        const last = lastYRef.current;
        const delta = y - last;

        if (y < TOP_THRESHOLD) {
          setHideMenu((prev) => (prev ? false : prev));
        } else if (delta > DELTA) {
          setHideMenu((prev) => (prev ? prev : true));
          lastYRef.current = y;
        } else if (delta < -DELTA) {
          setHideMenu((prev) => (prev ? false : prev));
          lastYRef.current = y;
        }
        // else: ignore small movements (don't update lastY either, prevents drift)
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-brdr shadow-[0_1px_0_rgba(0,0,0,0.04)]">
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

          <div className="ml-auto flex shrink-0 items-center gap-2 whitespace-nowrap">
            <span className="hidden md:inline-flex">
              <NotificationBell />
            </span>
            <span className="hidden md:inline-flex">
              <AccountMenu />
            </span>
            <Link
              href="/tai-khoan/dang-tin"
              className="unstyled inline-flex items-center gap-1 rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
            >
              <PlusCircle size={16} />
              <span className="hidden sm:inline">Đăng tin</span>
            </Link>
          </div>
        </div>

        {/* Row 2: Mega menu — uses grid-template-rows for smooth collapse (no max-h jitter) */}
        <div
          className={cn(
            'hidden lg:grid border-t border-brdr bg-white transition-[grid-template-rows,opacity] duration-300 ease-out',
            hideMenu ? 'grid-rows-[0fr] opacity-0 pointer-events-none' : 'grid-rows-[1fr] opacity-100'
          )}
          aria-hidden={hideMenu}
        >
          <div className="overflow-hidden">
            <div className="container-app">
              <MegaMenu />
            </div>
          </div>
        </div>
      </header>
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
