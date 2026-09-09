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
  return <div className="min-h-screen bg-[#F4F7F5] text-[#0B1220]">{children}</div>;
}
