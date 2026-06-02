'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  User as UserIcon,
  ChevronDown,
  LogIn,
  UserPlus,
  PlusCircle,
  LayoutDashboard,
  List,
  Heart,
  Bookmark,
  Settings,
  LogOut,
} from 'lucide-react';
import { Popover } from '@/components/ui';
import { useCurrentUser, useLogout } from '@/lib/hooks/useAuth';
import { useAuthModal } from '@/lib/hooks/useAuthModal';
import { cn } from '@/lib/utils';

export function AccountMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();
  const logout = useLogout();
  const openLogin = useAuthModal((s) => s.openLogin);
  const openRegister = useAuthModal((s) => s.openRegister);

  const isAuthed = Boolean(user);

  function closeMenu() {
    setOpen(false);
  }

  async function handleLogout() {
    closeMenu();
    await logout.mutateAsync();
    router.push('/');
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'inline-flex h-10 items-center gap-2 rounded-full border border-brdr bg-white pl-1 pr-3 text-sm font-semibold text-ink transition-all hover:border-primary hover:text-primary hover:shadow-raised',
          open && 'border-primary text-primary shadow-raised'
        )}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {isAuthed && user?.avatarUrl ? (
          <span className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-white">
            <Image src={user.avatarUrl} alt={user.name} fill sizes="32px" className="object-cover" />
          </span>
        ) : (
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary/15 to-primary/5 text-primary">
            <UserIcon size={16} />
          </span>
        )}
        <span className="hidden lg:inline">
          {isLoading ? '...' : isAuthed ? user!.name.split(' ').slice(-1)[0] : 'Tài khoản'}
        </span>
        <ChevronDown size={14} className="text-ink-muted" />
      </button>

      <Popover open={open} onClose={closeMenu} align="right" width="w-[280px]">
        {isAuthed && user ? (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-brdr px-4 py-3">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-surface-subtle text-sm font-semibold text-ink-muted">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-sm font-semibold text-ink">{user.name}</p>
                <p className="line-clamp-1 text-xs text-ink-muted">{user.email}</p>
              </div>
            </div>

            <nav className="py-1">
              <MenuLink href="/tai-khoan" Icon={LayoutDashboard} onClose={closeMenu}>
                Tổng quan
              </MenuLink>
              <MenuLink href="/tai-khoan/tin-cua-toi" Icon={List} onClose={closeMenu}>
                Tin của tôi
              </MenuLink>
              <MenuLink href="/tai-khoan/yeu-thich" Icon={Heart} onClose={closeMenu}>
                Yêu thích
              </MenuLink>
              <MenuLink
                href="/tai-khoan/tim-kiem-da-luu"
                Icon={Bookmark}
                onClose={closeMenu}
              >
                Tìm kiếm đã lưu
              </MenuLink>
              <MenuLink href="/tai-khoan/thong-tin" Icon={Settings} onClose={closeMenu}>
                Thông tin cá nhân
              </MenuLink>
            </nav>

            <div className="border-t border-brdr py-1">
              <MenuLink
                href="/tai-khoan/dang-tin"
                Icon={PlusCircle}
                onClose={closeMenu}
                accent
              >
                Đăng tin mới
              </MenuLink>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-ink hover:bg-surface-subtle"
              >
                <LogOut size={16} className="text-ink-muted" />
                Đăng xuất
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="border-b border-brdr px-4 py-4 text-center">
              <p className="text-sm text-ink-muted">Chào mừng đến BDS Việt</p>
              <p className="mt-0.5 text-base font-semibold text-ink">
                Đăng nhập để quản lý tin đăng
              </p>
            </div>

            <div className="flex gap-2 px-4 py-3">
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  openLogin();
                }}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-sm bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
              >
                <LogIn size={14} /> Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  openRegister();
                }}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-sm border border-brdr bg-white px-3 py-2 text-sm font-semibold text-ink hover:border-primary hover:text-primary"
              >
                <UserPlus size={14} /> Đăng ký
              </button>
            </div>

            <div className="border-t border-brdr py-1">
              <MenuLink
                href="/tai-khoan/dang-tin"
                Icon={PlusCircle}
                onClose={closeMenu}
                accent
              >
                Đăng tin miễn phí
              </MenuLink>
              <MenuLink href="/goi-moi-gioi" Icon={UserPlus} onClose={closeMenu}>
                Trở thành môi giới
              </MenuLink>
              <MenuLink href="/lien-he" Icon={Settings} onClose={closeMenu}>
                Liên hệ hỗ trợ
              </MenuLink>
            </div>
          </>
        )}
      </Popover>
    </div>
  );
}

function MenuLink({
  href,
  Icon,
  children,
  onClose,
  accent,
}: {
  href: string;
  Icon: typeof UserIcon;
  children: React.ReactNode;
  onClose: () => void;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className={cn(
        'unstyled flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface-subtle',
        accent ? 'text-primary font-semibold' : 'text-ink'
      )}
    >
      <Icon size={16} className={accent ? 'text-primary' : 'text-ink-muted'} />
      {children}
    </Link>
  );
}
