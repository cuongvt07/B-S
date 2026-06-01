'use client';

import { GitCompare } from 'lucide-react';
import { useCompare } from '@/lib/hooks/useCompare';
import { cn } from '@/lib/utils';

interface Props {
  listingId: string;
  className?: string;
}

export function AddToCompareButton({ listingId, className }: Props) {
  const ids = useCompare((s) => s.ids);
  const toggle = useCompare((s) => s.toggle);
  const active = ids.includes(listingId);

  return (
    <button
      type="button"
      title={active ? 'Bỏ khỏi so sánh' : 'Thêm vào so sánh'}
      aria-label={active ? 'Bỏ khỏi so sánh' : 'Thêm vào so sánh'}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!active && ids.length >= 3) {
          alert('Chỉ so sánh tối đa 3 tin');
          return;
        }
        toggle(listingId);
      }}
      className={cn(
        'grid h-8 w-8 place-items-center rounded-full shadow-raised transition-colors',
        active ? 'bg-primary/10 text-primary' : 'bg-white/90 text-ink hover:text-primary',
        className
      )}
    >
      <GitCompare size={16} />
    </button>
  );
}
