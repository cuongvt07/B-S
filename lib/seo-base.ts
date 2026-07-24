import { headers } from 'next/headers';

/**
 * Base URL khớp CHÍNH host đang phục vụ request (apex hay www, http hay https).
 *
 * Google báo "URL không được phép cho sơ đồ trang web tại vị trí này" khi URL
 * trong sitemap khác host với nơi Google đọc sitemap (vd sitemap ở
 * www.domain nhưng URL bên trong là domain không www). Lấy host thật từ header
 * giúp sitemap/robots luôn khớp domain được nộp. Fallback về canonical_base khi
 * không có header (bối cảnh tĩnh).
 */
export function requestBaseUrl(fallback: string): string {
  try {
    const h = headers();
    const host = h.get('x-forwarded-host') || h.get('host');
    if (host) {
      const proto = h.get('x-forwarded-proto') || 'https';
      return `${proto}://${host}`.replace(/\/$/, '');
    }
  } catch {
    // headers() không khả dụng → dùng fallback bên dưới.
  }
  return fallback.replace(/\/$/, '');
}
