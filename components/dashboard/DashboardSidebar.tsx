'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, List, PlusCircle, Car, Heart, LogOut, User as UserIcon, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLogout } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';

const ITEMS = [
  { href: '/tai-khoan', label: 'Tổng quan', icon: LayoutDashboard, exact: true },
  { href: '/tai-khoan/tin-cua-toi', label: 'Tin BĐS của tôi', icon: List },
  { href: '/tai-khoan/tin-xe-cua-toi', label: 'Tin xe của tôi', icon: Car },
  { href: '/tai-khoan/dang-tin', label: 'Đăng tin BĐS', icon: PlusCircle, exact: true },
  { href: '/tai-khoan/dang-tin-xe', label: 'Đăng tin xe', icon: Car },
  { href: '/tai-khoan/yeu-thich', label: 'Yêu thích', icon: Heart },
  { href: '/tai-khoan/tim-kiem-da-luu', label: 'Tìm kiếm đã lưu', icon: Bookmark },
  { href: '/tai-khoan/thong-tin', label: 'Thông tin cá nhân', icon: UserIcon },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useLogout();

  return (
    <aside className="rounded-md border border-brdr bg-white p-2">
      <nav className="space-y-1">
        {ITEMS.map((it) => {
          const Icon = it.icon;
          const active = it.exact ? pathname === it.href : pathname.startsWith(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                'unstyled flex items-center gap-2 rounded-sm px-3 py-2 text-sm font-semibold',
                active ? 'bg-surface-subtle text-primary' : 'text-ink hover:bg-surface-subtle'
              )}
            >
              <Icon size={16} />
              {it.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={async () => {
            await logout.mutateAsync();
            router.push('/');
            router.refresh();
          }}
          className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm font-semibold text-ink hover:bg-surface-subtle"
        >
          <LogOut size={16} />
          Đăng xuất
        </button>
      </nav>
    </aside>
  );
}
