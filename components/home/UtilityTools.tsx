import Link from 'next/link';
import { Compass, FileText, Calculator, Sun, Sparkles, Map } from 'lucide-react';

const TOOLS = [
  {
    label: 'Xem tuổi xây nhà',
    desc: 'Tra cứu năm hợp tuổi làm nhà',
    href: '/tien-ich/tuoi-xay-nha',
    Icon: Compass,
    color: 'text-vip',
    bg: 'bg-vip-soft',
  },
  {
    label: 'Chi phí làm nhà',
    desc: 'Ước tính chi phí xây dựng',
    href: '/tien-ich/chi-phi-xay-nha',
    Icon: FileText,
    color: 'text-danger',
    bg: 'bg-danger-soft',
  },
  {
    label: 'Tính lãi suất',
    desc: 'Tính khoản vay ngân hàng',
    href: '/tien-ich/tinh-lai-suat',
    Icon: Calculator,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    label: 'Tư vấn phong thuỷ',
    desc: 'Hướng nhà, bố trí nội thất',
    href: '/tien-ich/phong-thuy',
    Icon: Sun,
    color: 'text-vip',
    bg: 'bg-vip-soft',
  },
  {
    label: 'Bản đồ quy hoạch',
    desc: 'Tra cứu quy hoạch khu vực',
    href: '/tien-ich/quy-hoach',
    Icon: Map,
    color: 'text-price',
    bg: 'bg-price-soft',
  },
  {
    label: 'Wiki bất động sản',
    desc: 'Thuật ngữ và kiến thức BĐS',
    href: '/wiki',
    Icon: Sparkles,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
];

export function UtilityTools() {
  return (
    <section className="container-app py-8">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-ink sm:text-2xl">Hỗ trợ tiện ích</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Công cụ miễn phí giúp bạn ra quyết định nhanh và đúng
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {TOOLS.map((t) => {
          const Icon = t.Icon;
          return (
            <Link
              key={t.href}
              href={t.href}
              className="unstyled group flex flex-col items-start gap-2 rounded-md border border-brdr bg-white p-4 shadow-raised transition-all hover:-translate-y-0.5 hover:shadow-elevated hover:border-primary"
            >
              <span
                className={`grid h-10 w-10 place-items-center rounded-md transition-transform group-hover:animate-pulseSoft ${t.bg} ${t.color}`}
              >
                <Icon size={20} />
              </span>
              <p className="text-sm font-semibold text-ink group-hover:text-primary">{t.label}</p>
              <p className="text-xs text-ink-muted">{t.desc}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
