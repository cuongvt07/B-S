'use client';

import { useRef } from 'react';

function generateKey(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  // Fallback cho môi trường không có crypto.randomUUID (HTTP không an toàn,
  // trình duyệt rất cũ) — đủ ngẫu nhiên cho mục đích chống double-submit,
  // không cần bảo mật cấp mật mã ở đây.
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Sinh 1 idempotency key ỔN ĐỊNH cho một "phiên giao dịch" — giữ nguyên qua
 * mọi lần re-render VÀ mọi lần bấm lại (double-tap, mất mạng rồi thử lại) của
 * CÙNG một amount. Khi amount đổi (user sửa số tiền khác) sẽ coi là giao dịch
 * MỚI nên sinh key mới — đúng ý định nghiệp vụ (không phải chặn nhầm).
 */
export function useIdempotencyKey(dedupeOn: string | number): string {
  const ref = useRef<{ dedupeOn: string | number; key: string } | null>(null);

  if (!ref.current || ref.current.dedupeOn !== dedupeOn) {
    ref.current = { dedupeOn, key: generateKey() };
  }

  return ref.current.key;
}
