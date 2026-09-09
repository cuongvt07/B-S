'use client';

import { ChartLineUp } from '@phosphor-icons/react';

export default function VaultSavingsPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center px-6 py-24 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-vaultgreen-soft text-vaultgreen">
        <ChartLineUp size={28} />
      </span>
      <h1 className="text-lg font-bold text-[#0B1220]">Tích lũy</h1>
      <p className="mt-1 text-sm text-[#667085]">Trang danh sách &amp; mở gói tích lũy chi tiết sẽ có ở bản tiếp theo.</p>
    </div>
  );
}
