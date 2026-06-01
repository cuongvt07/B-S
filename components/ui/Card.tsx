import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padded?: boolean;
  flat?: boolean;
}

export function Card({ children, className, padded = true, flat = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface border border-brdr rounded-md',
        padded && 'p-4',
        !flat && 'shadow-raised',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
