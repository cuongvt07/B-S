'use client';

import { useEffect, useState } from 'react';
import { Facebook, FilePlus2, LogIn, MessageCircle, Phone, UserPlus, X } from 'lucide-react';
import { PostListingForm } from '@/components/dashboard';
import { Button, Modal, Spinner } from '@/components/ui';
import { useAuthModal } from '@/lib/hooks/useAuthModal';
import { useCurrentUser } from '@/lib/hooks/useAuth';
import { cn } from '@/lib/utils';
import { SITE } from '@/lib/constants';

const ITEMS = [
  {
    key: 'phone',
    label: 'Gọi ngay',
    href: `tel:${SITE.contactPhone.replace(/\s/g, '')}`,
    icon: Phone,
    color: '#16a34a',
  },
  {
    key: 'zalo',
    label: 'Chat Zalo',
    href: `https://zalo.me/${SITE.contactPhone.replace(/\s/g, '')}`,
    icon: MessageCircle,
    color: '#0068ff',
    isZalo: true,
  },
  {
    key: 'messenger',
    label: 'Messenger',
    href: 'https://m.me/61571555651500',
    icon: MessageCircle,
    color: '#7c3aed',
  },
  {
    key: 'facebook',
    label: 'Facebook',
    href: 'https://facebook.com/61571555651500',
    icon: Facebook,
    color: '#1877f2',
  },
];

function currentUrl() {
  if (typeof window === 'undefined') return undefined;
  return `${window.location.pathname}${window.location.search}`;
}

export function FloatingContacts() {
  const [open, setOpen] = useState(false);
  const [postOpen, setPostOpen] = useState(false);
  const [reopenPostAfterAuth, setReopenPostAfterAuth] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: user, isLoading } = useCurrentUser();
  const openLogin = useAuthModal((s) => s.openLogin);
  const openRegister = useAuthModal((s) => s.openRegister);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user || !reopenPostAfterAuth) return;
    setReopenPostAfterAuth(false);
    setPostOpen(true);
  }, [reopenPostAfterAuth, user]);

  if (!mounted) return null;

  function openPostPopup() {
    setOpen(false);
    setPostOpen(true);
  }

  function startLogin() {
    setPostOpen(false);
    setReopenPostAfterAuth(true);
    openLogin(currentUrl());
  }

  function startRegister() {
    setPostOpen(false);
    setReopenPostAfterAuth(true);
    openRegister(currentUrl());
  }

  const canPost = Boolean(user);

  return (
    <div
      className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6"
      aria-label="Liên hệ nhanh"
    >
      {open && (
        <ul className="flex flex-col items-end gap-2">
          {ITEMS.map((it, i) => {
            const Icon = it.icon;
            return (
              <li
                key={it.key}
                className="bds-fc-item flex items-center gap-2"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <span className="hidden rounded-full bg-ink-strong/90 px-3 py-1 text-xs font-medium text-white shadow-elevated sm:inline-flex">
                  {it.label}
                </span>
                <a
                  href={it.href}
                  target={it.href.startsWith('http') ? '_blank' : undefined}
                  rel={it.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={it.label}
                  className="unstyled grid h-11 w-11 place-items-center rounded-full text-white shadow-elevated transition-transform hover:scale-110 active:scale-95"
                  style={{ background: it.color }}
                >
                  {it.isZalo ? (
                    <span className="text-[13px] font-bold tracking-tight">Zalo</span>
                  ) : (
                    <Icon size={20} strokeWidth={2.2} />
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      )}

      <button
        type="button"
        onClick={openPostPopup}
        aria-label="Mở popup đăng tin"
        className="unstyled inline-flex h-12 items-center gap-2 rounded-full bg-danger px-4 text-sm font-bold text-white shadow-elevated transition-transform hover:scale-105 active:scale-95 sm:h-[52px] sm:px-5"
      >
        <FilePlus2 size={18} />
        <span>Đăng tin</span>
      </button>

      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-label={open ? 'Đóng menu liên hệ' : 'Mở menu liên hệ'}
        className={cn(
          'bds-fc-ripple relative grid h-14 w-14 place-items-center rounded-full text-white shadow-elevated transition-transform active:scale-95',
          !open && 'bds-fc-main'
        )}
        style={{ background: open ? '#525252' : '#0000ee' }}
      >
        {open ? <X size={22} /> : <Phone size={22} fill="currentColor" />}
      </button>

      <Modal
        open={postOpen}
        onClose={() => setPostOpen(false)}
        title={canPost ? 'Đăng tin mới' : 'Đăng nhập để đăng tin'}
        description={
          canPost
            ? 'Nhập thông tin BĐS, upload ảnh và gửi tin ngay tại popup này.'
            : 'Bạn cần đăng nhập hoặc tạo tài khoản trước khi đăng tin.'
        }
        size={canPost ? 'xl' : 'sm'}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-3 rounded-md border border-brdr bg-white p-10 text-sm text-ink-muted">
            <Spinner />
            <span>Đang kiểm tra đăng nhập...</span>
          </div>
        ) : canPost ? (
          <PostListingForm />
        ) : (
          <div className="space-y-4">
            <div className="rounded-md border border-brdr bg-surface-subtle p-4 text-sm text-ink-muted">
              <p className="font-semibold text-ink">Đăng tin trực tiếp trong popup</p>
              <p className="mt-1">
                Sau khi đăng nhập, bấm lại nút Đăng tin để mở form ngay trên trang hiện tại.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Button type="button" leftIcon={<LogIn size={16} />} onClick={startLogin}>
                Đăng nhập
              </Button>
              <Button
                type="button"
                variant="outline"
                leftIcon={<UserPlus size={16} />}
                onClick={startRegister}
              >
                Đăng ký
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
