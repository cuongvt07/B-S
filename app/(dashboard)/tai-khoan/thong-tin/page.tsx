import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE_NAME, userFromToken } from '@/mocks/session';
import { ProfileEditForm } from '@/components/dashboard';

export default function ProfilePage() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const user = userFromToken(token);
  if (!user) redirect('/dang-nhap?next=/tai-khoan/thong-tin');

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
