'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, PlusCircle, Heart } from 'lucide-react';
import { Logo } from './Logo';
import { MobileDrawer } from './MobileDrawer';
import { NotificationBell } from './NotificationBell';
import { AccountMenu } from './AccountMenu';
import { usePostModal } from '@/lib/hooks/usePostModal';
import { cn } from '@/lib/utils';

const NAV = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Bất động sản', href: '/tin-dang' },
  { label: 'Xe cộ', href: '/xe' },
  { label: 'Tin tức', href: '/blog' },
  { label: 'Dự án', href: '/tin-dang?propertyType=apartment' },
  { label: 'Bảng giá', href: '/goi-moi-gioi' },
  { label: 'Liên hệ', href: '/lien-he' },
];

function navActive(pathname: string, href: string): boolean {
  const path = href.split('?')[0];
  if (path === '/') return pathname === '/';
  // "Dự án" shares /tin-dang with "Bất động sản" — don't double-highlight.
  if (href.includes('?')) return false;
  return pathname === path || pathname.startsWith(path + '/');
}

/**
 * Sticky header. Content is constrained to the site container (1240px) so it
 * lines up with every section; only the white background spans full width.
 */
export function Header({ logoUrl, siteName }: { logoUrl?: string; siteName?: string } = {}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname() || '/';
  const openPost = usePostModal((s) => s.openPost);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-brdr bg-white">
        <div className="container-app flex h-[72px] items-center gap-3 lg:h-[92px]">
          <button
            type="button"
            aria-label="Mở menu"
            className="grid h-10 w-10 place-items-center rounded-md text-ink hover:bg-[#F5F7FB] lg:hidden"
            onClick={() => setDrawerOpen(true)}
          >
            <Menu size={22} />
          </button>

          <Logo logoUrl={logoUrl} siteName={siteName} />

          {/* Primary nav — desktop */}
          <nav className="ml-2 hidden items-center gap-0.5 lg:flex">
            {NAV.map((item) => {
              const active = navActive(pathname, item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    'unstyled rounded-md px-3 py-2 text-sm font-semibold transition-colors',
                    active
                      ? 'bg-brand-soft text-primary'
                      : 'text-ink hover:bg-[#F5F7FB] hover:text-primary'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-1 whitespace-nowrap">
            <Link
              href="/tai-khoan/yeu-thich"
              className="unstyled hidden items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-[#F5F7FB] hover:text-primary md:inline-flex"
            >
              <Heart size={16} />
              <span className="hidden lg:inline">Yêu thích</span>
            </Link>
            <span className="hidden md:inline-flex">
              <NotificationBell />
            </span>
            <span className="hidden md:inline-flex">
              <AccountMenu />
            </span>
            <button
              type="button"
              onClick={() => openPost('property')}
              className="bds-cta-amber ml-1 inline-flex items-center gap-1.5 rounded-sm px-4 py-2 text-sm font-semibold text-white transition-colors"
            >
              <PlusCircle size={16} />
              <span className="hidden sm:inline">Đăng tin</span>
            </button>
          </div>
        </div>
      </header>
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
