'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { authApi } from '@/lib/api/auth';
import { getApiToken } from '@/lib/api/realClient';
import type { User } from '@/types';

/**
 * Auth performance: anonymous users (~95% of traffic) should never wait for /auth/me.
 * We persist a tiny flag in localStorage after a successful login. On every page load
 * `useCurrentUser` checks the flag — if absent, it short-circuits to `null` instantly
 * and never hits the network. If present, it fires /auth/me once per session and
 * caches the result forever (refetched only on explicit invalidate / login / logout).
 */
const AUTH_HINT_KEY = 'bds:auth-hint';

function readAuthHint(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(AUTH_HINT_KEY) === '1' || Boolean(getApiToken());
  } catch {
    return false;
  }
}

function writeAuthHint(value: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    if (value) window.localStorage.setItem(AUTH_HINT_KEY, '1');
    else window.localStorage.removeItem(AUTH_HINT_KEY);
  } catch {
    // ignore quota / private-mode
  }
}

export function useCurrentUser() {
  // Read once per mount so SSR hydration sees a stable value.
  const hasHint = useMemo(() => readAuthHint(), []);

  return useQuery<User | null>({
    queryKey: ['me'],
    queryFn: async () => {
      try {
        const res = await authApi.me();
        writeAuthHint(true);
        return res.data;
      } catch {
        // 401/network → no session. Drop hint so next reload skips the call.
        writeAuthHint(false);
        return null;
      }
    },
    // Anonymous users get an immediate `null` and no fetch.
    initialData: hasHint ? undefined : (null as User | null),
    enabled: hasHint,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (res) => {
      writeAuthHint(true);
      qc.setQueryData(['me'], res.data.user);
    },
  });
}

export function useRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (res) => {
      writeAuthHint(true);
      qc.setQueryData(['me'], res.data.user);
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      writeAuthHint(false);
      qc.setQueryData(['me'], null);
      qc.invalidateQueries();
    },
  });
}
