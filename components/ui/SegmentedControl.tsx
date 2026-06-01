'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface SegmentOption<T extends string = string> {
  value: T;
  label: ReactNode;
  icon?: ReactNode;
}

interface Props<T extends string = string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (v: T) => void;
  size?: 'sm' | 'md';
  fullWidth?: boolean;
  className?: string;
  accent?: 'ink' | 'primary';
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  size = 'md',
  fullWidth = false,
  className,
  accent = 'ink',
}: Props<T>) {
  const activeText = accent === 'primary' ? 'text-primary' : 'text-ink';

  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex items-center rounded-full border border-brdr bg-surface-subtle p-1',
        fullWidth && 'flex w-full',
        className
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full font-semibold transition-all',
              size === 'md' ? 'h-9 px-4 text-sm' : 'h-7 px-3 text-xs',
              active
                ? `bg-white shadow-raised ${activeText}`
                : 'text-ink-muted hover:text-ink',
              fullWidth && 'flex-1'
            )}
          >
            {opt.icon}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
