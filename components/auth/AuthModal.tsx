'use client';

import { Modal, SegmentedControl } from '@/components/ui';
import { useAuthModal, type AuthView } from '@/lib/hooks/useAuthModal';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export function AuthModal() {
  const open = useAuthModal((s) => s.open);
  const view = useAuthModal((s) => s.view);
  const nextUrl = useAuthModal((s) => s.nextUrl);
  const setView = useAuthModal((s) => s.setView);
  const close = useAuthModal((s) => s.close);

  return (
    <Modal open={open} onClose={close} size="sm" hideClose={false} title="Tài khoản">
      <div className="-mt-1">
        <div className="mb-5 flex justify-center">
          <SegmentedControl
            options={[
              { value: 'login', label: 'Đăng nhập' },
              { value: 'register', label: 'Đăng ký' },
            ]}
            value={view}
            onChange={(v) => setView(v as AuthView)}
            accent="primary"
            fullWidth
          />
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
