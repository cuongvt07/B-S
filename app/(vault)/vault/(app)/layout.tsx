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
import { useVaultAuthFlag, useVaultMe, useVaultUnauthorizedRedirect } from '@/lib/vault/useVaultAuth';
import { useVaultAccrueCheck } from '@/lib/vault/useVaultData';

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
  useVaultUnauthorizedRedirect(); // tự đăng xuất nếu BẤT KỲ request Vault nào (không riêng /auth/me) trả 401 giữa chừng
  const accrueCheck = useVaultAccrueCheck();

  useEffect(() => {
    // "Cron giả lập qua FE" — chạy 1 lần khi vào bất kỳ trang nào trong module
    // Vault (không chỉ Dashboard), ngay khi đã xác nhận đăng nhập thành công.
    // Thay thế `php artisan schedule:run` trên hosting không cấu hình được
    // cron thật — xem VaultCronController::accrueCheck ở BE.
    if (me) {
      accrueCheck.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me?.id]);

  useEffect(() => {
    if (!hasToken) {
      router.replace('/vault/dang-nhap');
      return;
    }
    // Ưu tiên kiểm tra isError trước — nếu query đã fail (vd 401), không đợi
    // "!me" nữa (me luôn undefined khi lỗi) để tránh kẹt màn hình loading vô
    // hạn trước khi effect này kịp chạy.
    if (isError) {
      router.replace('/vault/dang-nhap');
    }
  }, [hasToken, isError, router]);

  if (!hasToken || isError) {
    return null; // sắp điều hướng ngay (useEffect ở trên) — không cần hiện gì.
  }

  if (isLoading || !me) {
    return (
      <div className="flex h-full min-h-screen items-center justify-center sm:min-h-0">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-vaultgreen border-t-transparent" />
      </div>
    );
  }

  return (
    // min-h-screen cho mobile thật (đứng riêng, không có khung cha); trên
    // desktop nằm trong .vault-frame (overflow-y-auto cố định chiều cao) nên
    // đổi sang h-full để không tự tạo thanh cuộn thứ 2 lồng bên trong khung.
    <div className="flex min-h-screen flex-col sm:h-full sm:min-h-0">
      <div className="flex-1 pb-20">{children}</div>

      {/* sticky (không phải fixed) — dính đáy of khung .vault-frame trên
          desktop lẫn đáy viewport trên mobile, không cần code riêng 2 case. */}
      <nav className="sticky inset-x-0 bottom-0 z-40 border-t border-[#EAECF0] bg-white px-2 pb-[env(safe-area-inset-bottom)]">
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
