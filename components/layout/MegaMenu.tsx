'use client';

import Link from 'next/link';
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
];

const SIMPLE_LINKS = [
  { label: 'Căn hộ', href: '/can-ho' },
  { label: 'Phòng trọ', href: '/phong-tro' },
  { label: 'Nhà nguyên căn', href: '/nha-nguyen-can' },
  { label: 'Văn phòng', href: '/van-phong' },
  { label: 'Blog', href: '/blog' },
  { label: 'Gói môi giới', href: '/goi-moi-gioi' },
];

export function MegaMenu() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <nav
      className="hidden lg:flex items-center justify-center gap-2 whitespace-nowrap"
      aria-label="Danh mục"
    >
      {MENU.map((group, idx) => (
        <div
          key={group.title}
          className="relative shrink-0"
          onMouseEnter={() => setOpenIdx(idx)}
          onMouseLeave={() => setOpenIdx(null)}
        >
          <Link
            href={group.href}
            className={cn(
              'unstyled inline-flex items-center gap-1.5 px-4 py-3.5 text-base font-semibold text-ink whitespace-nowrap',
              'hover:text-primary'
            )}
          >
            {group.title}
            <ChevronDown size={16} className="text-ink-muted" />
          </Link>
          {openIdx === idx && (
            <div className="absolute left-0 top-full z-50 min-w-[260px]">
              <div className="rounded-md border border-brdr bg-white py-2 shadow-elevated">
                {group.children.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className="unstyled block px-4 py-2 text-sm text-ink hover:bg-surface-subtle hover:text-primary whitespace-nowrap"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
      {SIMPLE_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="unstyled shrink-0 px-4 py-3.5 text-base font-semibold text-ink hover:text-primary whitespace-nowrap"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export const MENU_DATA = { MENU, SIMPLE_LINKS };
