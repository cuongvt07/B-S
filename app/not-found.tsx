import Link from 'next/link';
import { Home, Search, ArrowRight, MapPin, Building2, FileSearch } from '@/components/icons';
import { NotFoundSearch } from '@/components/layout/NotFoundSearch';

const QUICK_LINKS = [
  { href: '/tin-dang', label: 'Tất cả tin đăng', icon: Building2 },
  { href: '/tin-dang/map', label: 'Bản đồ tin đăng', icon: MapPin },
  { href: '/blog', label: 'Tin tức BĐS', icon: FileSearch },
  { href: '/lien-he', label: 'Liên hệ hỗ trợ', icon: Search },
];

const POPULAR = [
  { href: '/cho-thue', label: 'Cho thuê' },
  { href: '/mua-ban', label: 'Mua bán' },
  { href: '/can-ho', label: 'Căn hộ' },
  { href: '/nha-nguyen-can', label: 'Nhà nguyên căn' },
  { href: '/phong-tro', label: 'Phòng trọ' },
  { href: '/van-phong', label: 'Văn phòng' },
];

export default function NotFound() {
  return (
    <section className="container-app py-12 lg:py-20">
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        {/* Left: copy + actions */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-brdr bg-surface-subtle px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-danger" /> Lỗi 404
          </span>
          <h1 className="mt-4 text-3xl font-semibold leading-tight text-ink sm:text-4xl lg:text-5xl">
            Không tìm thấy trang bạn cần
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-muted sm:text-base">
            Đường dẫn có thể đã thay đổi, tin đăng đã được gỡ, hoặc bạn gõ nhầm địa chỉ. Hãy thử
            tìm kiếm lại hoặc khám phá các khu vực phổ biến bên dưới.
          </p>

          {/* Search */}
          <div className="mt-6">
            <NotFoundSearch />
          </div>

          {/* Primary actions */}
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/"
              className="unstyled inline-flex items-center gap-2 rounded-sm bg-champagne px-5 py-3 text-sm font-semibold text-champagne-ink shadow-raised transition hover:bg-champagne-hover"
            >
              <Home size={16} /> Về trang chủ
            </Link>
            <Link
              href="/tin-dang"
              className="unstyled inline-flex items-center gap-2 rounded-sm border border-brdr px-5 py-3 text-sm font-semibold text-ink transition hover:border-primary hover:text-primary"
            >
              Xem tất cả tin đăng <ArrowRight size={14} />
            </Link>
          </div>

          {/* Popular tags */}
          <div className="mt-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Khám phá nhanh
            </p>
            <div className="flex flex-wrap gap-2">
              {POPULAR.map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="unstyled inline-flex items-center rounded-full border border-brdr bg-white px-3 py-1.5 text-xs font-medium text-ink transition hover:border-primary hover:text-primary"
                >
                  {p.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right: big visual 404 */}
        <div className="relative mx-auto w-full max-w-md">
          <div
            aria-hidden
            className="relative grid place-items-center rounded-md bg-gradient-to-br from-primary/5 via-white to-vip-soft p-8"
            style={{ aspectRatio: '4 / 3' }}
          >
            <div className="text-[clamp(8rem,18vw,12rem)] font-extrabold leading-none tracking-tighter text-ink-strong/10">
              404
            </div>
            <div className="absolute inset-0 grid place-items-center">
              <div className="rounded-md border border-brdr bg-white/95 px-6 py-4 text-center shadow-elevated backdrop-blur-sm">
                <FileSearch size={28} className="mx-auto text-primary" />
                <p className="mt-2 text-sm font-semibold text-ink">Trang không tồn tại</p>
                <p className="text-xs text-ink-muted">Hãy thử các gợi ý bên trái</p>
              </div>
            </div>
          </div>

          {/* Quick link tiles */}
          <ul className="mt-4 grid grid-cols-2 gap-2">
            {QUICK_LINKS.map((q) => {
              const Icon = q.icon;
              return (
                <li key={q.href}>
                  <Link
                    href={q.href}
                    className="unstyled flex items-center gap-2 rounded-sm border border-brdr bg-white px-3 py-2 text-xs font-semibold text-ink transition hover:border-primary hover:text-primary"
                  >
                    <Icon size={14} className="text-primary" />
                    {q.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
