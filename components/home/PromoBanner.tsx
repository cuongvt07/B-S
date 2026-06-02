'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Rocket,
  Briefcase,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Slide {
  badge: string;
  BadgeIcon: typeof ShieldCheck;
  titleMain: string;
  titleAccent: string;
  desc: string;
  features: string[];
  ctaPrimary: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  image: string;
  imageBadge: string;
  imageBadgeIcon: typeof ShieldCheck;
  accent: string; // accent color for slide
}

const SLIDES: Slide[] = [
  {
    badge: 'Tin xác thực',
    BadgeIcon: ShieldCheck,
    titleMain: 'Ưu tiên hiển thị —',
    titleAccent: 'Dẫn đầu vị trí',
    desc: 'Tin đăng được xác thực chủ sở hữu sẽ được đẩy lên top kết quả tìm kiếm và hiển thị cao hơn so với tin thường.',
    features: [
      'Tăng 3-5x lượt liên hệ',
      'Huy hiệu xác thực nổi bật',
      'Ưu tiên xếp hạng SEO',
      'Hỗ trợ duyệt nhanh 24/7',
    ],
    ctaPrimary: { label: 'Xác thực ngay', href: '/tai-khoan/dang-tin' },
    ctaSecondary: { label: 'Tìm hiểu thêm', href: '/quy-che' },
    image:
      'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=720&q=80',
    imageBadge: 'ĐÃ XÁC THỰC',
    imageBadgeIcon: ShieldCheck,
    accent: '#10b981',
  },
  {
    badge: 'Tin VIP',
    BadgeIcon: Rocket,
    titleMain: 'Đẩy top tin đăng —',
    titleAccent: 'Tăng x10 lượt xem',
    desc: 'Gói VIP giúp tin của bạn luôn nằm trong top kết quả, hiển thị trên nhiều landing page SEO và banner trang chủ.',
    features: [
      'Top 5 mỗi tìm kiếm',
      'Banner trang chủ luân phiên',
      'Huy hiệu VIP nổi bật',
      'Tin đăng tự refresh hàng ngày',
    ],
    ctaPrimary: { label: 'Đăng tin VIP', href: '/tai-khoan/dang-tin' },
    ctaSecondary: { label: 'Xem bảng giá', href: '/quy-che' },
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=720&q=80',
    imageBadge: 'VIP 3',
    imageBadgeIcon: Rocket,
    accent: '#f59e0b',
  },
  {
    badge: 'Gói môi giới',
    BadgeIcon: Briefcase,
    titleMain: 'Dành cho môi giới —',
    titleAccent: 'Quản lý hàng trăm tin',
    desc: 'Dashboard chuyên nghiệp cho broker. Quản lý leads, thống kê hiệu suất từng tin đăng, gửi chiến dịch email tự động.',
    features: [
      'Quản lý không giới hạn tin',
      'Theo dõi leads & chuyển đổi',
      'Báo cáo doanh thu real-time',
      'Hỗ trợ ưu tiên dành riêng',
    ],
    ctaPrimary: { label: 'Đăng ký môi giới', href: '/dang-ky' },
    ctaSecondary: { label: 'So sánh gói', href: '/quy-che' },
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=720&q=80',
    imageBadge: 'PRO',
    imageBadgeIcon: Briefcase,
    accent: '#3b82f6',
  },
  {
    badge: 'Báo cáo thị trường',
    BadgeIcon: BarChart3,
    titleMain: 'Phân tích thị trường —',
    titleAccent: 'Báo cáo Q1/2026',
    desc: 'Dữ liệu giá BĐS theo khu vực, biến động giao dịch, dự báo xu hướng — cập nhật hàng quý từ chuyên gia.',
    features: [
      'Heatmap giá theo quận',
      'So sánh dự án cùng phân khúc',
      'Dự báo xu hướng 6 tháng',
      'Tải PDF báo cáo miễn phí',
    ],
    ctaPrimary: { label: 'Xem báo cáo', href: '/blog?tag=Phân%20tích' },
    ctaSecondary: { label: 'Đăng ký nhận tin', href: '/dang-ky' },
    image:
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=720&q=80',
    imageBadge: 'BÁO CÁO',
    imageBadgeIcon: BarChart3,
    accent: '#ef4444',
  },
];

