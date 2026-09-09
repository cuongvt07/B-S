/** Định dạng số tiền VNĐ, vd 15000000 -> "15.000.000". */
export function formatVnd(amount: number): string {
  return Math.round(amount).toLocaleString('vi-VN');
}

/** Định dạng ngày giờ ngắn gọn, vd "Hôm nay, 14:20" / "02/11/2025". */
export function formatVaultDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const time = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  if (isToday) return `Hôm nay, ${time}`;

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return `Hôm qua, ${time}`;

  return date.toLocaleDateString('vi-VN');
}
