'use client';

import Link from 'next/link';
import { Drawer } from '@/components/ui';
import { MENU_DATA } from './MegaMenu';
import { useAuthModal } from '@/lib/hooks/useAuthModal';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function MobileDrawer({ open, onClose }: Props) {
  const openLogin = useAuthModal((s) => s.openLogin);
  const openRegister = useAuthModal((s) => s.openRegister);

  return (
    <Drawer open={open} onClose={onClose} side="left" title="Danh mục">
      <div className="space-y-4">
        {MENU_DATA.MENU.map((group) => (
          <div key={group.title}>
            <Link
              href={group.href}
              onClick={onClose}
              className="unstyled block text-base font-semibold text-ink"
            >
              {group.title}
            </Link>
            <div className="mt-2 space-y-1 border-l border-brdr pl-3">
              {group.children.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  onClick={onClose}
                  className="unstyled block py-1 text-sm text-ink-muted hover:text-primary"
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
        <div className="border-t border-brdr pt-3 space-y-2">
          {MENU_DATA.SIMPLE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="unstyled block text-base font-semibold text-ink"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="border-t border-brdr pt-3 space-y-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              openLogin();
            }}
            className="block w-full text-left text-base text-ink"
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              openRegister();
            }}
            className="block w-full text-left text-base text-ink"
          >
            Đăng ký
          </button>
          <Link
            href="/tai-khoan/dang-tin"
            onClick={onClose}
            className="unstyled mt-2 inline-flex w-full items-center justify-center rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            Đăng tin
          </Link>
        </div>
      </div>
    </Drawer>
  );
}
