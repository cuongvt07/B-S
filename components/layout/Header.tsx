'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, PlusCircle } from 'lucide-react';
import { Logo } from './Logo';
import { InlineCategories } from './InlineCategories';
import { HeaderSearch } from './HeaderSearch';
import { MobileDrawer } from './MobileDrawer';
import { NotificationBell } from './NotificationBell';
import { AccountMenu } from './AccountMenu';

/**
 * Single-row sticky header. No collapsing row 2 — categories are inline.
 * Width is full-bleed (px padding only, no max-width container).
 */
export function Header({ logoUrl, siteName }: { logoUrl?: string; siteName?: string } = {}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-brdr">
        <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
          <button
            type="button"
            aria-label="Mở menu"
            className="lg:hidden grid h-10 w-10 place-items-center rounded-md text-ink hover:bg-surface-subtle"
            onClick={() => setDrawerOpen(true)}
          >
            <Menu size={22} />
          </button>

          <Logo logoUrl={logoUrl} siteName={siteName} />

          {/* Inline categories — desktop only */}
          <InlineCategories />

          <HeaderSearch />

          <div className="ml-auto flex shrink-0 items-center gap-1 whitespace-nowrap">
            <span className="hidden md:inline-flex">
              <NotificationBell />
            </span>
            <span className="hidden md:inline-flex">
              <AccountMenu />
            </span>
            <Link
              href="/tai-khoan/dang-tin"
              className="unstyled bds-cta-amber ml-1 inline-flex items-center gap-1.5 rounded-sm px-4 py-2 text-sm font-semibold text-white transition-colors"
            >
              <PlusCircle size={16} />
              <span className="hidden sm:inline">Đăng tin</span>
            </Link>
          </div>
        </div>
      </header>
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
