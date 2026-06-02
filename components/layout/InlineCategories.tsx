'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryGroup {
  title: string;
  href: string;
  children?: { label: string; href: string }[];
}

/**
 * Trimmed inline categories — only 4 essentials so the row stays single-line.
 * Sub-categories (Căn hộ, Phòng trọ, Nhà nguyên căn, Văn phòng) live inside
 * the Mua bán / Cho thuê dropdowns.
 */
const CATEGORIES: CategoryGroup[] = [
  {
    title: 'Mua bán',
    href: '/mua-ban',
    children: [
      { label: 'Bán căn hộ chung cư', href: '/ban-can-ho' },
      { label: 'Bán nhà riêng', href: '/ban-nha-rieng' },
      { label: 'Bán nhà nguyên căn', href: '/nha-nguyen-can' },
      { label: 'Bán đất', href: '/ban-dat' },
      { label: 'Bán văn phòng', href: '/ban-van-phong' },
    ],
  },
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
  { title: 'Blog', href: '/blog' },
  { title: 'Gói môi giới', href: '/goi-moi-gioi' },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

export function InlineCategories() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const pathname = usePathname() || '';

  return (
    <nav
      className="hidden lg:flex items-center"
      aria-label="Danh mục"
    >
      {CATEGORIES.map((cat, idx) => {
        const active = isActive(pathname, cat.href);
        const hasChildren = !!cat.children?.length;
        return (
          <div
            key={cat.title}
            className="relative shrink-0"
            onMouseEnter={() => hasChildren && setOpenIdx(idx)}
            onMouseLeave={() => setOpenIdx(null)}
          >
            <Link
              href={cat.href}
              className={cn(
                'unstyled relative inline-flex items-center gap-1 px-4 py-5 text-sm font-semibold whitespace-nowrap transition-colors',
                active ? 'text-primary' : 'text-ink hover:text-primary'
              )}
            >
              {cat.title}
              {hasChildren && (
                <ChevronDown
                  size={14}
                  className={cn(
                    'text-ink-muted transition-transform',
                    openIdx === idx && 'rotate-180'
                  )}
                />
              )}
              {/* Active underline — full-width */}
              <span
                className={cn(
                  'pointer-events-none absolute inset-x-2 -bottom-px h-[3px] rounded-full transition-all',
                  active ? 'bg-primary opacity-100' : 'opacity-0'
                )}
              />
            </Link>
            {hasChildren && openIdx === idx && (
              <div className="absolute left-0 top-full z-50 min-w-[260px] pt-px">
                <div className="rounded-md border border-brdr bg-white py-2 shadow-elevated animate-fadeIn">
                  {cat.children!.map((c) => {
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
    </nav>
  );
}

export { CATEGORIES as INLINE_CATEGORIES };
