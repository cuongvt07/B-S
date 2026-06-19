'use client';

import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type DrawerSide = 'left' | 'right' | 'bottom';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: DrawerSide;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sideClasses: Record<DrawerSide, string> = {
  left: 'left-0 top-0 h-full',
  right: 'right-0 top-0 h-full',
  bottom: 'bottom-0 inset-x-0 w-full rounded-t-md',
};

const sideAnimation: Record<DrawerSide, string> = {
  left: 'animate-slideInLeft',
  right: 'animate-slideInRight',
  bottom: 'animate-slideInBottom',
};

const widthBySize = {
  sm: 'w-[85%] max-w-xs',
  md: 'w-[90%] max-w-md',
  lg: 'w-[95%] max-w-lg',
};

export function Drawer({
  open,
  onClose,
  side = 'left',
  title,
  description,
  children,
  footer,
  size = 'sm',
  className,
}: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const widthClass = side === 'bottom' ? '' : widthBySize[size];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/55 animate-fadeIn will-change-opacity"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'absolute flex flex-col bg-white shadow-deep transform-gpu will-change-transform',
          sideClasses[side],
          widthClass,
          sideAnimation[side],
          side === 'bottom' && 'max-h-[88vh]',
          className
        )}
      >
        {side === 'bottom' && (
          <div className="pt-2 pb-1">
            <span className="mx-auto block h-1 w-10 rounded-full bg-brdr" />
          </div>
        )}

        {(title || true) && (
          <div className="flex items-start justify-between gap-3 border-b border-brdr px-4 py-3">
            <div className="min-w-0 flex-1">
              {title && <span className="text-base font-semibold text-ink">{title}</span>}
              {description && <p className="mt-1 text-xs text-ink-muted">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng"
              className="-m-1 grid h-9 w-9 shrink-0 place-items-center rounded-sm text-ink-muted hover:bg-surface-subtle hover:text-ink"
            >
              <X size={20} />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>

        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-brdr px-4 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
