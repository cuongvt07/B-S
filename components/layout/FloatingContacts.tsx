'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Facebook, FilePlus2, MessageCircle, Phone, ShieldCheck, X } from 'lucide-react';
import { Button, Modal } from '@/components/ui';
import { cn } from '@/lib/utils';

const ITEMS = [
  {
    key: 'phone',
    label: 'Gọi ngay',
    href: 'tel:0981847977',
    icon: Phone,
    color: '#16a34a',
  },
  {
    key: 'zalo',
    label: 'Chat Zalo',
    href: 'https://zalo.me/0981847977',
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

export function FloatingContacts() {
  const [open, setOpen] = useState(false);
  const [postOpen, setPostOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

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
        onClick={() => setPostOpen(true)}
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
        title="Đăng tin bất động sản"
        description="Tạo tin đăng mới và quản lý trạng thái hiển thị ngay trong tài khoản của bạn."
        size="sm"
        footer={
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setPostOpen(false)}>
              Để sau
            </Button>
            <Link
              href="/tai-khoan/dang-tin"
              className="unstyled inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm bg-danger px-4 py-3 text-base text-white transition-opacity hover:opacity-90"
              onClick={() => setPostOpen(false)}
            >
              <FilePlus2 size={16} />
              <span>Đăng tin ngay</span>
            </Link>
          </div>
        }
      >
        <div className="space-y-3 text-sm text-ink-muted">
          <div className="flex gap-3 rounded-md border border-brdr bg-surface-subtle p-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-danger-soft text-danger">
              <FilePlus2 size={18} />
            </span>
            <div>
              <p className="font-semibold text-ink">Đăng tin mới</p>
              <p className="mt-1">
                Nhập thông tin BĐS, upload ảnh đã tối ưu và gửi tin lên hệ thống quản trị website.
              </p>
            </div>
          </div>
          <div className="flex gap-3 rounded-md border border-brdr bg-white p-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck size={18} />
            </span>
            <div>
              <p className="font-semibold text-ink">Theo dõi sau khi đăng</p>
              <p className="mt-1">
                Tin sẽ xuất hiện trong mục Tin của tôi và đồng bộ sang CMS website để duyệt, ẩn/hiện hoặc nâng VIP.
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
