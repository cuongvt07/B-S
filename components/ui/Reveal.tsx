import type { ReactNode } from 'react';

type Direction = 'up' | 'left' | 'right' | 'scale' | 'fade';

interface Props {
  children: ReactNode;
  delay?: number;
  direction?: Direction;
  className?: string;
  threshold?: number;
}

export function Reveal({
  children,
  className,
}: Props) {
  return (
    <div className={className}>{children}</div>
  );
}
