import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, ChevronDown, Phone, MessageCircle, Sparkles } from '@/components/icons';
import { getSiteSettings } from '@/lib/server-data';

export const metadata: Metadata = {
  title: 'Gói đăng tin môi giới',
  description:
    'Nâng số tin đăng mỗi ngày để tiếp cận nhiều khách hàng hơn. Liên hệ Zalo/hotline để kích hoạt gói.',
};

// Settings come from the CMS — keep this page fresh without a redeploy.
export const revalidate = 300;

const vnd = (n: number) => n.toLocaleString('vi-VN') + 'đ';

type Tier = {
  slug: string;
  name: string;
  tagline: string;
  quota: string;
  price: string;
  sub: string;
  features: string[];
  cta: string;
  primary: boolean;
};

export default async function BrokerPackagePage() {
  const settings = await getSiteSettings();
  const pkg = settings.packages;
  const phoneDigits = settings.contact.zalo_phone.replace(/\D/g, '');
  const ZALO_HREF = `https://zalo.me/${phoneDigits}`;
  const TEL_HREF = `tel:${phoneDigits}`;

  const TIERS: Tier[] = [
    {
      slug: 'free',
      name: 'Miễn phí',
      tagline: 'Dành cho người mới bắt đầu',
      quota: `${pkg.free_daily_quota} tin / ngày`,
      price: 'Miễn phí',
      sub: '',
      features: [
        `Đăng tối đa ${pkg.free_daily_quota} tin mỗi ngày`,
        'Hiển thị tin chuẩn',
        'Quản lý tin cơ bản',
        'Lưu tin yêu thích & tìm kiếm',
      ],
      cta: 'Dùng ngay',
      primary: false,
    },
    {
      slug: 'pro-30',
      name: `Gói ${pkg.tier_30_quota} tin`,
      tagline: 'Cho môi giới hoạt động đều',
      quota: `${pkg.tier_30_quota} tin / ngày`,
      price: vnd(pkg.tier_30_price),
      sub: '/ tháng',
      features: [
        `Đăng tối đa ${pkg.tier_30_quota} tin mỗi ngày`,
        'Toàn bộ quyền lợi gói Miễn phí',
        'Ưu tiên hiển thị hơn tài khoản thường',
        'Hỗ trợ qua hotline / Zalo',
      ],
      cta: 'Liên hệ kích hoạt',
      primary: true,
    },
    {
      slug: 'pro-50',
      name: `Gói ${pkg.tier_50_quota} tin`,
      tagline: 'Cho môi giới chuyên nghiệp',
      quota: `${pkg.tier_50_quota} tin / ngày`,
      price: vnd(pkg.tier_50_price),
      sub: '/ tháng',
      features: [
        `Đăng tối đa ${pkg.tier_50_quota} tin mỗi ngày`,
        `Toàn bộ quyền lợi gói ${pkg.tier_30_quota} tin`,
        'Mức hiển thị cao nhất',
        'Hỗ trợ ưu tiên qua hotline / Zalo',
      ],
      cta: 'Liên hệ kích hoạt',
      primary: false,
    },
  ];

  const FAQS = [
    {
      q: `Làm sao để mua gói ${pkg.tier_30_quota} tin hoặc ${pkg.tier_50_quota} tin?`,
      a: 'Hiện tại hệ thống chưa hỗ trợ thanh toán online. Bạn vui lòng bấm nút “Liên hệ Zalo” hoặc gọi hotline để được nhân viên kích hoạt gói thủ công. Sau khi xác nhận thanh toán, gói sẽ được nâng cấp ngay cho tài khoản của bạn.',
    },
    {
      q: 'Giới hạn “tin/ngày” được tính như thế nào?',
      a: `Mỗi tài khoản được đăng số tin tối đa trong một ngày tùy theo gói: Miễn phí ${pkg.free_daily_quota} tin, gói ${vnd(pkg.tier_30_price)} ${pkg.tier_30_quota} tin, gói ${vnd(pkg.tier_50_price)} ${pkg.tier_50_quota} tin. Số lượt sẽ được làm mới vào đầu mỗi ngày.`,
    },
    {
      q: 'Tôi có thể nâng cấp giữa chu kỳ không?',
      a: 'Có. Bạn chỉ cần liên hệ hotline/Zalo, nhân viên sẽ hỗ trợ nâng cấp và áp dụng ngay cho phần thời gian còn lại.',
    },
    {
      q: 'Gói có tự động gia hạn không?',
      a: 'Không tự động trừ tiền. Trước khi gói hết hạn, chúng tôi sẽ nhắc bạn gia hạn qua Zalo/điện thoại để bạn chủ động quyết định.',
    },
  ];

  const contactPhone = settings.contact.hotline;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        {/* Background image */}
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/bg/bg-6.jpg')",
          }}
        />
        {/* Overlay tối với chữ trắng */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-ink-strong/92 via-ink/88 to-ink-strong/85" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="container-app relative text-center">
          <span className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            <Sparkles size={13} /> Dành cho môi giới
          </span>
          <h1 className="mt-4 text-3xl font-bold text-white sm:text-5xl">
            Đăng nhiều tin hơn mỗi ngày — Tiếp cận nhiều khách hơn
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-white/85 sm:text-lg">
            Nâng cấp gói để tăng số tin đăng mỗi ngày. Chưa hỗ trợ thanh toán online —
            liên hệ Zalo hoặc hotline để được kích hoạt nhanh chóng.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href={ZALO_HREF} target="_blank" rel="noopener noreferrer" className="unstyled">
              <span className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm bg-primary px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-primary-light">
                <MessageCircle size={18} /> Liên hệ Zalo
              </span>
            </a>
            <a href={TEL_HREF} className="unstyled">
              <span className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm border border-white/40 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10">
                <Phone size={18} /> {contactPhone}
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container-app py-12">
        <h2 className="text-center text-2xl font-semibold text-ink">Bảng giá gói đăng tin</h2>
        <p className="mt-2 text-center text-sm text-ink-muted">
          Chọn gói phù hợp với nhu cầu đăng tin của bạn
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TIERS.map((t) => (
            <div
              key={t.slug}
              className={
                'relative flex flex-col rounded-md border bg-white p-6 shadow-raised ' +
                (t.primary ? 'border-brand ring-2 ring-brand/25' : 'border-brdr')
              }
            >
              {t.primary && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-champagne px-3 py-1 text-xs font-semibold text-champagne-ink">
                  Phổ biến nhất
                </span>
              )}
              <p className="text-xl font-semibold text-brand">{t.name}</p>
              <p className="mt-1 text-sm text-ink-muted">{t.tagline}</p>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-semibold text-ink">{t.price}</span>
                {t.sub && <span className="text-sm text-ink-muted">{t.sub}</span>}
              </div>
              <span className="mt-3 inline-flex w-fit items-center rounded-sm bg-brand-soft px-2.5 py-1 text-sm font-semibold text-brand">
                {t.quota}
              </span>

              <ul className="mt-6 flex-1 space-y-2">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-ink">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand" />
                    {f}
                  </li>
                ))}
              </ul>

              {t.slug === 'free' ? (
                <Link href="/dang-ky" className="unstyled mt-6 block">
                  <span className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-sm border border-brand px-4 py-3 text-base font-semibold text-brand transition-colors hover:bg-brand-soft">
                    {t.cta}
                  </span>
                </Link>
              ) : (
                <a
                  href={ZALO_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="unstyled mt-6 block"
                >
                  <span
                    className={
                      'inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-sm px-4 py-3 text-base font-semibold transition-colors ' +
                      (t.primary
                        ? 'bg-champagne text-champagne-ink hover:bg-champagne-hover'
                        : 'border border-champagne text-champagne-ink hover:bg-champagne-soft')
                    }
                  >
                    <MessageCircle size={16} /> {t.cta}
                  </span>
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Payment notice */}
        <div className="mx-auto mt-8 max-w-3xl rounded-md border border-champagne/50 bg-champagne-soft px-5 py-4 text-sm text-champagne-ink">
          <p className="font-semibold">Lưu ý về thanh toán</p>
          <p className="mt-1 leading-relaxed">
            Hệ thống hiện <strong>chưa hỗ trợ thanh toán online</strong>. Để mua hoặc gia hạn gói,
            vui lòng liên hệ qua{' '}
            <a href={ZALO_HREF} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
              Zalo
            </a>{' '}
            hoặc gọi hotline{' '}
            <a href={TEL_HREF} className="font-semibold underline">
              {contactPhone}
            </a>{' '}
            — nhân viên sẽ kích hoạt gói thủ công cho tài khoản của bạn.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-surface-subtle py-12">
        <div className="container-app mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-semibold text-ink">Câu hỏi thường gặp</h2>
          <div className="space-y-2">
            {FAQS.map((f, i) => (
              <details key={i} className="group rounded-md border border-brdr bg-white px-4">
                <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-sm font-semibold text-ink">
                  {f.q}
                  <ChevronDown
                    size={16}
                    className="text-ink-muted transition-transform group-open:rotate-180"
                  />
                </summary>
                <p className="pb-3 text-sm leading-relaxed text-ink-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA bottom */}
      <section className="container-app py-12">
        <div className="overflow-hidden rounded-md bg-primary px-6 py-10 text-center">
          <h2 className="text-2xl font-semibold text-white">Sẵn sàng nâng cấp gói đăng tin?</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-white/85">
            Liên hệ ngay để được tư vấn và kích hoạt gói phù hợp với nhu cầu của bạn.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href={ZALO_HREF} target="_blank" rel="noopener noreferrer" className="unstyled">
              <span className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm bg-cta px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-cta-hover">
                <MessageCircle size={18} /> Liên hệ Zalo
              </span>
            </a>
            <a href={TEL_HREF} className="unstyled">
              <span className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm border border-white/40 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10">
                <Phone size={18} /> Gọi {contactPhone}
              </span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
