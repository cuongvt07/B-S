import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

export function formatPrice(price: number, unit: 'month' | 'total'): string {
  if (price >= 1_000_000_000) {
    const v = price / 1_000_000_000;
    const formatted = v % 1 === 0 ? v.toString() : v.toFixed(2);
    return `${formatted} tỷ${unit === 'month' ? '/tháng' : ''}`;
  }
  if (price >= 1_000_000) {
    const v = price / 1_000_000;
    const formatted = v % 1 === 0 ? v.toString() : v.toFixed(1);
    return `${formatted} triệu${unit === 'month' ? '/tháng' : ''}`;
  }
  if (price >= 1_000) {
    return `${(price / 1_000).toFixed(0)} nghìn${unit === 'month' ? '/tháng' : ''}`;
  }
  return `${price.toLocaleString('vi-VN')} đ${unit === 'month' ? '/tháng' : ''}`;
}

export function formatArea(area: number): string {
  return `${area.toLocaleString('vi-VN')} m²`;
}

export function formatTimeAgo(iso: string): string {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: vi });
  } catch {
    return '';
  }
}

export function formatNumber(n: number): string {
  return n.toLocaleString('vi-VN');
}
