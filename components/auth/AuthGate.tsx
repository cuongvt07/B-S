'use client';

import type { ReactNode } from 'react';
import { Lock, LogIn } from '@/components/icons';
import { useCurrentUser } from '@/lib/hooks/useAuth';
import { useAuthModal } from '@/lib/hooks/useAuthModal';
import { cn } from '@/lib/utils';

interface Props {
  children: ReactNode;
  /** Headline shown on the overlay. */
  title?: string;
  /** Secondary helper line. */
  description?: string;
  className?: string;
  /** Blur intensity — default is `md`. */
  blur?: 'sm' | 'md' | 'lg';
  /**
   * Layout variant:
   * - 'overlay' (default): blurred children + centered card with title/desc/buttons.
   *   Use in roomy areas (sidebar, profile header).
   * - 'inline': single compact button replaces the children entirely. No card.
   *   Use in tight footers / table cells.
   */
  variant?: 'overlay' | 'inline';
  /** Compact label shown in `variant="inline"`. */
  inlineLabel?: string;
}

/**
 * Wrap any subtree to require login before it becomes interactive.
 * Anonymous users see a blurred copy of the content with a centered CTA card.
 * Authed users see the children untouched.
 */
export function AuthGate({
  children,
  title = 'Đăng nhập để xem thông tin liên hệ',
  description = 'Số điện thoại, Zalo, Messenger sẽ hiện sau khi đăng nhập.',
  className,
  blur = 'md',
  variant = 'overlay',
  inlineLabel = 'Đăng nhập để liên hệ',
}: Props) {
  const { data: user, isLoading } = useCurrentUser();
  const openLogin = useAuthModal((s) => s.openLogin);
  const openRegister = useAuthModal((s) => s.openRegister);

  // While the /me request is in flight (only for users with auth hint), render
  // children unblocked but non-interactive to avoid layout flicker.
  if (isLoading) {
    return (
      <div className={cn('relative', className)} aria-busy>
        {children}
      </div>
    );
  }

  if (user) {
    return <div className={className}>{children}</div>;
  }

  // Compact inline variant — single pill button, no card / no blurred children.
  if (variant === 'inline') {
    return (
      <button
        type="button"
        onClick={() => openLogin()}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-sm border border-primary/30 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary transition hover:border-primary hover:bg-primary/10',
          className
        )}
      >
        <Lock size={13} />
        {inlineLabel}
      </button>
    );
  }

  const blurClass = blur === 'sm' ? 'blur-[2px]' : blur === 'lg' ? 'blur-md' : 'blur-[4px]';

  return (
    <div className={cn('relative isolate', className)}>
      {/* Blurred placeholder content (non-interactive) */}
      <div className={cn('pointer-events-none select-none opacity-60', blurClass)} aria-hidden>
        {children}
      </div>

      {/* Overlay CTA */}
      <div className="absolute inset-0 grid place-items-center p-3">
        <div className="w-full max-w-[280px] rounded-md border border-brdr bg-white/95 p-4 text-center shadow-elevated backdrop-blur-sm">
          <div className="icon-chip mx-auto grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
            <Lock size={18} />
          </div>
          <p className="mt-2 text-sm font-semibold text-ink">{title}</p>
          {description && (
            <p className="mt-1 text-xs leading-relaxed text-ink-muted">{description}</p>
          )}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => openLogin()}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-sm bg-champagne px-3 py-2 text-xs font-semibold text-champagne-ink transition hover:bg-champagne-hover"
            >
              <LogIn size={14} /> Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => openRegister()}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-sm border border-brdr px-3 py-2 text-xs font-semibold text-ink transition hover:border-primary hover:text-primary"
            >
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
