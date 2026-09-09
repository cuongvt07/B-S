'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { vaultFetch } from './vaultClient';

export interface VaultSummary {
  totalBalance: number;
  totalPrincipal: number;
  totalInterestReceived: number;
  monthlyGrowthPct: number;
  estimatedDailyInterest: number;
  vaultsCount: number;
}

export interface VaultAccountItem {
  id: number;
  type: 'flexible' | 'fixed_term';
  name: string;
  interestRateYearly: number;
  principalAmount: number;
  accruedInterestAmount: number;
  totalBalance: number;
  termDays: number | null;
  maturesAt: string | null;
  autoCompound: boolean;
  estimatedDailyInterest: number;
  status: string;
}

export interface VaultInterestChart {
  series: { date: string; amount: number }[];
  total: number;
  average: number;
}

export interface VaultActivityItem {
  id: number;
  type: string;
  amount: number;
  createdAt: string;
  meta: Record<string, unknown> | null;
}

export interface VaultBankAccountItem {
  id: number;
  bankCode: string;
  bankName: string;
  maskedNumber: string;
  accountName: string;
  isDefault: boolean;
  isVerified: boolean;
}

interface AccrueCheckResult {
  skipped: boolean;
  reason?: string;
  vaultsProcessed?: number;
  daysAccrued?: number;
}

/**
 * "Cron giả lập qua FE" — gọi 1 lần khi Dashboard mount để BE tự bù lãi mọi
 * ngày còn thiếu (xem VaultCronController::accrueCheck ở BE). Thay thế
 * `php artisan schedule:run` trên hosting không cấu hình được cron thật.
 *
 * An toàn khi gọi nhiều lần/nhiều user: BE tự throttle 60s + idempotent theo
 * ngày, nên không cần lo gọi trùng hay tốn tài nguyên.
 */
export function useVaultAccrueCheck() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => vaultFetch<AccrueCheckResult>('/cron/accrue-check', { method: 'POST' }),
    onSuccess: (result) => {
      // Chỉ refetch nếu THỰC SỰ có lãi mới được cộng — tránh invalidate vô ích
      // mỗi lần mở app khi không có gì thay đổi.
      if (!result.skipped && (result.daysAccrued ?? 0) > 0) {
        qc.invalidateQueries({ queryKey: ['vault', 'summary'] });
        qc.invalidateQueries({ queryKey: ['vault', 'vaults'] });
        qc.invalidateQueries({ queryKey: ['vault', 'interest-chart'] });
        qc.invalidateQueries({ queryKey: ['vault', 'activity'] });
      }
    },
    // Lỗi ở đây (vd mất mạng) không quan trọng — Dashboard vẫn hiển thị bình
    // thường với dữ liệu cũ, lần mở app sau sẽ tự bù tiếp. Không cần báo lỗi
    // cho user.
    onError: () => {},
  });
}

export function useVaultSummary() {
  return useQuery({
    queryKey: ['vault', 'summary'],
    queryFn: () => vaultFetch<VaultSummary>('/dashboard/summary'),
  });
}

export function useVaultAccounts() {
  return useQuery({
    queryKey: ['vault', 'vaults'],
    queryFn: () => vaultFetch<VaultAccountItem[]>('/dashboard/vaults'),
  });
}

export function useVaultInterestChart() {
  return useQuery({
    queryKey: ['vault', 'interest-chart'],
    queryFn: () => vaultFetch<VaultInterestChart>('/dashboard/interest-chart'),
  });
}

export function useVaultActivity() {
  return useQuery({
    queryKey: ['vault', 'activity'],
    queryFn: () => vaultFetch<VaultActivityItem[]>('/dashboard/activity'),
  });
}

export function useVaultBankAccounts() {
  return useQuery({
    queryKey: ['vault', 'bank-accounts'],
    queryFn: () => vaultFetch<VaultBankAccountItem[]>('/bank-accounts'),
  });
}

export function useAddVaultBankAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { bankCode: string; accountNumber: string; accountName: string }) =>
      vaultFetch<VaultBankAccountItem>('/bank-accounts', {
        method: 'POST',
        body: {
          bank_code: input.bankCode,
          account_number: input.accountNumber,
          account_name: input.accountName,
        },
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vault', 'bank-accounts'] }),
  });
}

export function useCreateVaultWithdrawal() {
  const qc = useQueryClient();
  return useMutation({
    // idempotencyKey PHẢI do nơi gọi sinh 1 LẦN DUY NHẤT khi mở form (xem
    // lib/vault/useIdempotencyKey.ts) và giữ nguyên cho mọi lần bấm lại của
    // CÙNG một giao dịch — double-tap/mất mạng-rồi-thử-lại sẽ gửi lại đúng
    // key này, để BE nhận diện là trùng thay vì tạo lệnh rút tiền thứ 2.
    mutationFn: (input: { vaultId: number; bankAccountId: number; amount: number; idempotencyKey: string }) =>
      vaultFetch<{ id: number; status: string }>('/withdrawals', {
        method: 'POST',
        body: {
          vault_id: input.vaultId,
          bank_account_id: input.bankAccountId,
          amount: input.amount,
          idempotency_key: input.idempotencyKey,
        },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['vault', 'summary'] });
      qc.invalidateQueries({ queryKey: ['vault', 'vaults'] });
      qc.invalidateQueries({ queryKey: ['vault', 'activity'] });
    },
  });
}

export function useCreateVaultDeposit() {
  const qc = useQueryClient();
  return useMutation({
    // Xem ghi chú idempotencyKey ở useCreateVaultWithdrawal — áp dụng tương tự.
    mutationFn: (input: { vaultId: number; amount: number; idempotencyKey: string }) =>
      vaultFetch<{ id: number; status: string }>('/deposits', {
        method: 'POST',
        body: { vault_id: input.vaultId, amount: input.amount, idempotency_key: input.idempotencyKey },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['vault', 'summary'] });
      qc.invalidateQueries({ queryKey: ['vault', 'vaults'] });
      qc.invalidateQueries({ queryKey: ['vault', 'activity'] });
    },
  });
}
