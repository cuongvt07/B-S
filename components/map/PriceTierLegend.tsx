import { cn } from '@/lib/utils';

interface TierDef {
  label: string;
  color: string; // text + border colour class
  bg: string; // hover/bg tone
  svg: string;
}

const TIERS: TierDef[] = [
  {
    label: 'Dưới 1.5 tỷ · dưới 5tr/tháng',
    color: 'text-price border-price',
    bg: 'bg-price-soft',
    svg:
      '<path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  {
    label: '1.5 – 5 tỷ · 5 – 15tr/tháng',
    color: 'text-primary border-primary',
    bg: 'bg-primary/10',
    svg:
      '<path d="M3 10l9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 21V12h6v9" fill="none" stroke="currentColor" stroke-width="2"/>',
  },
  {
    label: '5 – 15 tỷ · 15 – 50tr/tháng',
    color: 'text-vip border-vip',
    bg: 'bg-vip-soft',
    svg:
      '<path d="M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1M10 21v-4h4v4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  {
    label: 'Trên 15 tỷ · trên 50tr/tháng',
    color: 'text-danger border-danger',
    bg: 'bg-danger-soft',
    svg:
      '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18M2 22h20M10 6h4M10 10h4M10 14h4M10 18h4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  },
];

export function PriceTierLegend({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-md border border-brdr bg-white p-3', className)}>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
        Chú thích icon theo giá
      </p>
      <ul className="space-y-1.5">
        {TIERS.map((t) => (
          <li key={t.label} className="flex items-center gap-2">
            <span
              className={cn(
                'grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 bg-white',
                t.color
              )}
              dangerouslySetInnerHTML={{
                __html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">${t.svg}</svg>`,
              }}
            />
            <span className={cn('text-[11px] font-medium', t.color.split(' ')[0])}>{t.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
