import Link from 'next/link';
import { Home, Car, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Banner {
  title: string;
  desc: string;
  href: string;
  cta: string;
  Icon: LucideIcon;
}

const BANNERS: Banner[] = [
  {
    title: 'Định giá bất động sản',
    desc: 'Biết ngay giá trị nhà đất của bạn theo dữ liệu thị trường.',
    href: '/tien-ich/dinh-gia-bat-dong-san',
    cta: 'Định giá ngay',
    Icon: Home,
  },
  {
    title: 'Định giá xe cũ',
    desc: 'Tra cứu giá xe nhanh chóng, chính xác trước khi mua bán.',
    href: '/tien-ich/dinh-gia-xe-cu',
    cta: 'Định giá ngay',
    Icon: Car,
  },
];

export function ValuationBanners() {
  return (
    <section className="container-app pt-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {BANNERS.map((b) => {
          const Icon = b.Icon;
          return (
            <Link
              key={b.title}
              href={b.href}
              className="unstyled group relative min-h-[150px] overflow-hidden rounded-md p-5 text-white shadow-raised"
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
                <div className="flex items-start gap-3">
                  <span className="icon-chip grid h-11 w-11 shrink-0 place-items-center rounded-md bg-gold text-gold-ink">
                    <Icon size={22} />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold !text-white">{b.title}</h3>
                    <p className="mt-1 text-sm text-white/80">{b.desc}</p>
                  </div>
                </div>
                <span className="inline-flex w-fit items-center gap-2 rounded-sm bg-gold px-4 py-2 text-sm font-semibold text-gold-ink transition-colors group-hover:bg-gold-hover">
                  {b.cta} <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
