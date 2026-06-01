import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, ChevronDown } from 'lucide-react';
import { Button, Card } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Gói môi giới chuyên nghiệp',
  description: 'Nâng cấp tài khoản môi giới để quản lý hàng trăm tin đăng, theo dõi hiệu suất và chốt khách hàng nhanh hơn.',
};

const TIERS = [
  {
    slug: 'starter',
    name: 'Starter',
    tagline: 'Phù hợp cá nhân thử nghiệm',
    price: 'Miễn phí',
    sub: '',
    features: [
      'Đăng tối đa 5 tin/tháng',
      'Hiển thị tin chuẩn',
      'Quản lý cơ bản',
      'Hỗ trợ qua email',
    ],
    cta: 'Bắt đầu miễn phí',
    primary: false,
  },
  {
    slug: 'pro',
    name: 'Pro',
    tagline: 'Cho môi giới chuyên nghiệp',
    price: '599K',
    sub: '/tháng',
    features: [
      'Đăng tối đa 50 tin/tháng',
      'Đẩy top 10 lượt/tháng',
      'Huy hiệu môi giới xác thực',
      'Báo cáo lượt xem & liên hệ real-time',
      'Quản lý leads từ tin đăng',
      'Hỗ trợ ưu tiên qua hotline',
    ],
    cta: 'Đăng ký gói Pro',
    primary: true,
  },
  {
    slug: 'enterprise',
    name: 'Enterprise',
    tagline: 'Cho công ty môi giới và sàn',
    price: '1.999K',
    sub: '/tháng',
    features: [
      'Tin đăng không giới hạn',
      'Đẩy top không giới hạn',
      'API tích hợp CRM',
      'White-label logo riêng',
      'Account manager dành riêng',
      'Báo cáo BI nâng cao',
    ],
    cta: 'Liên hệ tư vấn',
    primary: false,
  },
];

const FAQS = [
  {
    q: 'Tôi có thể nâng cấp hay hạ cấp gói bất kỳ lúc nào không?',
    a: 'Có. Bạn có thể nâng cấp ngay lập tức, phần phí chênh lệch sẽ được tính theo tỷ lệ thời gian còn lại. Khi hạ cấp, gói mới có hiệu lực ở chu kỳ thanh toán kế tiếp.',
  },
  {
    q: 'Thanh toán như thế nào?',
    a: 'Hỗ trợ chuyển khoản, ví điện tử (Momo, ZaloPay, VNPay), thẻ tín dụng quốc tế (Visa/Master). Tự động gia hạn hàng tháng, có thể huỷ bất cứ lúc nào.',
  },
  {
    q: 'Có hỗ trợ xuất hoá đơn VAT không?',
    a: 'Có. Vào mục "Thanh toán" trong dashboard, chọn giao dịch cần xuất và điền thông tin doanh nghiệp. Hoá đơn điện tử được gửi qua email trong vòng 24h.',
  },
  {
    q: 'Tôi có được dùng thử Pro miễn phí không?',
    a: 'Tài khoản môi giới mới được dùng thử 14 ngày miễn phí gói Pro. Không cần khai báo thẻ tín dụng. Hết thời gian thử, tài khoản tự động về Starter nếu không nâng cấp.',
  },
  {
    q: 'Sự khác nhau giữa Pro và Enterprise là gì?',
    a: 'Pro phù hợp cá nhân và đội nhỏ (đến 50 tin/tháng). Enterprise dành cho sàn / công ty môi giới cần API tích hợp, không giới hạn tin, branding riêng và account manager hỗ trợ sâu.',
  },
];

