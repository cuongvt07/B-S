import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'default' | 'vip' | 'vipGlass' | 'success' | 'danger' | 'outline';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-surface-subtle text-ink',
  // Trên nền sáng (trang chi tiết, so sánh, hồ sơ): gold trên nền vàng nhạt.
  vip: 'bg-primary/10 text-primary border border-primary/25',
  // Đè trên ảnh (card tin/xe): nền trắng mờ + chữ/icon vàng, dễ nhìn.
  vipGlass: 'bg-white/85 text-primary border border-white/70 shadow-raised backdrop-blur-sm',
  success: 'bg-price-soft text-price',
  danger: 'bg-danger-soft text-danger',
  outline: 'bg-transparent border border-brdr text-ink',
};

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-semibold',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
