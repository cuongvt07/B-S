import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { wrap: 'py-8', icon: 32, iconBox: 'h-12 w-12', title: 'text-base' },
  md: { wrap: 'py-12', icon: 36, iconBox: 'h-16 w-16', title: 'text-lg' },
  lg: { wrap: 'py-16', icon: 44, iconBox: 'h-20 w-20', title: 'text-xl' },
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  size = 'md',
}: EmptyStateProps) {
  const s = sizeMap[size];
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center px-4',
        s.wrap,
        className
      )}
    >
      {Icon && (
        <div
          className={cn(
            'mb-4 grid place-items-center rounded-full bg-surface-subtle text-ink-muted',
            s.iconBox
          )}
        >
          <Icon size={s.icon} />
        </div>
      )}
      <p className={cn('font-semibold text-ink', s.title)}>{title}</p>
      {description && (
        <p className="mt-2 max-w-md text-sm text-ink-muted">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
