'use client';

import { ProfileEditForm } from '@/components/dashboard';
import { Spinner } from '@/components/ui';
import { useCurrentUser } from '@/lib/hooks/useAuth';

export default function ProfilePage() {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center gap-3 rounded-md border border-brdr bg-white p-10 text-sm text-ink-muted">
        <Spinner />
        <span>Dang tai thong tin tai khoan...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-ink">Thong tin ca nhan</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Cap nhat thong tin tai khoan va doi mat khau cua ban.
        </p>
      </header>
      <ProfileEditForm user={user} />
    </div>
  );
}
