'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  House,
  ChartLineUp,
  ArrowsLeftRight,
  Gift,
  UserCircle,
} from '@phosphor-icons/react';
import { useVaultAuthFlag, useVaultMe } from '@/lib/vault/useVaultAuth';

const TABS = [
  { href: '/vault', label: 'Vaults', icon: House, exact: true },
  { href: '/vault/tich-luy', label: 'Tích lũy', icon: ChartLineUp },
  { href: '/vault/giao-dich', label: 'Giao dịch', icon: ArrowsLeftRight },
  { href: '/vault/gioi-thieu', label: 'Giới thiệu', icon: Gift },
  { href: '/vault/ho-so', label: 'Hồ sơ', icon: UserCircle },
] as const;

export default function VaultAppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const hasToken = useVaultAuthFlag((s) => s.hasToken);
  const { data: me, isLoading, isError } = useVaultMe();

  useEffect(() => {
    if (!hasToken) {
      router.replace('/vault/dang-nhap');
      return;
    }
    if (!isLoading && isError) {
      router.replace('/vault/dang-nhap');
    }
  }, [hasToken, isLoading, isError, router]);

  if (!hasToken || isLoading || !me) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-vaultgreen border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 pb-20">{children}</div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#EAECF0] bg-white px-2 pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto grid max-w-md grid-cols-5">
          {TABS.map((tab) => {
            const active = 'exact' in tab && tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
            const isCenter = tab.href === '/vault/giao-dich';
            const Icon = tab.icon;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex flex-col items-center justify-center gap-1 py-2"
              >
                {isCenter ? (
                  <span className="-mt-5 flex h-12 w-12 items-center justify-center rounded-full bg-vaultgreen text-white shadow-lg">
                    <Icon size={22} weight="bold" />
                  </span>
                ) : (
                  <Icon size={22} weight={active ? 'fill' : 'regular'} className={active ? 'text-vaultgreen' : 'text-[#98A2B3]'} />
                )}
                <span className={`text-[10px] font-semibold ${active ? 'text-vaultgreen' : 'text-[#98A2B3]'}`}>
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
