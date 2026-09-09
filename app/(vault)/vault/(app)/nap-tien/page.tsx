'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bank, CheckCircle } from '@phosphor-icons/react';
import { useVaultAccounts, useCreateVaultDeposit } from '@/lib/vault/useVaultData';
import { formatVnd } from '@/lib/vault/format';
import { VaultApiError } from '@/lib/vault/vaultClient';

const QUICK_AMOUNTS = [500_000, 2_000_000, 10_000_000, 50_000_000];

export default function VaultDepositPage() {
  const router = useRouter();
  const { data: vaults } = useVaultAccounts();
  const createDeposit = useCreateVaultDeposit();

  const flexibleVault = useMemo(() => vaults?.find((v) => v.type === 'flexible') ?? vaults?.[0], [vaults]);
  const [amountInput, setAmountInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const amount = Number(amountInput.replace(/\D/g, '')) || 0;

  async function handleConfirm() {
    setError(null);
    if (!flexibleVault) return;
    if (amount < 10_000) {
      setError('Số tiền nạp tối thiểu là 10.000đ');
      return;
    }
    try {
      await createDeposit.mutateAsync({ vaultId: flexibleVault.id, amount });
      setSuccess(true);
    } catch (e) {
      setError(e instanceof VaultApiError ? e.message : 'Nạp tiền thất bại, thử lại sau');
    }
  }

  if (success) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
        <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-vaultgreen-soft text-vaultgreen">
          <CheckCircle size={36} weight="fill" />
        </span>
        <h1 className="text-xl font-bold text-[#0B1220]">Yêu cầu nạp tiền đã được tạo</h1>
        <p className="mt-2 text-sm text-[#667085]">
          {formatVnd(amount)} đ đang được xác nhận, sẽ vào két của bạn trong ít giây.
        </p>
        <Link href="/vault" className="mt-8 w-full rounded-xl bg-vaultgreen py-3.5 text-center text-base font-bold text-white shadow-lg">
          Về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 pb-8 pt-4">
      <div className="mb-4 flex items-center gap-3">
        <button type="button" onClick={() => router.back()} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F2F4F7]">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-base font-bold text-[#0B1220]">Nạp cất giữ</h1>
      </div>

      <div className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-vaultgreen-soft text-vaultgreen">
            <Bank size={18} />
          </span>
          <div>
            <p className="text-xs text-[#667085]">Nạp vào két</p>
            <p className="font-bold text-[#0B1220]">{flexibleVault?.name ?? '—'}</p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h2 className="mb-2 font-bold text-[#0B1220]">Số tiền cần nạp</h2>
        <div className="flex items-center justify-between rounded-2xl border-2 border-[#EAECF0] bg-white px-4 py-4 focus-within:border-vaultgreen">
          <input
            inputMode="numeric"
            placeholder="0"
            value={amountInput ? Number(amountInput).toLocaleString('vi-VN') : ''}
            onChange={(e) => setAmountInput(e.target.value.replace(/\D/g, ''))}
            className="w-full bg-transparent text-2xl font-bold text-[#0B1220] outline-none"
          />
          <span className="text-lg font-bold text-[#98A2B3]">đ</span>
        </div>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {QUICK_AMOUNTS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAmountInput(String(a))}
              className={`rounded-xl py-2 text-xs font-bold ${
                amount === a ? 'bg-vaultgreen text-white' : 'bg-[#F2F4F7] text-[#475467]'
              }`}
            >
              {a >= 1_000_000 ? `${a / 1_000_000}tr` : `${a / 1_000}k`}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 rounded-xl bg-[#F8FAF9] p-3 text-xs text-[#667085]">
        Đây là môi trường mô phỏng để test luồng — tiền sẽ được cộng vào két sau vài giây, không qua cổng thanh toán thật.
      </p>

      {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <button
        type="button"
        onClick={handleConfirm}
        disabled={createDeposit.isPending || amount <= 0}
        className="mt-6 w-full rounded-2xl bg-vaultgreen py-4 text-base font-bold text-white shadow-xl disabled:opacity-50"
      >
        {createDeposit.isPending ? 'Đang xử lý...' : `Xác nhận nạp ${formatVnd(amount)} đ`}
      </button>
    </div>
  );
}
