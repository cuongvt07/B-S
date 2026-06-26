'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, PlusCircle, Heart, ChevronDown } from 'lucide-react';
import { Logo } from './Logo';
import { MobileDrawer } from './MobileDrawer';
import { NotificationBell } from './NotificationBell';
import { AccountMenu } from './AccountMenu';
import { usePostModal } from '@/lib/hooks/usePostModal';
import { cn } from '@/lib/utils';

type NavChild = { label: string; href: string };
type NavColumn = { title: string; items: NavChild[] };
type NavItem = { label: string; href: string; columns?: NavColumn[] };

const NAV: NavItem[] = [
  { label: 'Trang chủ', href: '/' },
  {
    label: 'Bất động sản',
    href: '/tin-dang',
    columns: [
      {
        title: 'Mua bán',
        items: [
          { label: 'Bán căn hộ chung cư', href: '/ban-can-ho' },
          { label: 'Bán nhà riêng', href: '/ban-nha-rieng' },
          { label: 'Bán nhà nguyên căn', href: '/nha-nguyen-can' },
          { label: 'Bán đất', href: '/ban-dat' },
          { label: 'Bán văn phòng', href: '/ban-van-phong' },
        ],
      },
      {
        title: 'Cho thuê',
        items: [
          { label: 'Cho thuê căn hộ', href: '/cho-thue-can-ho' },
          { label: 'Cho thuê phòng trọ', href: '/cho-thue-phong-tro' },
          { label: 'Cho thuê nhà nguyên căn', href: '/cho-thue-nha-nguyen-can' },
          { label: 'Cho thuê văn phòng', href: '/cho-thue-van-phong' },
          { label: 'Ở ghép', href: '/o-ghep' },
        ],
      },
    ],
  },
  { label: 'Xe cộ', href: '/xe' },
  { label: 'Tin tức', href: '/blog' },
  {
    label: 'Dự án',
    href: '/tin-dang?propertyType=apartment',
    columns: [
      {
        title: 'Loại hình dự án',
        items: [
          { label: 'Căn hộ chung cư', href: '/tin-dang?propertyType=apartment' },
          { label: 'Đất nền dự án', href: '/ban-dat' },
          { label: 'Biệt thự / Liền kề', href: '/tin-dang?propertyType=villa' },
          { label: 'Nhà phố thương mại', href: '/tin-dang?propertyType=townhouse' },
          { label: 'Văn phòng', href: '/ban-van-phong' },
        ],
      },
    ],
  },
  { label: 'Bảng giá', href: '/goi-moi-gioi' },
  { label: 'Liên hệ', href: '/lien-he' },
];

function navActive(pathname: string, href: string): boolean {
  const path = href.split('?')[0];
  if (path === '/') return pathname === '/';
  if (href.includes('?')) return false;
  return pathname === path || pathname.startsWith(path + '/');
}

/**
 * Sticky header. Content is constrained to the site container (1240px).
 * "Bất động sản" and "Dự án" expand into dropdown submenus on hover.
 */
export function Header({ logoUrl, siteName }: { logoUrl?: string; siteName?: string } = {}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
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
              const hasMenu = !!item.columns?.length;
              const isOpen = openMenu === item.label;
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => hasMenu && setOpenMenu(item.label)}
                  onMouseLeave={() => hasMenu && setOpenMenu(null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'unstyled inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors',
                      active || isOpen
                        ? 'bg-brand-soft text-primary'
                        : 'text-ink hover:bg-[#F5F7FB] hover:text-primary'
                    )}
                  >
                    {item.label}
                    {hasMenu && (
                      <ChevronDown size={14} className={cn('transition-transform', isOpen && 'rotate-180')} />
                    )}
                  </Link>

                  {hasMenu && isOpen && (
                    <div className="absolute left-0 top-full z-40 pt-1.5">
                      <div className="flex gap-6 rounded-md border border-brdr bg-white p-4 shadow-elevated">
                        {item.columns!.map((col) => (
                          <div key={col.title} className="min-w-[180px]">
                            <p className="mb-2 border-b border-brdr pb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                              {col.title}
                            </p>
                            <ul className="space-y-0.5">
                              {col.items.map((c) => (
                                <li key={c.href + c.label}>
                                  <Link
                                    href={c.href}
                                    className="unstyled block rounded-sm px-2 py-1.5 text-sm text-ink hover:bg-[#F5F7FB] hover:text-primary"
                                  >
                                    {c.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
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
