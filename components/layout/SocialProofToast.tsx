'use client';

import { useEffect, useState } from 'react';
import { BadgeCheck, Crown, Home, UserPlus, X, type LucideIcon } from '@/components/icons';

const USERS = [
  'Nguyễn Hoàng Minh', 'Trần Anh Tuấn', 'Lê Thu Hương', 'Phạm Quốc Bảo', 'Võ Thanh Tùng',
  'Đặng Ngọc Anh', 'Bùi Minh Châu', 'Đỗ Đức Thịnh', 'Hồ Khánh Linh', 'Ngô Hải Nam',
  'Dương Quỳnh Trang', 'Lý Tuấn Kiệt', 'Nguyễn Gia Hân', 'Trần Minh Khang', 'Lê Quốc Việt',
  'Phạm Thanh Thảo', 'Võ Nhật Huy', 'Đặng Thùy Dung', 'Bùi Anh Khoa', 'Đỗ Phương Uyên',
  'Hồ Đức Long', 'Ngô Mai Anh', 'Dương Thành Đạt', 'Lý Bảo Trâm', 'Nguyễn Văn Phúc',
  'Trần Ngọc Lan', 'Lê Hoàng Sơn', 'Phạm Minh Thư', 'Võ Quốc Khánh', 'Đặng Hải Yến',
  'Bùi Thanh Bình', 'Đỗ Kim Ngân', 'Hồ Anh Dũng', 'Ngô Thảo Vy', 'Dương Minh Trí',
  'Lý Ngọc Mai', 'Nguyễn Thành Công', 'Trần Thu Hà', 'Lê Anh Quân', 'Phạm Bảo Ngọc',
  'Võ Minh Hiếu', 'Đặng Thanh Tâm', 'Bùi Quốc Hưng', 'Đỗ Như Quỳnh', 'Hồ Tuấn Anh',
  'Ngô Thanh Trúc', 'Dương Quốc Cường', 'Lý Hoài An', 'Nguyễn Đức Mạnh', 'Trần Khánh Ly',
] as const;

const ACTIVITIES: { message: string; icon: LucideIcon }[] = [
  { message: 'vừa đăng ký thành viên mới', icon: UserPlus },
  { message: 'vừa đăng tin bán nhà tại Quy Nhơn', icon: Home },
  { message: 'vừa đăng tin cho thuê căn hộ', icon: Home },
  { message: 'vừa đăng thành công một bất động sản', icon: Home },
  { message: 'vừa nâng cấp gói Tin VIP', icon: Crown },
  { message: 'vừa mua gói đăng tin chuyên nghiệp', icon: Crown },
  { message: 'vừa xác thực tài khoản thành công', icon: BadgeCheck },
];

const DETAILS = ['Vài giây trước', '1 phút trước', '2 phút trước', 'Vừa hoàn tất'] as const;

interface SocialEvent {
  actor: string;
  message: string;
  detail: string;
  icon: LucideIcon;
}

function randomItem<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function maskName(name: string) {
  const parts = name.split(' ');
  const last = parts.pop() ?? '';
  return `${parts.join(' ')} ${last.charAt(0)}***`;
}

function randomMaskedPhone() {
  const prefixes = ['32', '33', '34', '35', '36', '37', '38', '39', '70', '76', '77', '78', '79', '81', '82', '83', '84', '85', '86', '88', '89', '90', '91', '93', '94', '96', '97', '98'];
  const tail = String(Math.floor(Math.random() * 10_000_000)).padStart(7, '0');
  const phone = `0${randomItem(prefixes)}${tail}`;
  return `${phone.slice(0, 3)}** *** ${phone.slice(-3)}`;
}

function createEvent(): SocialEvent {
  const activity = randomItem(ACTIVITIES);
  const actor = Math.random() < 0.32 ? randomMaskedPhone() : maskName(randomItem(USERS));
  return {
    actor,
    message: activity.message,
    detail: randomItem(DETAILS),
    icon: activity.icon,
  };
}

function randomDelay() {
  return 3_000 + Math.floor(Math.random() * 5_001);
}

export function SocialProofToast() {
  const [event, setEvent] = useState<SocialEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let showTimer: ReturnType<typeof setTimeout>;
    let hideTimer: ReturnType<typeof setTimeout>;

    const schedule = () => {
      showTimer = setTimeout(() => {
        setEvent(createEvent());
        setVisible(true);

        hideTimer = setTimeout(() => {
          setVisible(false);
          schedule();
        }, 3_000);
      }, randomDelay());
    };

    schedule();
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!event) return null;

  const Icon = event.icon;

  return (
    <aside
      className="social-proof-toast"
      data-visible={visible}
      aria-live="polite"
      aria-hidden={!visible}
    >
      <span className="social-proof-toast__icon" aria-hidden="true">
        <Icon size={18} />
      </span>
      <div className="social-proof-toast__content">
        <p><strong>{event.actor}</strong> {event.message}</p>
        <span>{event.detail}</span>
      </div>
      <button
        type="button"
        aria-label="Đóng thông báo"
        onClick={() => setVisible(false)}
      >
        <X size={14} />
      </button>
    </aside>
  );
}
