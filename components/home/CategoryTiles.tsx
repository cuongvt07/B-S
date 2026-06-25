import Link from 'next/link';
import { Building2, Car, Bike } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Tile {
  label: string;
  desc: string;
  href: string;
  Icon: LucideIcon;
  accent: string;
}

const TILES: Tile[] = [
  { label: 'Nhà đất', desc: 'Mua bán · Cho thuê', href: '/tin-dang', Icon: Building2, accent: 'bg-primary/10 text-primary' },
  { label: 'Ô tô', desc: 'Xe mới & đã qua sử dụng', href: '/xe?loai=car', Icon: Car, accent: 'bg-amber-100 text-amber-700' },
  { label: 'Xe máy', desc: 'Xe số · Tay ga · Côn tay', href: '/xe?loai=motorbike', Icon: Bike, accent: 'bg-emerald-100 text-emerald-700' },
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
              className="unstyled group flex items-center gap-3 rounded-md border border-brdr bg-white p-4 shadow-raised transition-shadow hover:shadow-elevated"
            >
              <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-md ${t.accent}`}>
                <Icon size={24} />
              </span>
              <span className="min-w-0">
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
