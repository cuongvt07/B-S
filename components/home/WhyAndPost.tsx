import Link from 'next/link';
import {
  BadgeCheck,
  RefreshCw,
  Headphones,
  ShieldCheck,
  Megaphone,
  ArrowRight,
} from 'lucide-react';

const REASONS = [
  { Icon: BadgeCheck, label: 'Tin đăng thực', desc: 'Xác thực, không tin ảo' },
  { Icon: RefreshCw, label: 'Cập nhật mỗi ngày', desc: 'Dữ liệu mới liên tục' },
  { Icon: Headphones, label: 'Hỗ trợ tận tâm', desc: 'Đồng hành 8:00 - 21:00' },
  { Icon: ShieldCheck, label: 'Giao dịch an toàn', desc: 'Minh bạch, rõ ràng' },
];

export function WhyAndPost() {
  return (
    <section className="container-app pt-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.7fr_1fr]">
        {/* Vì sao chọn chúng tôi */}
        <div className="rounded-md border border-brdr bg-white p-5 shadow-raised">
          <h2 className="text-base font-semibold text-ink">Vì sao chọn chúng tôi?</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {REASONS.map((r) => {
              const Icon = r.Icon;
              return (
                <div
                  key={r.label}
                  className="group flex flex-col items-center gap-2 rounded-md bg-surface-subtle p-3 text-center transition-colors hover:bg-brand-soft"
                >
                  <span className="icon-chip grid h-11 w-11 place-items-center rounded-full bg-brand/10 text-brand">
                    <Icon size={20} />
                  </span>
                  <span className="text-sm font-semibold text-ink">{r.label}</span>
                  <span className="text-xs text-ink-muted">{r.desc}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Đăng tin miễn phí */}
        <Link
          href="/tai-khoan/dang-tin"
          className="unstyled group relative min-h-[160px] overflow-hidden rounded-md p-5 text-white shadow-raised"
        >
          <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-brand to-brand-active" />
          <div
            aria-hidden
            className="absolute inset-0 bg-repeat opacity-70"
            style={{ backgroundImage: "url('/brand/dots.svg')" }}
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/2 bg-no-repeat opacity-90 transition-transform duration-500 group-hover:scale-105"
            style={{
              backgroundImage: "url('/brand/skyline.svg')",
              backgroundSize: 'cover',
              backgroundPosition: 'bottom',
            }}
          />
          <div className="relative z-10 flex h-full flex-col justify-between gap-4">
            <div>
              <span className="icon-chip grid h-10 w-10 place-items-center rounded-md bg-gold text-gold-ink">
                <Megaphone size={20} />
              </span>
              <h3 className="mt-3 text-lg font-bold !text-white">Đăng tin miễn phí</h3>
              <p className="mt-1 text-sm text-white/80">
                Tiếp cận hàng nghìn khách hàng mỗi ngày — đăng tin chỉ trong 1 phút.
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-sm bg-gold px-4 py-2 text-sm font-semibold text-gold-ink transition-colors group-hover:bg-gold-hover">
              Đăng tin ngay <ArrowRight size={16} />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
