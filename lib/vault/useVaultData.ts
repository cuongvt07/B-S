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

/**
 * Bước 1/2 của rút tiền — chỉ TẠO lệnh (status=pending_otp) + BE tự gửi OTP,
 * CHƯA trừ tiền. Phải gọi tiếp useConfirmVaultWithdrawal với mã OTP để tiền
 * thực sự rời két (xem CreateVaultWithdrawal::initiate/confirm ở BE).
 */
export function useCreateVaultWithdrawal() {
  return useMutation({
    // idempotencyKey PHẢI do nơi gọi sinh 1 LẦN DUY NHẤT khi mở form (xem
    // lib/vault/useIdempotencyKey.ts) và giữ nguyên cho mọi lần bấm lại của
    // CÙNG một giao dịch — double-tap/mất mạng-rồi-thử-lại sẽ gửi lại đúng
    // key này, để BE nhận diện là trùng thay vì tạo lệnh rút tiền thứ 2.
    mutationFn: (input: {
      vaultId: number;
      bankAccountId: number;
      amount: number;
      pin: string;
      idempotencyKey: string;
    }) =>
      vaultFetch<{ id: number; status: string }>('/withdrawals', {
        method: 'POST',
        body: {
          vault_id: input.vaultId,
          bank_account_id: input.bankAccountId,
          amount: input.amount,
          pin: input.pin,
          idempotency_key: input.idempotencyKey,
        },
      }),
  });
}

/** Bước 2/2 — xác nhận OTP đã gửi ở initiate, tiền thực sự được đẩy đi. */
export function useConfirmVaultWithdrawal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { withdrawalId: number; code: string }) =>
      vaultFetch<{ id: number; status: string }>(`/withdrawals/${input.withdrawalId}/confirm`, {
        method: 'POST',
        body: { code: input.code },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['vault', 'summary'] });
      qc.invalidateQueries({ queryKey: ['vault', 'vaults'] });
      qc.invalidateQueries({ queryKey: ['vault', 'activity'] });
    },
  });
}

export type VaultOtpPurpose = 'verify_phone' | 'set_pin' | 'withdrawal';

/** Gửi (hoặc gửi lại) OTP cho 1 trong 3 purpose dùng chung. */
export function useRequestVaultOtp() {
  return useMutation({
    mutationFn: (input: { purpose: VaultOtpPurpose; referenceId?: number }) =>
      vaultFetch<{ maskedPhone: string }>('/otp/request', {
        method: 'POST',
        body: { purpose: input.purpose, reference_id: input.referenceId },
      }),
  });
}

/**
 * Verify OTP "trần" (không kèm hành động nào khác) — dùng cho withdrawal khi
 * muốn kiểm tra mã trước, dù luồng chính thường verify trực tiếp qua
 * useConfirmVaultWithdrawal (gộp verify + thực thi rút tiền trong 1 lần gọi).
 */
export function useVerifyVaultOtp() {
  return useMutation({
    mutationFn: (input: { purpose: VaultOtpPurpose; code: string; referenceId?: number }) =>
      vaultFetch<{ verified: boolean }>('/otp/verify', {
        method: 'POST',
        body: { purpose: input.purpose, code: input.code, reference_id: input.referenceId },
      }),
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

export interface VaultEkycStatus {
  status: 'none' | 'pending' | 'approved' | 'rejected';
  rejectionReason?: string | null;
  submittedAt?: string;
  reviewedAt?: string | null;
  ekycLevel: string;
}

export function useVaultEkyc() {
  return useQuery({
    queryKey: ['vault', 'ekyc'],
    queryFn: () => vaultFetch<VaultEkycStatus>('/ekyc'),
  });
}

export interface SubmitVaultEkycInput {
  idNumber: string;
  fullName: string;
  dateOfBirth: string; // yyyy-mm-dd
  frontImage: File;
  backImage: File;
}

export function useSubmitVaultEkyc() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: SubmitVaultEkycInput) => {
      // multipart/form-data — 2 ảnh CCCD không thể gửi qua JSON thuần.
      const form = new FormData();
      form.append('id_number', input.idNumber);
      form.append('full_name', input.fullName);
      form.append('date_of_birth', input.dateOfBirth);
      form.append('front_image', input.frontImage);
      form.append('back_image', input.backImage);

      return vaultFetch<{ id: number; status: string }>('/ekyc', { method: 'POST', body: form });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['vault', 'ekyc'] });
    },
  });
}

/**
 * Đổi số điện thoại — 3 bước tuần tự, khớp VaultChangePhoneController ở BE:
 * start (OTP về số cũ) -> verifyOld (xác nhận số cũ + khai số mới, nhận
 * sessionToken) -> verifyNew (OTP về số mới + sessionToken -> đổi thật).
 */
export function useStartChangeVaultPhone() {
  return useMutation({
    mutationFn: () => vaultFetch<null>('/change-phone/start', { method: 'POST' }),
  });
}

export function useVerifyOldVaultPhone() {
  return useMutation({
    mutationFn: (input: { otpCode: string; newPhone: string }) =>
      vaultFetch<{ sessionToken: string }>('/change-phone/verify-old', {
        method: 'POST',
        body: { otp_code: input.otpCode, new_phone: input.newPhone },
      }),
  });
}

export function useVerifyNewVaultPhone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { sessionToken: string; otpCode: string }) =>
      vaultFetch<{ id: number; phone: string }>('/change-phone/verify-new', {
        method: 'POST',
        body: { session_token: input.sessionToken, otp_code: input.otpCode },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['vault-me'] });
    },
  });
}
