import type { Metadata } from 'next';

/**
 * Layout gốc cho module Vault — chỉ set metadata + nền, KHÔNG mang theo
 * header/footer/nav của site chính (marketing/dashboard). Guard đăng nhập nằm
 * ở app/(vault)/vault/(app)/layout.tsx (route con), không ở đây.
 */
export const metadata: Metadata = {
  title: { default: 'Vault — Tích lũy sinh lời', template: '%s | Vault' },
  robots: { index: false, follow: false }, // module nội bộ, không cần SEO index
};

export default function VaultRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#E7ECEA] text-[#0B1220] sm:flex sm:items-center sm:justify-center sm:py-6">
      {/*
        Vault là giao diện MOBILE-FIRST. Trên màn hình rộng (>=640px), đóng
        khung lại như đang mở trên điện thoại (max-w cố định + shadow viền)
        thay vì trải full-width — tránh input/nút bị kéo dãn xấu trên PC.
        `vault-frame` (tên class neo) để layout con (app)/layout.tsx định vị
        bottom nav THEO KHUNG này trên desktop, thay vì dính theo viewport.
      */}
      <div className="vault-frame relative min-h-screen w-full bg-[#F4F7F5] sm:min-h-[860px] sm:max-h-[92vh] sm:w-[430px] sm:overflow-y-auto sm:rounded-[2.5rem] sm:shadow-2xl sm:ring-1 sm:ring-black/5">
        {children}
      </div>
    </div>
  );
}
