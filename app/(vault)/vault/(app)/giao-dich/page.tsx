'use client';

import { ArrowsLeftRight } from '@phosphor-icons/react';
import { useVaultActivity } from '@/lib/vault/useVaultData';
import { formatVnd, formatVaultDate } from '@/lib/vault/format';

export default function VaultTransactionsPage() {
  const { data: activity } = useVaultActivity();

  return (
    <div className="mx-auto max-w-md px-4 pt-4">
      <h1 className="mb-4 text-lg font-bold text-[#0B1220]">Lịch sử giao dịch</h1>
      <div className="space-y-1 rounded-2xl border border-[#EAECF0] bg-white p-2 shadow-sm">
        {activity?.map((a) => (
          <div key={a.id} className="flex items-center justify-between rounded-xl px-2 py-2.5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F2F4F7]">
                <ArrowsLeftRight size={16} />
              </span>
              <div>
                <p className="text-sm font-semibold capitalize text-[#0B1220]">{a.type.replace(/_/g, ' ')}</p>
                <p className="text-xs text-[#98A2B3]">{formatVaultDate(a.createdAt)}</p>
              </div>
            </div>
            <span className={`text-sm font-bold ${a.amount >= 0 ? 'text-vaultgreen' : 'text-red-500'}`}>
              {a.amount >= 0 ? '+' : ''}
              {formatVnd(a.amount)} đ
            </span>
          </div>
        ))}
        {!activity?.length && <p className="py-10 text-center text-sm text-[#98A2B3]">Chưa có giao dịch nào</p>}
      </div>
    </div>
  );
}
