'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Building2,
  Users,
  MapPin,
  Newspaper,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';
import { listings } from '@/mocks/data/listings';
import { blogs } from '@/mocks/data/blogs';
import { cities } from '@/mocks/data/cities';
import { cn } from '@/lib/utils';

function useCountUp(target: number, duration = 1400, start = false) {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!start || startedRef.current) return;
    startedRef.current = true;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const progress = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);

  return value;
}

type Accent = 'blue' | 'green' | 'amber' | 'rose';

const ACCENT_MAP: Record<
  Accent,
  {
    iconBg: string;
    iconText: string;
    numberGradient: string;
    trendBg: string;
    trendText: string;
    topBar: string;
    glow: string;
  }
> = {
  blue: {
    iconBg: 'bg-gradient-to-br from-primary/15 to-primary/5',
    iconText: 'text-primary',
    numberGradient: 'bg-gradient-to-br from-primary to-primary-active bg-clip-text text-transparent',
    trendBg: 'bg-primary/10',
    trendText: 'text-primary',
    topBar: 'from-primary to-primary-active',
    glow: 'group-hover:shadow-[0_12px_32px_-12px_rgba(0,0,238,0.35)]',
  },
  green: {
    iconBg: 'bg-gradient-to-br from-price/20 to-price-soft',
    iconText: 'text-price',
    numberGradient: 'bg-gradient-to-br from-price to-emerald-700 bg-clip-text text-transparent',
    trendBg: 'bg-price-soft',
    trendText: 'text-price',
    topBar: 'from-price to-emerald-700',
    glow: 'group-hover:shadow-[0_12px_32px_-12px_rgba(5,150,105,0.35)]',
  },
  amber: {
    iconBg: 'bg-gradient-to-br from-vip/20 to-vip-soft',
    iconText: 'text-vip',
    numberGradient: 'bg-gradient-to-br from-vip to-amber-700 bg-clip-text text-transparent',
    trendBg: 'bg-vip-soft',
    trendText: 'text-vip',
    topBar: 'from-vip to-amber-700',
    glow: 'group-hover:shadow-[0_12px_32px_-12px_rgba(217,119,6,0.35)]',
  },
  rose: {
    iconBg: 'bg-gradient-to-br from-danger/15 to-danger-soft',
    iconText: 'text-danger',
    numberGradient: 'bg-gradient-to-br from-danger to-rose-800 bg-clip-text text-transparent',
    trendBg: 'bg-danger-soft',
    trendText: 'text-danger',
    topBar: 'from-danger to-rose-800',
    glow: 'group-hover:shadow-[0_12px_32px_-12px_rgba(220,38,38,0.35)]',
  },
};

interface StatCardProps {
  Icon: typeof Building2;
  target: number;
  suffix?: string;
  label: string;
  trend: string;
  accent: Accent;
  inView: boolean;
}

function StatCard({ Icon, target, suffix = '', label, trend, accent, inView }: StatCardProps) {
  const value = useCountUp(target, 1400, inView);
  const a = ACCENT_MAP[accent];

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-md border border-brdr bg-white p-6 shadow-raised transition-all duration-300',
        'hover:-translate-y-1 hover:border-transparent',
        a.glow
      )}
    >
      {/* Top accent bar */}
      <span
        className={cn(
          'absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-70 transition-opacity group-hover:opacity-100',
          a.topBar
        )}
      />

      {/* Decorative blob */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60',
          a.iconBg
        )}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div
          className={cn(
            'grid h-14 w-14 place-items-center rounded-md ring-1 ring-inset ring-white/40 backdrop-blur-sm',
            a.iconBg,
            a.iconText
          )}
        >
          <Icon size={26} strokeWidth={2.25} />
        </div>
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold',
            a.trendBg,
            a.trendText
          )}
        >
          <ArrowUpRight size={12} />
          Tăng
        </span>
      </div>

      <div className="relative mt-5">
        <p
          className={cn(
            'font-semibold tabular-nums leading-none tracking-tight',
            'text-5xl sm:text-[3.25rem]',
            a.numberGradient
          )}
        >
          {value.toLocaleString('vi-VN')}
          {suffix}
        </p>
        <p className="mt-3 text-sm font-medium text-ink">{label}</p>
        <p className={cn('mt-2 text-xs text-ink-muted', 'flex items-center gap-1')}>
          <span className={cn('h-1.5 w-1.5 rounded-full', a.trendBg.replace('bg-', 'bg-'))} />
          {trend}
        </p>
      </div>
    </div>
  );
}

export function StatsBar() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const activeCount = listings.filter((l) => l.status === 'active').length;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-white via-surface-subtle to-white"
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-price/5 blur-3xl" />

      <div className="container-app relative py-12">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary ring-1 ring-primary/20">
            <TrendingUp size={14} /> Số liệu nền tảng
          </span>
          <h2 className="mt-4 text-2xl font-semibold leading-tight text-ink sm:text-3xl lg:text-4xl">
            Cộng đồng{' '}
            <span className="bg-gradient-to-r from-primary to-price bg-clip-text text-transparent">
              BDS Việt
            </span>{' '}
            tin tưởng
          </h2>
          <p className="mt-3 text-sm text-ink-muted sm:text-base">
            Nền tảng tin đăng minh bạch, xác thực — kết nối hàng nghìn chủ nhà và người mua thuê mỗi
            ngày
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            Icon={Building2}
            target={activeCount}
            suffix="+"
            label="Tin đăng đang hiển thị"
            trend="Tăng 12% so với tháng trước"
            accent="blue"
            inView={inView}
          />
          <StatCard
            Icon={MapPin}
            target={cities.length}
            label="Tỉnh thành phủ sóng"
            trend="Trải dài toàn quốc"
            accent="green"
            inView={inView}
          />
          <StatCard
            Icon={Users}
            target={50}
            suffix="K+"
            label="Người dùng tin tưởng"
            trend="98% người dùng hài lòng"
            accent="amber"
            inView={inView}
          />
          <StatCard
            Icon={Newspaper}
            target={blogs.length}
            suffix="+"
            label="Bài viết kiến thức"
            trend="Cập nhật hàng tuần"
            accent="rose"
            inView={inView}
          />
        </div>
      </div>
    </section>
  );
}
