'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Question, Bank, Plus, CheckCircle, Fingerprint, Warning } from '@phosphor-icons/react';
import { useVaultAccounts, useVaultBankAccounts, useCreateVaultWithdrawal } from '@/lib/vault/useVaultData';
import { formatVnd } from '@/lib/vault/format';
import { VaultApiError } from '@/lib/vault/vaultClient';

const QUICK_AMOUNTS = [2_000_000, 5_000_000, 10_000_000];

export default function VaultWithdrawPage() {
  const router = useRouter();
  const { data: vaults } = useVaultAccounts();
  const { data: bankAccounts } = useVaultBankAccounts();
  const createWithdrawal = useCreateVaultWithdrawal();

  const flexibleVault = useMemo(() => vaults?.find((v) => v.type === 'flexible') ?? vaults?.[0], [vaults]);
  const [selectedBankId, setSelectedBankId] = useState<number | null>(null);
  const [amountInput, setAmountInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const defaultBank = bankAccounts?.find((b) => b.isDefault) ?? bankAccounts?.[0];
  const activeBankId = selectedBankId ?? defaultBank?.id ?? null;
  const amount = Number(amountInput.replace(/\D/g, '')) || 0;
  const available = flexibleVault?.totalBalance ?? 0;
  const balanceAfter = Math.max(0, available - amount);
  const otherVaultsLocked = (vaults?.length ?? 0) > 1;

  async function handleConfirm() {
    setError(null);
    if (!flexibleVault || !activeBankId) return;
    if (amount < 50_000) {
      setError('Số tiền rút tối thiểu là 50.000đ');
      return;
    }
    if (amount > available) {
      setError('Số tiền vượt quá số dư khả dụng');
      return;
    }

    try {
      await createWithdrawal.mutateAsync({
        vaultId: flexibleVault.id,
        bankAccountId: activeBankId,
        amount,
      });
      setSuccess(true);
    } catch (e) {
      setError(e instanceof VaultApiError ? e.message : 'Rút tiền thất bại, thử lại sau');
    }
  }

  if (success) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
        <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-vaultgreen-soft text-vaultgreen">
          <CheckCircle size={36} weight="fill" />
        </span>
        <h1 className="text-xl font-bold text-[#0B1220]">Yêu cầu rút tiền đã được tạo</h1>
        <p className="mt-2 text-sm text-[#667085]">
          {formatVnd(amount)} đ đang được xử lý qua Napas 24/7, tiền sẽ về tài khoản ngân hàng của bạn trong ít phút.
        </p>
        <Link
          href="/vault"
          className="mt-8 w-full rounded-xl bg-vaultgreen py-3.5 text-center text-base font-bold text-white shadow-lg"
        >
          Về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 pb-8 pt-4">
      <div className="mb-4 flex items-center justify-between">
        <button type="button" onClick={() => router.back()} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F2F4F7]">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-base font-bold text-[#0B1220]">Rút tiền về ngân hàng</h1>
        <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F2F4F7]">
          <Question size={18} />
        </button>
      </div>

      {/* Nguồn rút */}
      <div className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-vaultgreen-soft text-vaultgreen">
              <Bank size={18} />
            </span>
            <div>
              <p className="text-xs text-[#667085]">Nguồn rút tiền</p>
              <p className="font-bold text-[#0B1220]">{flexibleVault?.name ?? '—'}</p>
            </div>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-vaultgreen-soft px-2.5 py-1 text-xs font-bold text-vaultgreen">
            <span className="h-1.5 w-1.5 rounded-full bg-vaultgreen" /> Miễn phí 24/7
          </span>
        </div>

        <div className="mt-3 rounded-xl bg-[#F8FAF9] p-3">
          <p className="text-xs text-[#667085]">Số dư khả dụng rút ngay</p>
          <p className="text-2xl font-black text-vaultgreen">{formatVnd(available)} đ</p>
        </div>

        {otherVaultsLocked && (
          <div className="mt-3 flex gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
            <Warning size={16} className="mt-0.5 shrink-0" />
            <span>
              <strong>Lưu ý:</strong> Các gói Két có kỳ hạn khác chưa đến ngày đáo hạn sẽ không được rút tại đây. Vào mục Tích lũy để xem chi tiết.
            </span>
          </div>
        )}
      </div>

      {/* Tài khoản nhận tiền */}
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-bold text-[#0B1220]">Tài khoản nhận tiền</h2>
          <span className="text-xs text-[#667085]">{bankAccounts?.length ?? 0} tài khoản</span>
        </div>
        <div className="space-y-2">
          {bankAccounts?.map((b) => {
            const active = b.id === activeBankId;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setSelectedBankId(b.id)}
                className={`flex w-full items-center justify-between rounded-2xl border-2 bg-white p-3.5 text-left transition ${
                  active ? 'border-vaultgreen' : 'border-[#EAECF0]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F2F4F7]">
                    <Bank size={18} />
                  </span>
                  <div>
                    <p className="flex items-center gap-1.5 text-sm font-bold text-[#0B1220]">
                      {b.bankName} ({b.maskedNumber})
                      {b.isVerified && <CheckCircle size={14} weight="fill" className="text-vaultgreen" />}
                    </p>
                    <p className="text-xs text-[#667085]">{b.accountName}</p>
                  </div>
                </div>
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    active ? 'border-vaultgreen bg-vaultgreen' : 'border-[#D0D5DD]'
                  }`}
                >
                  {active && <CheckCircle size={14} weight="fill" className="text-white" />}
                </span>
              </button>
            );
          })}

          <Link
            href="/vault/ho-so"
            className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#D0D5DD] py-3.5 text-sm font-bold text-[#475467]"
          >
            <Plus size={16} weight="bold" /> Thêm tài khoản ngân hàng mới
          </Link>
        </div>
      </div>

      {/* Số tiền */}
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-bold text-[#0B1220]">Số tiền cần rút</h2>
          <span className="text-xs text-[#667085]">Tối thiểu: 50.000 đ</span>
        </div>
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
              {(a / 1_000_000).toLocaleString('vi-VN')}tr
            </button>
          ))}
          <button
            type="button"
            onClick={() => setAmountInput(String(available))}
            className={`rounded-xl py-2 text-xs font-bold ${
              amount === available && available > 0 ? 'bg-vaultgreen text-white' : 'bg-[#F2F4F7] text-[#475467]'
            }`}
          >
            Rút hết
          </button>
        </div>
      </div>

      {/* Chi tiết dòng tiền */}
      <div className="mt-4 space-y-2.5 rounded-2xl border border-[#EAECF0] bg-white p-4 text-sm shadow-sm">
        <p className="mb-1 font-bold text-[#0B1220]">Chi tiết dòng tiền minh bạch</p>
        <div className="flex items-center justify-between">
          <span className="text-[#667085]">Phí rút tiền</span>
          <span className="font-bold text-vaultgreen">MIỄN PHÍ (0đ)</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#667085]">Thời gian nhận tiền</span>
          <span className="font-bold text-[#0B1220]">⚡ Napas 24/7 (&lt; 30 giây)</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#667085]">Số dư két sau khi rút</span>
          <span className="font-bold text-[#0B1220]">{formatVnd(balanceAfter)} đ</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#667085]">
            Tiền lãi dự kiến mỗi ngày <span className="block text-xs text-[#98A2B3]">Tính theo số dư mới</span>
          </span>
          <span className="font-bold text-vaultgreen">
            ~{formatVnd((balanceAfter * (Number(flexibleVault?.interestRateYearly ?? 0)) / 100) / 365)} đ/ngày
          </span>
        </div>
      </div>

      {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <div className="sticky bottom-24 mt-6">
        <button
          type="button"
          onClick={handleConfirm}
          disabled={createWithdrawal.isPending || amount <= 0 || !activeBankId}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-vaultgreen py-4 text-base font-bold text-white shadow-xl disabled:opacity-50"
        >
          <Fingerprint size={20} weight="bold" />
          {createWithdrawal.isPending ? 'Đang xử lý...' : `Xác nhận rút ${formatVnd(amount)} đ`}
        </button>
        <p className="mt-2 flex items-center justify-center gap-1 text-center text-xs text-[#98A2B3]">
          Xác nhận tức thì qua Face ID hoặc mã PIN Vault
        </p>
      </div>
    </div>
  );
}
