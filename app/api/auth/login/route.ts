import { NextResponse } from 'next/server';
import { authenticate, createToken, SESSION_COOKIE_NAME } from '@/mocks/session';

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { email?: string; password?: string } | null;
  if (!body?.email || !body?.password) {
    return NextResponse.json({ message: 'Vui lòng nhập email và mật khẩu' }, { status: 400 });
  }
  const user = authenticate(body.email, body.password);
  if (!user) {
    return NextResponse.json({ message: 'Email hoặc mật khẩu không đúng' }, { status: 401 });
  }
  const token = createToken(user.id);
  const res = NextResponse.json({ data: { user, token } });
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
