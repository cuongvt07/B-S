'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuGroup {
  title: string;
  href: string;
  children: { label: string; href: string }[];
}

const MENU: MenuGroup[] = [
  {
    title: 'Cho thuê',
    href: '/cho-thue',
    children: [
      { label: 'Cho thuê căn hộ', href: '/cho-thue-can-ho' },
      { label: 'Cho thuê phòng trọ', href: '/cho-thue-phong-tro' },
      { label: 'Cho thuê nhà nguyên căn', href: '/cho-thue-nha-nguyen-can' },
      { label: 'Cho thuê văn phòng', href: '/cho-thue-van-phong' },
      { label: 'Cho thuê mặt bằng', href: '/cho-thue-mat-bang' },
      { label: 'Ở ghép', href: '/o-ghep' },
    ],
  },
  {
    title: 'Mua bán',
    href: '/mua-ban',
    children: [
      { label: 'Bán căn hộ chung cư', href: '/ban-can-ho' },
      { label: 'Bán nhà riêng', href: '/ban-nha-rieng' },
      { label: 'Bán đất', href: '/ban-dat' },
      { label: 'Bán văn phòng', href: '/ban-van-phong' },
    ],
  },
  {
    title: 'Xe cộ',
    href: '/xe',
    children: [
      { label: 'Ô tô', href: '/xe?loai=car' },
      { label: 'Xe máy', href: '/xe?loai=motorbike' },
    ],
  },
  {
    title: 'Danh mục',
    href: '/tin-dang',
    children: [
      { label: 'Căn hộ / Chung cư', href: '/can-ho' },
      { label: 'Nhà riêng', href: '/nha-rieng' },
      { label: 'Đất', href: '/dat' },
      { label: 'Văn phòng / Mặt bằng', href: '/van-phong' },
      { label: 'Kho xưởng', href: '/kho-xuong' },
      { label: 'Đất rừng', href: '/dat-rung' },
      { label: 'Quán nhậu', href: '/quan-nhau' },
      { label: 'Karaoke', href: '/karaoke' },
      { label: 'Quán cafe', href: '/quan-cafe' },
    ],
  },
];

const SIMPLE_LINKS = [
  { label: 'Căn hộ', href: '/can-ho' },
  { label: 'Phòng trọ', href: '/phong-tro' },
  { label: 'Nhà nguyên căn', href: '/nha-nguyen-can' },
  { label: 'Văn phòng', href: '/van-phong' },
  { label: 'Blog', href: '/blog' },
  { label: 'Gói môi giới', href: '/goi-moi-gioi' },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

export function MegaMenu() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const pathname = usePathname() || '';

  return (
    <nav
      className="hidden lg:flex items-center justify-center gap-1 whitespace-nowrap"
      aria-label="Danh mục"
    >
      {MENU.map((group, idx) => {
        const active = isActive(pathname, group.href);
        return (
          <div
            key={group.title}
            className="relative shrink-0"
            onMouseEnter={() => setOpenIdx(idx)}
            onMouseLeave={() => setOpenIdx(null)}
          >
            <Link
              href={group.href}
              className={cn(
                'unstyled relative inline-flex items-center gap-1 px-3.5 py-3 text-sm font-semibold whitespace-nowrap transition-colors',
                active ? 'text-primary' : 'text-ink hover:text-primary'
              )}
            >
              {group.title}
              <ChevronDown
                size={14}
                className={cn(
                  'text-ink-muted transition-transform',
                  openIdx === idx && 'rotate-180'
                )}
              />
              {active && (
                <span className="absolute inset-x-3.5 -bottom-px h-0.5 rounded-full bg-primary" />
              )}
            </Link>
            {openIdx === idx && (
              <div className="absolute left-0 top-full z-50 min-w-[260px] pt-1">
                <div className="rounded-md border border-brdr bg-white py-2 shadow-elevated animate-fadeIn">
                  {group.children.map((c) => {
                    const childActive = isActive(pathname, c.href);
                    return (
                      <Link
                        key={c.href}
                        href={c.href}
                        className={cn(
                          'unstyled block px-4 py-2 text-sm whitespace-nowrap transition-colors',
                          childActive
                            ? 'bg-primary/5 text-primary font-semibold'
                            : 'text-ink hover:bg-surface-subtle hover:text-primary'
                        )}
                      >
                        {c.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {SIMPLE_LINKS.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'unstyled relative inline-flex items-center px-3.5 py-3 text-sm font-semibold whitespace-nowrap transition-colors',
              active ? 'text-primary' : 'text-ink hover:text-primary'
            )}
          >
            {link.label}
            {active && (
              <span className="absolute inset-x-3.5 -bottom-px h-0.5 rounded-full bg-primary" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export const MENU_DATA = { MENU, SIMPLE_LINKS };
