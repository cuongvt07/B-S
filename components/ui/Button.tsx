import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'ghost' | 'outline' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  // Primary = nút CTA "shine" vàng/trắng/đen (da ở class .btn-shine-skin, globals.css).
  primary: 'btn-shine-skin font-semibold',
  ghost:
    'rounded-sm transition-colors bg-transparent text-primary hover:text-primary-light active:text-primary-dark disabled:text-on-light-muted',
  outline:
    'rounded-sm transition-colors bg-transparent border border-border text-on-light hover:bg-background-subtle disabled:opacity-50',
  danger:
    'rounded-sm transition-colors bg-danger text-white hover:opacity-90 active:opacity-80 disabled:bg-cta-soft disabled:text-on-light-muted',
};

// Chiều cao cố định để mọi variant (viền 1px hay 3px) cao BẰNG NHAU khi đứng
// cạnh nhau — box-sizing: border-box nên viền nằm trong chiều cao. Căn giữa theo
// flex nên không cần padding dọc.
const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-base',
  lg: 'h-12 px-8 text-base font-semibold',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth,
    className,
    disabled,
    children,
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2',
        'disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading ? (
        <span
          aria-hidden
          className="h-4 w-4 animate-spin rounded-full border-2 border-current/40 border-t-current"
        />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!loading && rightIcon}
    </button>
  );
});