const AUTO_INTERVAL = 7000;

export function PromoBanner() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((i: number) => setIdx((i + SLIDES.length) % SLIDES.length), []);
  const next = useCallback(() => goTo(idx + 1), [idx, goTo]);
  const prev = useCallback(() => goTo(idx - 1), [idx, goTo]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, AUTO_INTERVAL);
    return () => clearInterval(t);
  }, [next, paused]);

  return (
    <section className="container-app py-6">
      <div
        className="relative overflow-hidden rounded-md text-white shadow-elevated"
        style={{
          background:
            'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 35%, #262626 70%, #333333 100%)',
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Decorative subtle blobs (low opacity, neutral) */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />

        {/* Slide stack — cross-fade transition */}
        <div className="relative min-h-[460px] sm:min-h-[420px] md:min-h-[440px]">
          {SLIDES.map((slide, i) => {
            const BadgeIcon = slide.BadgeIcon;
            const ImgBadgeIcon = slide.imageBadgeIcon;
            const active = i === idx;
            return (
              <div
                key={i}
                aria-hidden={!active}
                className={cn(
                  'absolute inset-0 grid grid-cols-1 items-center gap-6 px-6 py-10 transition-all duration-700 ease-out md:grid-cols-[1.4fr_1fr] md:px-10 md:py-12',
                  active
                    ? 'opacity-100 translate-y-0'
                    : 'pointer-events-none opacity-0 translate-y-2'
                )}
              >
                {/* Left content */}
                <div className="space-y-4">
                  <span
                    className="inline-flex items-center gap-1 rounded-sm px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white"
                    style={{ background: slide.accent }}
                  >
                    <BadgeIcon size={14} /> {slide.badge}
                  </span>
                  <h3 className="text-2xl font-semibold leading-tight text-white sm:text-3xl lg:text-4xl">
                    {slide.titleMain}{' '}
                    <span
                      className="font-semibold underline decoration-2 underline-offset-4"
                      style={{ color: slide.accent, textDecorationColor: `${slide.accent}99` }}
                    >
                      {slide.titleAccent}
                    </span>
                  </h3>
                  <p className="max-w-xl text-sm text-white/80 sm:text-base">{slide.desc}</p>
                  <ul className="grid grid-cols-1 gap-2 text-sm text-white/85 sm:grid-cols-2">
                    {slide.features.map((f) => (
                      <li key={f} className="inline-flex items-center gap-2">
                        <CheckCircle2 size={16} className="shrink-0" style={{ color: slide.accent }} /> {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link
                      href={slide.ctaPrimary.href}
                      className="unstyled inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-3 text-sm font-semibold text-white shadow-elevated transition hover:bg-primary-hover"
                    >
                      {slide.ctaPrimary.label}
                      <ArrowRight size={16} />
                    </Link>
                    {slide.ctaSecondary && (
                      <Link
                        href={slide.ctaSecondary.href}
                        className="unstyled inline-flex items-center gap-2 rounded-sm border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
                      >
                        {slide.ctaSecondary.label}
                      </Link>
                    )}
                  </div>
                </div>

                {/* Right image */}
                <div className="relative hidden md:block">
                  <div
                    className="relative mx-auto aspect-[3/4] max-w-[260px] rotate-3 overflow-hidden rounded-md border-4 border-white/15 shadow-deep"
                    style={{ background: `linear-gradient(135deg, ${slide.accent}33, ${slide.accent}11)` }}
                  >
                    <Image
                      src={slide.image}
                      alt={slide.badge}
                      fill
                      sizes="260px"
                      className="object-cover"
                      loading="lazy"
                      unoptimized
                    />
                    <div
                      className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-sm px-2 py-1 text-xs font-semibold text-white shadow-raised"
                      style={{ background: slide.accent }}
                    >
                      <ImgBadgeIcon size={12} /> {slide.imageBadge}
                    </div>
                    {/* subtle gradient overlay for legibility */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="relative flex items-center justify-between px-6 pb-5 md:px-10 md:pb-6">
          <div className="flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-500',
                  i === idx ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'
                )}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="Slide trước"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur-sm transition hover:bg-white/15"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Slide sau"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur-sm transition hover:bg-white/15"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
