'use client';

import { useEffect, useState } from 'react';
import { Phone, MessageCircle, X, Facebook } from 'lucide-react';
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
    icon: MessageCircle, // dùng tạm lucide; Zalo brand mark sẽ là chữ Z
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
      {/* Stack items */}
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

      {/* Main toggle button */}
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
    </div>
  );
}
