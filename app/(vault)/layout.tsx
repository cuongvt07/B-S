import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';

/**
 * Layout gốc cho module Vault — chỉ set metadata + nền, KHÔNG mang theo
 * header/footer/nav của site chính (marketing/dashboard). Guard đăng nhập nằm
 * ở app/(vault)/vault/(app)/layout.tsx (route con), không ở đây.
 *
 * Font RIÊNG cho Vault (Plus Jakarta Sans — geometric, chuẩn fintech mobile
 * app: Cash App/Revolut/Momo đều dùng font cùng họ), KHÔNG dùng chung Manrope
 * của site BĐS chính — chỉ áp dụng trong .vault-frame (xem globals.css).
 */
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-vault',
});

export const metadata: Metadata = {
  title: { default: 'Vault — Tích lũy sinh lời', template: '%s | Vault' },
  robots: { index: false, follow: false }, // module nội bộ, không cần SEO index
};

export default function VaultRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${plusJakarta.variable} h-dvh bg-[#E7ECEA] text-[#0B1220] sm:flex sm:items-center sm:justify-center`}>
      {/*
        Vault là giao diện MOBILE-FIRST. Trên màn hình rộng (>=640px), đóng
        khung lại như đang mở trên điện thoại (max-w cố định + shadow viền)
        thay vì trải full-width — tránh input/nút bị kéo dãn xấu trên PC.
        Khung cao ĐỦ 100dvh (trừ viền để không chạm mép màn hình) — không còn
        bị che/cắt nội dung, cuộn xảy ra BÊN TRONG khung (overflow-y-auto) chứ
        không phải khung tự hụt. `vault-frame` (tên class neo) để layout con
        (app)/layout.tsx định vị bottom nav THEO KHUNG này trên desktop.
      */}
      <div className="vault-frame relative h-dvh w-full overflow-y-auto bg-[#F4F7F5] sm:my-4 sm:h-[calc(100dvh-2rem)] sm:w-[430px] sm:rounded-[2.5rem] sm:shadow-2xl sm:ring-1 sm:ring-black/5">
        {children}
      </div>
    </div>
  );
}
