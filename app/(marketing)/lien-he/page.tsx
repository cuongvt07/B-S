import type { Metadata } from 'next';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Breadcrumbs } from '@/components/seo';
import { ContactForm } from '@/components/forms/ContactForm';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Liên hệ',
  description: 'Liên hệ với đội ngũ BDS Việt — hỗ trợ tin đăng, hợp tác, phản hồi.',
};

const INFO = [
  { Icon: Phone, label: 'Hotline', value: SITE.contactPhone, accent: 'text-primary', bg: 'bg-primary/10' },
  { Icon: Mail, label: 'Email', value: SITE.contactEmail, accent: 'text-price', bg: 'bg-price-soft' },
  {
    Icon: MapPin,
    label: 'Trụ sở',
    value: 'Tầng 12, Toà nhà ABC, 123 Lê Lợi, Quận 1, TP.HCM',
    accent: 'text-vip',
    bg: 'bg-vip-soft',
  },
  {
    Icon: Clock,
    label: 'Giờ làm việc',
    value: 'Thứ 2 - Thứ 7: 8h00 - 18h00',
    accent: 'text-ink',
    bg: 'bg-surface-subtle',
  },
];

export default function ContactPage() {
  return (
    <div className="container-app py-8">
      <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: 'Liên hệ' }]} />
      <header className="mt-4 mb-6">
        <h1 className="text-2xl font-semibold text-ink sm:text-3xl">Liên hệ với chúng tôi</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Mọi yêu cầu hỗ trợ, hợp tác hoặc góp ý xin vui lòng gửi qua kênh dưới đây.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-md border border-brdr bg-white p-6 shadow-raised">
          <h2 className="mb-4 text-lg font-semibold text-ink">Thông tin liên hệ</h2>
          <ul className="space-y-4">
            {INFO.map((it) => {
              const Icon = it.Icon;
              return (
                <li key={it.label} className="flex items-start gap-3">
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-md ${it.bg} ${it.accent}`}
                  >
                    <Icon size={18} />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-ink-muted">{it.label}</p>
                    <p className="text-sm font-semibold text-ink">{it.value}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
