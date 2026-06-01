/**
 * Client for the real Laravel API (MediaBDS) at https://vmphuthinhland.com
 *
 * Authentication: Sanctum SPA (cookie + CSRF). Before any write (POST/PUT/DELETE),
 * fetch `/sanctum/csrf-cookie` to set the `XSRF-TOKEN` cookie, then read it and
 * send as `X-XSRF-TOKEN` header. All requests must be `credentials: include`.
 */
import { ApiError, type FetchOptions } from './client';

const REMOTE_HOST = process.env.NEXT_PUBLIC_REAL_API_URL ?? 'https://vmphuthinhland.com';
const PREFIX = '/api/v1';

// In the browser we go through Next.js rewrites (same-origin → cookies work).
// On the server we hit Laravel directly because rewrites only apply to browser traffic.
function getHost(): string {
  return typeof window === 'undefined' ? REMOTE_HOST : '';
}

function buildUrl(path: string, query?: FetchOptions['query']): string {
  const base = path.startsWith('http')
    ? path
    : `${getHost()}${PREFIX}${path.startsWith('/') ? path : `/${path}`}`;
  if (!query) return base;
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null || v === '') continue;
    sp.append(k, String(v));
  }
  const qs = sp.toString();
  return qs ? `${base}?${qs}` : base;
}

function getXsrfToken(): string | null {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

let csrfPromise: Promise<void> | null = null;

async function ensureCsrf(): Promise<void> {
  if (typeof window === 'undefined') return;
  if (getXsrfToken()) return;
  if (!csrfPromise) {
    // Always go through same-origin (Next.js rewrites proxy to Laravel) so the
    // XSRF-TOKEN cookie is set on this origin and is automatically attached.
    csrfPromise = fetch(`/sanctum/csrf-cookie`, {
      credentials: 'include',
    })
      .then(() => undefined)
      .catch(() => undefined)
      .finally(() => {
        csrfPromise = null;
      });
  }
  await csrfPromise;
}

export async function realFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { query, headers, ...init } = options;
  const method = (init.method ?? 'GET').toUpperCase();
  const isWrite = method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE';

  if (isWrite) await ensureCsrf();

  const url = buildUrl(path, query);
  const finalHeaders: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(headers as Record<string, string> | undefined),
  };
  if (isWrite) {
    const token = getXsrfToken();
    if (token) finalHeaders['X-XSRF-TOKEN'] = token;
  }

  const res = await fetch(url, {
    credentials: 'include',
    ...init,
    headers: finalHeaders,
  });

  if (!res.ok) {
    let payload: unknown;
    try {
      payload = await res.json();
    } catch {
      // ignore
    }
    const message =
      (payload as { message?: string })?.message ?? res.statusText ?? 'Lỗi kết nối API';
    throw new ApiError(res.status, message, { message });
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export { REMOTE_HOST as REAL_API_HOST };
