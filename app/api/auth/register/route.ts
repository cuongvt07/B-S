import { NextResponse } from 'next/server';
import { users } from '@/mocks/data/users';
import { createToken, SESSION_COOKIE_NAME } from '@/mocks/session';
import type { User } from '@/types';

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    email?: string;
    password?: string;
    name?: string;
    phone?: string;
  } | null;

  if (!body?.email || !body?.password || !body?.name || !body?.phone) {
    return NextResponse.json({ message: 'Vui lòng nhập đầy đủ thông tin' }, { status: 400 });
  }
  if (users.some((u) => u.email.toLowerCase() === body.email!.toLowerCase())) {
    return NextResponse.json({ message: 'Email đã được sử dụng' }, { status: 409 });
  }

  const newUser: User = {
    id: `u-${Date.now()}`,
    email: body.email,
    name: body.name,
    phone: body.phone,
    role: 'user',
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);

  const token = createToken(newUser.id);
  const res = NextResponse.json({ data: { user: newUser, token } });
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
