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
        <span>Đang tải thông tin tài khoản...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-ink">Thông tin cá nhân</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Cập nhật thông tin tài khoản và đổi mật khẩu của bạn.
        </p>
      </header>
      <ProfileEditForm user={user} />
    </div>
  );
}
