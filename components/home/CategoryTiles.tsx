import Link from 'next/link';
import { Building2, Car, Bike } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Tile {
  label: string;
  desc: string;
  href: string;
  Icon: LucideIcon;
  accent: string;
  image: string;
}

const TILES: Tile[] = [
  {
    label: 'Nhà đất',
    desc: 'Mua bán · Cho thuê',
    href: '/tin-dang',
    Icon: Building2,
    accent: 'bg-primary/10 text-primary',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=70',
  },
  {
    label: 'Ô tô',
    desc: 'Xe mới & đã qua sử dụng',
    href: '/xe?loai=car',
    Icon: Car,
    accent: 'bg-amber-100 text-amber-700',
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=600&q=70',
  },
  {
    label: 'Xe máy',
    desc: 'Xe số · Tay ga · Côn tay',
    href: '/xe?loai=motorbike',
    Icon: Bike,
    accent: 'bg-emerald-100 text-emerald-700',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=70',
  },
];

export function CategoryTiles() {
  return (
    <section className="container-app pt-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {TILES.map((t) => {
          const Icon = t.Icon;
          return (
            <Link
              key={t.label}
              href={t.href}
              className="unstyled group relative flex items-center gap-3 overflow-hidden rounded-md border border-brdr bg-white p-4 shadow-raised transition-shadow hover:shadow-elevated"
            >
              {/* Themed backdrop — fades into white so text stays readable. */}
              <span aria-hidden className="pointer-events-none absolute inset-0">
                <span
                  className="absolute inset-y-0 right-0 w-2/3 bg-cover bg-center opacity-25 transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${t.image}')` }}
                />
                <span className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/30" />
              </span>

              <span className={`icon-chip relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-md ${t.accent}`}>
                <Icon size={24} />
              </span>
              <span className="relative z-10 min-w-0">
                <span className="block text-base font-semibold text-ink group-hover:text-primary">{t.label}</span>
                <span className="block text-xs text-ink-muted">{t.desc}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
