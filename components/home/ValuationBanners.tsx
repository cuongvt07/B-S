import Link from 'next/link';
import Image from 'next/image';
import { Home, Car, ArrowRight } from '@/components/icons';
import type { LucideIcon } from '@/components/icons';

interface Banner {
  title: string;
  desc: string;
  href: string;
  cta: string;
  Icon: LucideIcon;
  image: string;
}

const BANNERS: Banner[] = [
  {
    title: 'Định giá bất động sản',
    desc: 'Biết ngay giá trị nhà đất của bạn theo dữ liệu thị trường.',
    href: '/tien-ich/dinh-gia-bat-dong-san',
    cta: 'Định giá ngay',
    Icon: Home,
    image: '/bg/bg-3.jpg',
  },
  {
    title: 'Định giá xe cũ',
    desc: 'Tra cứu giá xe nhanh chóng, chính xác trước khi mua bán.',
    href: '/tien-ich/dinh-gia-xe-cu',
    cta: 'Định giá ngay',
    Icon: Car,
    image: '/bg/bg-4.jpg',
  },
];

function BannerCard({ b }: { b: Banner }) {
  const Icon = b.Icon;
  return (
    <Link
      href={b.href}
      className="unstyled group relative min-h-[170px] overflow-hidden rounded-md p-5 shadow-raised"
    >
      <Image
        src={b.image}
        alt=""
        aria-hidden
        fill
        sizes="(max-width: 768px) 100vw, 400px"
        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
      />
      {/* Overlay tối với chữ trắng để đọc rõ */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-ink-strong/90 via-ink/80 to-ink-strong/60" />
      <div className="relative z-10 flex h-full flex-col justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="icon-chip grid h-11 w-11 shrink-0 place-items-center rounded-md bg-primary text-white">
            <Icon size={22} />
          </span>
          <div>
            <h3 className="text-lg font-bold text-white">{b.title}</h3>
            <p className="mt-1 text-sm text-white/80">{b.desc}</p>
          </div>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors group-hover:bg-primary-light">
          {b.cta} <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  );
}

export function ValuationBanners() {
  return (
    <section className="container-app pt-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <BannerCard b={BANNERS[0]} />

        {/* Middle showcase image */}
        <div className="group relative min-h-[170px] overflow-hidden rounded-md shadow-raised">
          <Image
            src="/bg/hero-1.jpg"
            alt=""
            aria-hidden
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent" />
        </div>

        <BannerCard b={BANNERS[1]} />
      </div>
    </section>
  );
}