const QUOTES = [
  {
    avatar: 'https://i.pravatar.cc/120?img=12',
    name: 'Nguyễn Văn An',
    role: 'Môi giới tự do, TP.HCM',
    quote:
      'Từ khi dùng gói Pro, lượng leads tăng gấp 3 lần. Dashboard real-time giúp tôi biết khách nào quan tâm tin nào để chăm sóc kịp thời.',
  },
  {
    avatar: 'https://i.pravatar.cc/120?img=47',
    name: 'Trần Thuỳ Linh',
    role: 'Trưởng phòng kinh doanh, Sàn ABC',
    quote:
      'Hệ thống đẩy top và huy hiệu xác thực giúp tin của team luôn được chú ý. Phí hợp lý so với hiệu quả mang lại.',
  },
  {
    avatar: 'https://i.pravatar.cc/120?img=33',
    name: 'Phạm Quốc Đức',
    role: 'Founder Sky Land',
    quote:
      'Enterprise API giúp chúng tôi đồng bộ kho tin từ CRM nội bộ lên BDS Việt chỉ trong vài giờ. Account manager hỗ trợ rất chuyên nghiệp.',
  },
];

export default function BrokerPackagePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-hover to-primary-active py-16 text-white">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="container-app relative text-center">
          <span className="inline-flex items-center rounded-sm bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur-sm">
            Dành cho môi giới
          </span>
          <h1 className="mt-4 text-3xl font-semibold sm:text-5xl">
            Quản lý hàng trăm tin đăng — Dễ dàng và chuyên nghiệp
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-white/90 sm:text-lg">
            Nâng cấp tài khoản môi giới để mở rộng quy mô, theo dõi hiệu suất và chốt khách hàng nhanh hơn.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/dang-ky" className="unstyled">
              <Button className="!bg-white !text-ink-strong hover:!bg-white/90">
                Đăng ký miễn phí
              </Button>
            </Link>
            <Link
              href="/quy-che"
              className="unstyled inline-flex items-center justify-center px-4 py-3 text-sm font-semibold text-white/90 hover:underline"
            >
              Xem điều khoản
            </Link>
          </div>
        </div>
      </section>

      <section className="container-app py-12">
        <h2 className="text-center text-2xl font-semibold text-ink">Bảng giá gói dịch vụ</h2>
        <p className="mt-2 text-center text-sm text-ink-muted">
          Chọn gói phù hợp với quy mô và mục tiêu của bạn
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TIERS.map((t) => (
            <div
              key={t.slug}
              className={
                'relative flex flex-col rounded-md border bg-white p-6 shadow-raised ' +
                (t.primary ? 'border-primary ring-2 ring-primary/30' : 'border-brdr')
              }
            >
              {t.primary && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                  Phổ biến nhất
                </span>
              )}
              <p className="text-xl font-semibold text-ink">{t.name}</p>
              <p className="mt-1 text-sm text-ink-muted">{t.tagline}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-semibold text-ink">{t.price}</span>
                {t.sub && <span className="text-sm text-ink-muted">{t.sub}</span>}
              </div>
              <ul className="mt-6 flex-1 space-y-2">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-ink">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-price" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={`/dang-ky?tier=${t.slug}`} className="unstyled mt-6 block">
                <Button variant={t.primary ? 'primary' : 'outline'} fullWidth>
                  {t.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface-subtle py-12">
        <div className="container-app mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-semibold text-ink">Câu hỏi thường gặp</h2>
          <div className="space-y-2">
            {FAQS.map((f, i) => (
              <details
                key={i}
                className="group rounded-md border border-brdr bg-white px-4"
              >
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

      <section className="container-app py-12">
        <h2 className="mb-8 text-center text-2xl font-semibold text-ink">
          Môi giới nói gì về BDS Việt
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {QUOTES.map((q) => (
            <Card key={q.name} padded className="!p-6">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-full">
                  <Image src={q.avatar} alt={q.name} fill sizes="48px" className="object-cover" />
                </div>
                <div>
                  <p className="font-semibold text-ink">{q.name}</p>
                  <p className="text-xs text-ink-muted">{q.role}</p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink">&ldquo;{q.quote}&rdquo;</p>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
