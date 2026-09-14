'use client';

import { create } from 'zustand';
import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getVaultToken, setVaultToken, setVaultUnauthorizedHandler, vaultFetch } from './vaultClient';

export interface VaultUser {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  avatarUrl: string | null;
  vipTier: 'standard' | 'vip_silver' | 'vip_gold';
  vaultCode: string;
  referralCode: string;
  ekycLevel: string;
  phoneVerified: boolean;
  faceIdEnabled: boolean;
  hasPinSet: boolean;
  dailyWithdrawalLimit: number;
}

interface AuthPayload {
  user: VaultUser;
  token: string;
}

interface VaultAuthState {
  hasToken: boolean;
  setHasToken: (v: boolean) => void;
}

// Cờ nhẹ để biết "có khả năng đã đăng nhập" trước khi query /auth/me chạy xong
// — tương tự lib/hooks/useAuth.ts của site chính nhưng KHÔNG dùng chung key.
export const useVaultAuthFlag = create<VaultAuthState>((set) => ({
  hasToken: typeof window !== 'undefined' && !!getVaultToken(),
  setHasToken: (v) => set({ hasToken: v }),
}));

export function useVaultMe() {
  const hasToken = useVaultAuthFlag((s) => s.hasToken);

  return useQuery<VaultUser | null>({
    queryKey: ['vault-me'],
    queryFn: () => vaultFetch<VaultUser>('/auth/me'),
    enabled: hasToken,
    retry: false,
    staleTime: 60_000,
  });
}

export function useVaultLogin() {
  const qc = useQueryClient();
  const setHasToken = useVaultAuthFlag((s) => s.setHasToken);

  return useMutation({
    mutationFn: (input: { phone: string; password: string }) =>
      vaultFetch<AuthPayload>('/auth/login', { method: 'POST', body: input }),
    onSuccess: (data) => {
      setVaultToken(data.token);
      setHasToken(true);
      qc.setQueryData(['vault-me'], data.user);
    },
  });
}

export function useVaultRegister() {
  const qc = useQueryClient();
  const setHasToken = useVaultAuthFlag((s) => s.setHasToken);

  return useMutation({
    mutationFn: (input: { name: string; phone: string; password: string; referralCode?: string }) =>
      vaultFetch<AuthPayload>('/auth/register', {
        method: 'POST',
        body: {
          name: input.name,
          phone: input.phone,
          password: input.password,
          referral_code: input.referralCode || undefined,
        },
      }),
    onSuccess: (data) => {
      setVaultToken(data.token);
      setHasToken(true);
      qc.setQueryData(['vault-me'], data.user);
    },
  });
}

/** Xác thực SĐT bằng OTP (purpose=verify_phone) — nâng eKYC lên cấp 1. */
export function useVerifyVaultPhone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { otpCode: string }) =>
      vaultFetch<VaultUser>('/auth/verify-phone', { method: 'POST', body: { otp_code: input.otpCode } }),
    onSuccess: (user) => {
      qc.setQueryData(['vault-me'], user);
    },
  });
}

/** Đặt/đổi PIN — bắt buộc OTP (purpose=set_pin) xác nhận trước, xem BE. */
export function useSetVaultPin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { pin: string; otpCode: string }) =>
      vaultFetch<null>('/auth/pin', { method: 'POST', body: { pin: input.pin, otp_code: input.otpCode } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['vault-me'] });
    },
  });
}

/**
 * Đăng ký 1 lần ở layout (app) — khi BẤT KỲ request Vault nào (không riêng
 * /auth/me) trả 401, xoá token + đưa về đăng nhập ngay lập tức. Xử lý đúng
 * case "token hết hạn giữa chừng khi đang dùng" (vd đang rút tiền).
 */
export function useVaultUnauthorizedRedirect() {
  const qc = useQueryClient();
  const setHasToken = useVaultAuthFlag((s) => s.setHasToken);
  const router = useRouter();

  useEffect(() => {
    setVaultUnauthorizedHandler(() => {
      setVaultToken(null);
      setHasToken(false);
      qc.setQueryData(['vault-me'], null);
      router.replace('/vault/dang-nhap');
    });
    return () => setVaultUnauthorizedHandler(null);
  }, [qc, setHasToken, router]);
}

export function useVaultLogout() {
  const qc = useQueryClient();
  const setHasToken = useVaultAuthFlag((s) => s.setHasToken);
  const router = useRouter();

  return useMutation({
    mutationFn: () => vaultFetch('/auth/logout', { method: 'POST' }),
    onSettled: () => {
      setVaultToken(null);
      setHasToken(false);
      qc.setQueryData(['vault-me'], null);
      router.replace('/vault/dang-nhap');
    },
  });
}
