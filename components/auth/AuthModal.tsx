'use client';

import { Modal } from '@/components/ui';
import { useAuthModal } from '@/lib/hooks/useAuthModal';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { cn } from '@/lib/utils';

const TABS = [
  { value: 'login' as const, label: 'Đăng nhập' },
  { value: 'register' as const, label: 'Đăng ký' },
];

export function AuthModal() {
  const open = useAuthModal((s) => s.open);
  const view = useAuthModal((s) => s.view);
  const nextUrl = useAuthModal((s) => s.nextUrl);
  const setView = useAuthModal((s) => s.setView);
  const close = useAuthModal((s) => s.close);

  return (
    <Modal open={open} onClose={close} size="sm" hideClose={false} title="Tài khoản">
      <div className="-mt-2">
        <div className="mb-5 flex gap-1 border-b border-brdr">
          {TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setView(t.value)}
              className={cn(
                '-mb-px px-4 py-2 text-sm font-semibold border-b-2 transition-colors',
                view === t.value
                  ? 'border-primary text-primary'
                  : 'border-transparent text-ink-muted hover:text-ink'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {view === 'login' ? (
          <LoginForm onSuccess={close} nextUrl={nextUrl} />
        ) : (
          <RegisterForm onSuccess={close} nextUrl={nextUrl} />
        )}

        <p className="mt-5 text-center text-sm text-ink-muted">
          {view === 'login' ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
          <button
            type="button"
            onClick={() => setView(view === 'login' ? 'register' : 'login')}
            className="font-semibold text-primary hover:underline"
          >
            {view === 'login' ? 'Đăng ký ngay' : 'Đăng nhập'}
          </button>
        </p>
      </div>
    </Modal>
  );
}
