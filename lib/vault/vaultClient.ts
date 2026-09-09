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

/**
 * Gọi khi BẤT KỲ request nào (không chỉ /auth/me) trả 401 — nghĩa là token đã
 * hết hạn/bị thu hồi giữa chừng. Xoá token ngay để tránh vòng lặp gọi API với
 * token hỏng; useVaultAuthFlag đăng ký listener này 1 lần ở layout (app).
 */
type UnauthorizedListener = () => void;
let onUnauthorized: UnauthorizedListener | null = null;

export function setVaultUnauthorizedHandler(fn: UnauthorizedListener | null): void {
  onUnauthorized = fn;
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

  // FormData (upload file, vd nộp ảnh CCCD) phải gửi NGUYÊN, KHÔNG JSON.stringify
  // và KHÔNG tự set Content-Type — trình duyệt tự thêm boundary đúng chuẩn
  // multipart/form-data, tự set thủ công sẽ làm hỏng request.
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  let res: Response;
  try {
    res = await fetch(buildUrl(path, query), {
      ...rest,
      method: init.method ?? (body ? 'POST' : 'GET'),
      headers: {
        Accept: 'application/json',
        ...(body && !isFormData ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
      // Cố ý KHÔNG có credentials: 'include' — Vault không dùng cookie.
    });
  } catch {
    // fetch() tự throw (mất mạng hoàn toàn, không phải lỗi HTTP) — phân biệt
    // rõ với lỗi server: KHÔNG chắc request đã tới server hay chưa, nên
    // status=0 để nơi gọi (vd rut-tien) biết đây là trường hợp "không rõ đã
    // tạo giao dịch hay chưa", tránh khuyến khích bấm thử lại ngay lập tức.
    throw new VaultApiError(
      'Không kết nối được máy chủ. Vui lòng kiểm tra mạng và xem lại lịch sử giao dịch trước khi thử lại.',
      0,
    );
  }

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    // Bắt 401 TOÀN CỤC — không chỉ ở /auth/me. Nếu token hết hạn/bị thu hồi
    // giữa lúc đang dùng (vd bấm rút tiền), báo cho listener để tự đăng xuất
    // ngay thay vì để nguyên token hỏng, gây lặp lỗi 401 ở mọi request sau.
    if (res.status === 401 && token) {
      onUnauthorized?.();
    }

    const message =
      res.status === 401
        ? 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại'
        : payload?.message || `Lỗi máy chủ (${res.status})`;
    throw new VaultApiError(message, res.status, payload?.errors);
  }

  return (payload?.data ?? payload) as T;
}
