'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  LogIn,
  UserPlus,
  PlusCircle,
  LayoutDashboard,
  List,
  Heart,
  Bookmark,
  Settings,
  LogOut,
  Phone,
  MessageCircle,
  Facebook,
  Tag,
  Key,
  Newspaper,
  Users,
  Building,
  ChevronRight,
} from 'lucide-react';
import { Drawer } from '@/components/ui';
import { INLINE_CATEGORIES } from './InlineCategories';
import { useAuthModal } from '@/lib/hooks/useAuthModal';
import { useCurrentUser, useLogout } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { useSiteSettings } from '@/components/layout/SiteSettingsProvider';

interface Props {
  open: boolean;
  onClose: () => void;
}

const CAT_ICONS: Record<string, LucideIcon> = {
  'Mua bán': Tag,
  'Cho thuê': Key,
  Blog: Newspaper,
  'Gói môi giới': Users,
};

const ACCOUNT_LINKS: { label: string; href: string; Icon: LucideIcon }[] = [
  { label: 'Tổng quan', href: '/tai-khoan', Icon: LayoutDashboard },
  { label: 'Tin của tôi', href: '/tai-khoan/tin-cua-toi', Icon: List },
  { label: 'Yêu thích', href: '/tai-khoan/yeu-thich', Icon: Heart },
  { label: 'Tìm kiếm đã lưu', href: '/tai-khoan/tim-kiem-da-luu', Icon: Bookmark },
  { label: 'Thông tin cá nhân', href: '/tai-khoan/thong-tin', Icon: Settings },
];

export function MobileDrawer({ open, onClose }: Props) {
  const router = useRouter();
  const { hotline, zaloPhone } = useSiteSettings();
  const openLogin = useAuthModal((s) => s.openLogin);
  const openRegister = useAuthModal((s) => s.openRegister);
  const { data: user } = useCurrentUser();
  const logout = useLogout();
  const isAuthed = Boolean(user);

  async function handleLogout() {
    onClose();
    await logout.mutateAsync();
    router.push('/');
    router.refresh();
  }

  return (
    <Drawer open={open} onClose={onClose} side="left" title="">
      {/* Account header */}
      <div className="-mx-4 -mt-4 border-b border-brdr bg-surface-subtle px-4 py-4">
        {isAuthed && user ? (
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-brdr bg-white">
              {user.avatarUrl ? (
                <Image src={user.avatarUrl} alt={user.name} fill sizes="48px" className="object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center bg-gradient-to-br from-primary/20 to-primary/5 text-sm font-semibold text-primary">
                  {user.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-sm font-semibold text-ink">{user.name}</p>
              <p className="line-clamp-1 text-xs text-ink-muted">{user.email}</p>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-ink-muted">Chào bạn,</p>
            <p className="mt-0.5 text-base font-semibold text-ink">Đăng nhập để quản lý tin</p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openLogin();
                }}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-sm bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
              >
                <LogIn size={14} /> Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openRegister();
                }}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-sm border border-brdr bg-white px-3 py-2 text-sm font-semibold text-ink hover:border-primary hover:text-primary"
              >
                <UserPlus size={14} /> Đăng ký
              </button>
            </div>
          </>
        )}
      </div>

      {/* Đăng tin CTA */}
      <Link
        href="/tai-khoan/dang-tin"
        onClick={onClose}
        className="unstyled bds-cta-amber mt-4 inline-flex w-full items-center justify-center gap-2 rounded-sm px-4 py-2.5 text-sm font-semibold text-white"
      >
        <PlusCircle size={16} /> Đăng tin
      </Link>

      {/* Categories */}
      <section className="mt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">Danh mục</p>
        <ul className="space-y-0.5">
          {INLINE_CATEGORIES.map((cat) => {
            const Icon = CAT_ICONS[cat.title] ?? Building;
            return (
              <li key={cat.title}>
                <Link
                  href={cat.href}
                  onClick={onClose}
                  className="unstyled flex items-center gap-3 rounded-sm px-2 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface-subtle hover:text-primary"
                >
                  <Icon size={16} className="text-ink-muted" />
                  <span className="flex-1">{cat.title}</span>
                  <ChevronRight size={14} className="text-ink-muted" />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Account links (only when authed) */}
      {isAuthed && (
        <section className="mt-5 border-t border-brdr pt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Tài khoản
          </p>
          <ul className="space-y-0.5">
            {ACCOUNT_LINKS.map((link) => {
              const Icon = link.Icon;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="unstyled flex items-center gap-3 rounded-sm px-2 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface-subtle hover:text-primary"
                  >
                    <Icon size={16} className="text-ink-muted" />
                    {link.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-sm px-2 py-2.5 text-left text-sm font-medium text-ink transition-colors hover:bg-surface-subtle hover:text-danger"
              >
                <LogOut size={16} className="text-ink-muted" />
                Đăng xuất
              </button>
            </li>
          </ul>
        </section>
      )}

      {/* Footer — hotline + social */}
      <section className="mt-6 border-t border-brdr pt-4">
        <a
          href={`tel:${hotline.replace(/\s/g, '')}`}
          className="unstyled flex items-center gap-3 rounded-sm bg-surface-subtle px-3 py-2.5 text-sm font-semibold text-ink"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-price text-white">
            <Phone size={14} />
          </span>
          <span className="flex-1">
            <span className="block text-[11px] uppercase tracking-wide text-ink-muted">
              Hotline
            </span>
            {hotline}
          </span>
        </a>

        <div className="mt-3 flex items-center justify-center gap-2">
          <a
            href={`https://zalo.me/${zaloPhone.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Zalo"
            className="unstyled grid h-9 w-9 place-items-center rounded-full text-xs font-bold text-white"
            style={{ background: '#0068ff' }}
          >
            Zalo
          </a>
          <a
            href="https://m.me/61571555651500"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Messenger"
            className="unstyled grid h-9 w-9 place-items-center rounded-full text-white"
            style={{ background: '#7c3aed' }}
          >
            <MessageCircle size={16} />
          </a>
          <a
            href="https://facebook.com/61571555651500"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="unstyled grid h-9 w-9 place-items-center rounded-full text-white"
            style={{ background: '#1877f2' }}
          >
            <Facebook size={16} />
          </a>
        </div>
      </section>
    </Drawer>
  );
}
