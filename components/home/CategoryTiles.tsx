import Link from 'next/link';
import { Building2, KeyRound, LayoutGrid, Trees, Car, Bike, Truck, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Cat {
  label: string;
  href: string;
  Icon: LucideIcon;
  accent: string;
}

const CATS: Cat[] = [
  { label: 'Nhà đất bán', href: '/tin-dang?transactionType=sale', Icon: Building2, accent: 'bg-primary/10 text-primary' },
  { label: 'Nhà đất cho thuê', href: '/tin-dang?transactionType=rent', Icon: KeyRound, accent: 'bg-sky-100 text-sky-700' },
  { label: 'Dự án', href: '/tin-dang', Icon: LayoutGrid, accent: 'bg-indigo-100 text-indigo-700' },
  { label: 'Đất nền', href: '/tin-dang?propertyType=land', Icon: Trees, accent: 'bg-lime-100 text-lime-700' },
  { label: 'Ô tô', href: '/xe?loai=car', Icon: Car, accent: 'bg-amber-100 text-amber-700' },
  { label: 'Xe máy', href: '/xe?loai=motorbike', Icon: Bike, accent: 'bg-emerald-100 text-emerald-700' },
  { label: 'Xe tải', href: '/xe?loai=truck', Icon: Truck, accent: 'bg-orange-100 text-orange-700' },
  { label: 'Xe điện', href: '/xe?loai=electric', Icon: Zap, accent: 'bg-teal-100 text-teal-700' },
];

export function CategoryTiles() {
  return (
    <section className="container-app pt-5">
      <div className="flex gap-2.5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:justify-between lg:overflow-x-visible [&::-webkit-scrollbar]:hidden">
        {CATS.map((c) => {
          const Icon = c.Icon;
          return (
            <Link
              key={c.label}
              href={c.href}
              className="unstyled group flex shrink-0 items-center gap-2.5 rounded-full border border-brdr bg-white px-4 py-2.5 shadow-raised transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-elevated"
            >
              <span className={`icon-chip grid h-8 w-8 shrink-0 place-items-center rounded-full ${c.accent}`}>
                <Icon size={16} />
              </span>
              <span className="whitespace-nowrap text-sm font-semibold text-ink group-hover:text-primary">
                {c.label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
