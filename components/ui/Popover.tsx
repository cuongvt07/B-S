'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface PopoverProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  align?: 'left' | 'right';
  className?: string;
  width?: string;
}

export function Popover({
  open,
  onClose,
  children,
  align = 'right',
  className,
  width = 'w-[360px]',
}: PopoverProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className={cn(
        'absolute top-full z-50 mt-2 max-h-[480px] flex flex-col overflow-hidden rounded-md border border-brdr bg-white shadow-elevated animate-modalIn',
        align === 'right' ? 'right-0' : 'left-0',
        width,
        className
      )}
    >
      {children}
    </div>
  );
}
