import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME, SEED_PASSWORD, userFromToken } from '@/mocks/session';

export async function POST(req: Request) {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const user = userFromToken(token);
  if (!user) {
    return NextResponse.json({ message: 'Chưa đăng nhập' }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as {
    currentPassword?: string;
    newPassword?: string;
  } | null;

  if (!body?.currentPassword || !body?.newPassword) {
    return NextResponse.json({ message: 'Thiếu trường bắt buộc' }, { status: 400 });
  }
  if (body.currentPassword !== SEED_PASSWORD) {
    return NextResponse.json({ message: 'Mật khẩu hiện tại không đúng' }, { status: 400 });
  }
  if (body.newPassword.length < 6) {
    return NextResponse.json(
      { message: 'Mật khẩu mới phải có ít nhất 6 ký tự' },
      { status: 400 }
    );
  }

  return NextResponse.json({ data: { ok: true } });
}
