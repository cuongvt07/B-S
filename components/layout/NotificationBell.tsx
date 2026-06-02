'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Bell, Home, Info, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTimeAgo } from '@/lib/utils/format';

type NotifType = 'listing' | 'system' | 'message';

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

const INITIAL: Notification[] = [
  {
    id: 'n1',
    type: 'listing',
    title: 'Có 3 tin đăng mới phù hợp với bạn',
    body: 'Tìm kiếm "Căn hộ 2PN Quận 7" có kết quả mới.',
    createdAt: '2026-05-30T10:00:00Z',
    read: false,
  },
  {
    id: 'n2',
    type: 'message',
    title: 'Trần Thuỳ Linh đã liên hệ',
    body: 'Anh/chị có còn cho thuê căn hộ Vinhomes không ạ?',
    createdAt: '2026-05-29T15:30:00Z',
    read: false,
  },
  {
    id: 'n3',
    type: 'system',
    title: 'Tin VIP sắp hết hạn',
    body: 'Tin "Cho thuê nhà nguyên căn Gò Vấp" hết hạn sau 3 ngày.',
    createdAt: '2026-05-29T08:00:00Z',
    read: false,
  },
  {
    id: 'n4',
    type: 'listing',
    title: 'Giá BĐS khu Thảo Điền tăng 8%',
    body: 'Báo cáo Q1/2026 vừa được phát hành.',
    createdAt: '2026-05-27T11:00:00Z',
    read: true,
  },
  {
    id: 'n5',
    type: 'system',
    title: 'Cập nhật chính sách bảo mật',
    body: 'Chính sách mới có hiệu lực từ 01/06/2026.',
    createdAt: '2026-05-25T09:00:00Z',
    read: true,
  },
  {
    id: 'n6',
    type: 'message',
    title: 'Phản hồi từ admin',
    body: 'Yêu cầu xác thực tin đăng đã được duyệt.',
    createdAt: '2026-05-24T14:00:00Z',
    read: true,
  },
];

const TYPE_STYLE: Record<NotifType, { bg: string; text: string; Icon: typeof Bell }> = {
  listing: { bg: 'bg-primary/10', text: 'text-primary', Icon: Home },
  system: { bg: 'bg-vip-soft', text: 'text-vip', Icon: Info },
  message: { bg: 'bg-price-soft', text: 'text-price', Icon: MessageSquare },
};

export function NotificationBell() {
  const [items, setItems] = useState<Notification[]>(INITIAL);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const unreadCount = items.filter((i) => !i.read).length;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function markAllRead() {
    setItems((prev) => prev.map((it) => ({ ...it, read: true })));
  }

  function clickItem(id: string) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, read: true } : it)));
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        aria-label="Thông báo"
        onClick={() => setOpen((v) => !v)}
        className="relative grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-surface-subtle hover:text-primary"
      >
        <Bell size={20} strokeWidth={2.1} />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-danger px-1 text-[10px] font-semibold text-white ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 flex max-h-[480px] w-[360px] flex-col overflow-hidden rounded-md border border-brdr bg-white shadow-elevated animate-fadeIn">
          <div className="flex items-center justify-between border-b border-brdr px-4 py-3">
            <span className="font-semibold text-ink">Thông báo</span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs text-primary hover:underline"
              >
                Đánh dấu đã đọc
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <p className="py-8 text-center text-sm text-ink-muted">Chưa có thông báo nào</p>
            ) : (
              items.map((it) => {
                const s = TYPE_STYLE[it.type];
                const Icon = s.Icon;
                return (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => clickItem(it.id)}
                    className={cn(
                      'flex w-full gap-3 border-b border-brdr px-4 py-3 text-left last:border-0 hover:bg-surface-subtle',
                      !it.read && 'border-l-2 border-l-primary bg-primary/5'
                    )}
                  >
                    <div
                      className={cn(
                        'grid h-9 w-9 shrink-0 place-items-center rounded-md',
                        s.bg,
                        s.text
                      )}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <p className="line-clamp-1 text-sm font-semibold text-ink">{it.title}</p>
                      <p className="line-clamp-2 text-xs text-ink-muted">{it.body}</p>
                      <p className="text-[11px] text-ink-muted">{formatTimeAgo(it.createdAt)}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <div className="border-t border-brdr px-4 py-3 text-center">
            <Link
              href="/tai-khoan"
              className="text-sm text-primary hover:underline"
              onClick={() => setOpen(false)}
            >
              Xem tất cả thông báo
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
