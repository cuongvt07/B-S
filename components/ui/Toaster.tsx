'use client';

import { Check, X, Info } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useToastStore } from '@/lib/hooks/useToast';

const ICON = { success: Check, error: X, info: Info } as const;

const TONE = {
  success: 'text-success',
  error: 'text-danger',
  info: 'text-primary',
} as const;

/** Hàng toast nổi ở đáy màn hình. Gắn 1 lần ở root (providers). */
export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[9999] flex flex-col items-center gap-2 px-4 sm:bottom-6"
      role="status"
      aria-live="polite"
    >
      {toasts.map((t) => {
        const Icon = ICON[t.type];
        return (
          <div
            key={t.id}
            className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-lg border border-brdr bg-white px-4 py-3 shadow-elevated animate-slideInBottom"
          >
            <Icon size={18} className={cn('shrink-0', TONE[t.type])} />
            <p className="flex-1 text-sm font-medium text-ink">{t.message}</p>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="unstyled shrink-0 text-ink-muted transition-colors hover:text-ink"
              aria-label="Đóng"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
