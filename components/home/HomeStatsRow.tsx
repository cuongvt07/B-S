import { Building2, Car, Users, Award } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Stat {
  value: string;
  label: string;
  Icon: LucideIcon;
}

const STATS: Stat[] = [
  { value: '15.000+', label: 'Bất động sản', Icon: Building2 },
  { value: '3.200+', label: 'Tin đăng xe cộ', Icon: Car },
  { value: '8.000+', label: 'Khách hàng', Icon: Users },
  { value: '5 năm+', label: 'Kinh nghiệm', Icon: Award },
];

export function HomeStatsRow() {
  return (
    <section className="container-app pt-8">
      <div className="grid grid-cols-2 gap-3 rounded-md border border-brdr bg-white p-4 shadow-raised sm:grid-cols-4 sm:gap-4 sm:p-5">
        {STATS.map((s) => {
          const Icon = s.Icon;
          return (
            <div key={s.label} className="group flex items-center gap-3">
              <span className="icon-chip grid h-12 w-12 shrink-0 place-items-center rounded-md bg-brand/10 text-brand">
                <Icon size={24} />
              </span>
              <div className="min-w-0">
                <p className="no-break text-xl font-bold text-brand sm:text-2xl">{s.value}</p>
                <p className="truncate text-xs text-ink-muted">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
