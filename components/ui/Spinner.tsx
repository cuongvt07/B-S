import { cn } from '@/lib/utils';

export function Spinner({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <span
      role="status"
      aria-label="loading"
      style={{ width: size, height: size }}
      className={cn(
        'inline-block animate-spin rounded-full border-2 border-brdr border-t-ink',
        className
      )}
    />
  );
}
