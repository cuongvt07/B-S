import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightAddon?: ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, leftIcon, rightAddon, fullWidth = true, className, id, ...props },
  ref
) {
  const inputId = id ?? props.name;
  return (
    <div className={cn(fullWidth && 'w-full')}>
      {label && (
        <label htmlFor={inputId} className="mb-1 block text-sm font-semibold text-ink">
          {label}
        </label>
      )}
      <div
        className={cn(
          'flex items-center rounded-sm border bg-white px-3 py-2 transition-colors',
          error ? 'border-danger' : 'border-brdr focus-within:border-primary'
        )}
      >
        {leftIcon && <span className="mr-2 text-ink-muted">{leftIcon}</span>}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'min-h-[24px] w-full bg-transparent text-sm text-ink placeholder:text-ink-muted',
            'focus:outline-none disabled:bg-surface-subtle disabled:text-ink-muted',
            className
          )}
          {...props}
        />
        {rightAddon && <span className="ml-2 text-ink-muted">{rightAddon}</span>}
      </div>
      {(hint || error) && (
        <p className={cn('mt-1 text-xs', error ? 'text-danger' : 'text-ink-muted')}>
          {error || hint}
        </p>
      )}
    </div>
  );
});
