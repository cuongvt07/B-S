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

const TOP_THRESHOLD = 120;
const DELTA = 24; // ignore tiny scroll noise

/**
 * Header — sticky on scroll. Row 2 (MegaMenu) collapses on scroll down,
 * re-appears on scroll up. To avoid jitter, scroll handler mutates the DOM
 * directly via `data-hidden` (no React re-render per scroll tick).
 */
export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const rowRef = useRef<HTMLDivElement | null>(null);
  const lastYRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    function update() {
      tickingRef.current = false;
      const r = rowRef.current;
      if (!r) return;
      const y = window.scrollY;
      const last = lastYRef.current;
      const delta = y - last;

      if (y < TOP_THRESHOLD) {
        if (r.dataset.hidden !== 'false') r.dataset.hidden = 'false';
        lastYRef.current = y;
      } else if (delta > DELTA) {
        if (r.dataset.hidden !== 'true') r.dataset.hidden = 'true';
        lastYRef.current = y;
      } else if (delta < -DELTA) {
        if (r.dataset.hidden !== 'false') r.dataset.hidden = 'false';
        lastYRef.current = y;
      }
    }

    function onScroll() {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(update);
    }

    row.dataset.hidden = 'false';
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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
              className="unstyled inline-flex items-center gap-1 rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-white shadow-raised transition hover:bg-primary-hover"
            >
              <PlusCircle size={16} />
              <span className="hidden sm:inline">Đăng tin</span>
            </Link>
          </div>
        </div>

        {/* Row 2: Mega menu — pure-CSS collapse via data-hidden, no React re-render on scroll */}
        <div
          ref={rowRef}
          data-hidden="false"
          className="header-row2 hidden lg:block border-t border-brdr bg-white"
        >
          <div className="header-row2-inner">
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
