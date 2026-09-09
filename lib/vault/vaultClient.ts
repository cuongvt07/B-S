/**
 * Client API riêng cho module Vault — HOÀN TOÀN TÁCH BIỆT khỏi lib/api/client.ts
 * và lib/api/realClient.ts của site chính.
 *
 * Khác biệt cố ý:
 * - Không `credentials: 'include'` — không gửi cookie/session của site BĐS.
 * - Không dùng cơ chế Sanctum CSRF cookie (ensureCsrf) của realClient.
 * - Chỉ dùng Bearer token thuần, lưu ở localStorage key `vault:auth-token`
 *   (khác hẳn `bds:api-token` của site chính).
 */

const TOKEN_KEY = 'vault:auth-token';
const PREFIX = '/api/vault/v1';

export class VaultApiError extends Error {
  constructor(message: string, public status: number, public errors?: Record<string, string[]>) {
    super(message);
    this.name = 'VaultApiError';
  }
}

export function getVaultToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setVaultToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // localStorage có thể bị chặn (private mode) — bỏ qua, không chặn luồng.
  }
}

interface VaultFetchOptions extends Omit<RequestInit, 'body'> {
  query?: Record<string, unknown>;
  body?: unknown;
}

function buildUrl(path: string, query?: Record<string, unknown>): string {
  const url = new URL(PREFIX + path, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null || v === '') continue;
      url.searchParams.set(k, String(v));
    }
  }
  return typeof window !== 'undefined' ? url.pathname + url.search : url.toString();
}

export async function vaultFetch<T>(path: string, init: VaultFetchOptions = {}): Promise<T> {
  const { query, body, headers, ...rest } = init;
  const token = getVaultToken();

  const res = await fetch(buildUrl(path, query), {
    ...rest,
    method: init.method ?? (body ? 'POST' : 'GET'),
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    // Cố ý KHÔNG có credentials: 'include' — Vault không dùng cookie.
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const message = payload?.message || `Lỗi máy chủ (${res.status})`;
    throw new VaultApiError(message, res.status, payload?.errors);
  }

  return (payload?.data ?? payload) as T;
}
