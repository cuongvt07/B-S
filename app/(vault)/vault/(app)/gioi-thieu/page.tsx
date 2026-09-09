'use client';

import { useState } from 'react';
import { Gift, Copy, Check } from '@phosphor-icons/react';
import { useVaultMe } from '@/lib/vault/useVaultAuth';

export default function VaultReferralPage() {
  const { data: me } = useVaultMe();
  const [copied, setCopied] = useState(false);

  function copyCode() {
    if (!me?.referralCode) return;
    navigator.clipboard?.writeText(me.referralCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="mx-auto max-w-md px-4 pt-4">
      <h1 className="mb-4 text-lg font-bold text-[#0B1220]">Giới thiệu bạn bè</h1>

      <div className="rounded-2xl bg-gradient-to-br from-[#4A3400] to-vaultgreen-dark p-5 text-center text-white shadow-lg">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-vaultgreen-gold">
          <Gift size={24} className="text-[#5C4400]" />
        </span>
        <p className="mt-3 font-bold">Mời bạn nhận ngay 50.000đ</p>
        <p className="mt-1 text-xs text-white/75">
          Cộng thêm thưởng trọn đời <span className="font-semibold text-amber-300">0.5% hoa hồng lãi</span> mỗi ngày từ giao dịch của bạn bè.
        </p>

        <div className="mt-4 flex items-center justify-between rounded-xl bg-white/10 px-4 py-3">
          <span className="text-lg font-black tracking-widest">{me?.referralCode ?? '——————'}</span>
          <button type="button" onClick={copyCode} className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-sm font-bold text-vaultgreen-dark">
            {copied ? <Check size={14} weight="bold" /> : <Copy size={14} weight="bold" />}
            {copied ? 'Đã chép' : 'Sao chép'}
          </button>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-[#667085]">Chi tiết danh sách bạn bè đã mời sẽ có ở bản tiếp theo.</p>
    </div>
  );
}
