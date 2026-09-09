'use client';

import { create } from 'zustand';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getVaultToken, setVaultToken, vaultFetch } from './vaultClient';

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
